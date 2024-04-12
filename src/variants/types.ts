import type { ClassValue } from '@/concat/types';

type ClassPropKey = 'class' | 'className';

type ClassProp =
  | {
      class: ClassValue;
      className?: never;
    }
  | { class?: never; className: ClassValue }
  | { class?: never; className?: never };

type OmitUndefined<T> = T extends undefined ? never : T;

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T;

export type {
  ClassValue,
  ClassPropKey,
  ClassProp,
  OmitUndefined,
  StringToBoolean,
};
