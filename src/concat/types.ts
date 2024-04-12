export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | boolean
  | null
  | undefined;

export type ClassArray = ClassValue[];

export type ClassDictionary = Record<string, any>;
