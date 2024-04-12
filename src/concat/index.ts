import { ClassValue } from '@/variants/types';

function concatValues(value: ClassValue): string {
  let result = '';

  if (typeof value === 'string' || typeof value === 'number') {
    result = String(value);
  } else if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) {
          result && (result += ' ');
          result += concatValues(item);
        }
      }
    } else {
      for (const className in value) {
        if (value[className] === true) {
          result && (result += ' ');
          result += className;
        }
      }
    }
  }

  return result;
}

export function concat(...classNames: ClassValue[]): string {
  let result = '';

  for (const className of classNames) {
    const string = concatValues(className);
    if (string) {
      result && (result += ' ');
      result += string;
    }
  }

  return result;
}

export function liteConcat(
  ...classNames: Array<string | undefined | null | false>
) {
  return classNames.filter(Boolean).join(' ');
}

export default concat;