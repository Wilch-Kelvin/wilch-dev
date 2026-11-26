// Every API route answers in one of two shapes, so the browser code can
// always tell success from failure the same way:
//   success: { data }
//   failure: { error: { code, message } }
// `code` is stable for code to branch on; `message` is friendly and safe to
// show. Stack traces and provider errors never go back to the browser.

export type ApiError = { readonly code: string; readonly message: string };

export function json<T>(status: number, data: T, headers?: HeadersInit): Response {
  return Response.json({ data }, { status, headers });
}

export function fail(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } satisfies ApiError }, { status });
}
