/// <reference types="vite/client" />

interface ImportMeta {
  readonly glob: <T = unknown>(
    pattern: string,
    options?: {
      eager?: boolean;
      as?: string;
      query?: string;
      import?: string;
      exhaustive?: boolean;
    }
  ) => Record<string, T>;
}
