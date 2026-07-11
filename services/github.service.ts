const GITHUB_API = "https://api.github.com";

export class GitHubError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubError";
  }
}

export interface RemoteRepo {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  defaultBranch: string | null;
}

export interface RemoteCommit {
  sha: string;
  message: string;
  authorName: string | null;
  authorLogin: string | null;
  committedAt: Date;
  url: string;
}

export interface RemotePullRequest {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  authorLogin: string | null;
  headBranch: string | null;
  url: string;
  openedAt: Date;
  mergedAt: Date | null;
  closedAt: Date | null;
}

/**
 * Conditional-request cache (acceptance: rate-limit friendly). Survives
 * across requests in the same server process; a 304 costs no rate-limit
 * quota on GitHub.
 */
const etagCache = new Map<string, { etag: string; body: unknown }>();

async function githubFetch<T>(path: string): Promise<T> {
  const url = `${GITHUB_API}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const cached = etagCache.get(url);
  if (cached) headers["If-None-Match"] = cached.etag;

  const response = await fetch(url, { headers, cache: "no-store" });

  if (response.status === 304 && cached) return cached.body as T;
  if (response.status === 401) {
    throw new GitHubError("GitHub rejected the token (401) — check GITHUB_TOKEN");
  }
  if (response.status === 403 || response.status === 429) {
    throw new GitHubError(
      "GitHub rate limit hit — add a GITHUB_TOKEN in .env or try again later"
    );
  }
  if (response.status === 404) {
    throw new GitHubError(
      "Repository not found (404) — check owner/name, or add GITHUB_TOKEN for private repos"
    );
  }
  if (!response.ok) {
    throw new GitHubError(`GitHub API error (${response.status})`);
  }

  const body = (await response.json()) as T;
  const etag = response.headers.get("etag");
  if (etag) etagCache.set(url, { etag, body });
  return body;
}

/**
 * Accepts "owner/name", a github.com URL (with or without .git), or an
 * SSH remote, and returns the canonical "owner/name".
 */
export function parseRepoReference(raw: string): string {
  const input = raw.trim();
  const urlMatch = input.match(
    /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i
  );
  if (urlMatch) return `${urlMatch[1]}/${urlMatch[2]}`;
  if (/^[\w.-]+\/[\w.-]+$/.test(input)) return input;
  throw new GitHubError(
    'Could not parse the repository — use "owner/name" or a github.com URL'
  );
}

export async function fetchRepo(fullName: string): Promise<RemoteRepo> {
  const repo = await githubFetch<{
    name: string;
    owner: { login: string };
    full_name: string;
    html_url: string;
    default_branch?: string;
  }>(`/repos/${fullName}`);
  return {
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    defaultBranch: repo.default_branch ?? null,
  };
}

export async function fetchRecentCommits(
  fullName: string,
  perPage = 30
): Promise<RemoteCommit[]> {
  const commits = await githubFetch<
    {
      sha: string;
      html_url: string;
      commit: {
        message: string;
        author?: { name?: string; date?: string };
      };
      author?: { login?: string } | null;
    }[]
  >(`/repos/${fullName}/commits?per_page=${perPage}`);
  return commits.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message.split("\n")[0].slice(0, 300),
    authorName: commit.commit.author?.name ?? null,
    authorLogin: commit.author?.login ?? null,
    committedAt: commit.commit.author?.date
      ? new Date(commit.commit.author.date)
      : new Date(),
    url: commit.html_url,
  }));
}

export async function fetchPullRequests(
  fullName: string,
  perPage = 50
): Promise<RemotePullRequest[]> {
  const pulls = await githubFetch<
    {
      number: number;
      title: string;
      state: "open" | "closed";
      html_url: string;
      user?: { login?: string } | null;
      head?: { ref?: string };
      created_at: string;
      merged_at: string | null;
      closed_at: string | null;
    }[]
  >(`/repos/${fullName}/pulls?state=all&per_page=${perPage}&sort=updated&direction=desc`);
  return pulls.map((pull) => ({
    number: pull.number,
    title: pull.title.slice(0, 300),
    state: pull.merged_at ? "merged" : pull.state,
    authorLogin: pull.user?.login ?? null,
    headBranch: pull.head?.ref ?? null,
    url: pull.html_url,
    openedAt: new Date(pull.created_at),
    mergedAt: pull.merged_at ? new Date(pull.merged_at) : null,
    closedAt: pull.closed_at ? new Date(pull.closed_at) : null,
  }));
}
