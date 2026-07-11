"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumLabel } from "@/utils/format";

const ALL = "all";

export interface ToolbarFilter {
  /** URL search param this filter writes to (e.g. "status"). */
  param: string;
  placeholder: string;
  /** Enum values or explicit options. */
  options: readonly string[] | { value: string; label: string }[];
}

interface TableToolbarProps {
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
}

/**
 * Server-driven table filtering: writes search + filter values to URL
 * params (debounced for typing), so pages filter at the query level and
 * results stay shareable/bookmarkable.
 */
export function TableToolbar({
  searchPlaceholder = "Search…",
  filters = [],
}: TableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function apply(param: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    if (value && value !== ALL) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleSearch(value: string) {
    setSearch(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => apply("q", value.trim() || null), 300);
  }

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  const hasActiveFilters =
    Boolean(searchParams.get("q")) ||
    filters.some((filter) => searchParams.get(filter.param));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
          aria-label={searchPlaceholder}
        />
      </div>
      {filters.map((filter) => {
        const options =
          typeof filter.options[0] === "string"
            ? (filter.options as readonly string[]).map((value) => ({
                value,
                label: formatEnumLabel(value),
              }))
            : (filter.options as { value: string; label: string }[]);
        return (
          <Select
            key={filter.param}
            value={searchParams.get(filter.param) ?? ALL}
            onValueChange={(value) => apply(filter.param, value)}
          >
            <SelectTrigger className="w-36" aria-label={filter.placeholder}>
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{filter.placeholder}</SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            router.replace(pathname, { scroll: false });
          }}
        >
          <X className="size-3.5" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
