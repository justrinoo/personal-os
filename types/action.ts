/** Result returned by every server action. */
export interface ActionResult {
  ok: boolean;
  error?: string;
}

export const ACTION_OK: ActionResult = { ok: true };

export function actionError(error: string): ActionResult {
  return { ok: false, error };
}
