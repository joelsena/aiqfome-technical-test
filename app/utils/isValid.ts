type NonEmptyObject<T> = T extends object ? (keyof T extends never ? never : T) : T;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type NonEmptyArray<T> = T extends any[] ? (T["length"] extends 0 ? never : T) : T;

export function isValid<T>(input: T): input is NonNullable<NonEmptyObject<NonEmptyArray<T>>> {
  // tratamento para array
  if (Array.isArray(input)) return !!input.length;

  // tratamento para objeto
  if (typeof input === "object" && input !== null) return !!Object.keys(input).length;

  // default fallback
  return !!input;
}
