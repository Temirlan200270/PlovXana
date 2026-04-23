export type Result<T> =
  | Readonly<{ success: true; data: T }>
  | Readonly<{ success: false; error: string }>;

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T = never>(error: string): Result<T> {
  return { success: false, error };
}

