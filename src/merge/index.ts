import { twMerge as merge } from 'tailwind-merge';
import { concat } from '@/concat';
import { ClassValue } from '@/concat/types';

export type {
  ClassValidator,
  Config,
  DefaultClassGroupIds,
  DefaultThemeGroupIds,
  ClassNameValue,
} from 'tailwind-merge';

export {
  createTailwindMerge as createMerge,
  extendTailwindMerge as extendMerge,
  fromTheme,
  getDefaultConfig,
  mergeConfigs,
  twJoin as join,
  twMerge as merge,
} from 'tailwind-merge';

export * as validators from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return merge(concat(inputs));
}
