// https://github.com/metaplex-foundation/js

export type PartialKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RequiredKeys<T extends object, K extends keyof T = keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type Option<T> = T | null;

export type Opaque<T, K> = T & { __opaque__: K };

/** Instructions defined by the Associated Token program */
export enum AssociatedTokenInstruction {
  Create = 0,
  CreateIdempotent = 1,
  RecoverNested = 2,
}
