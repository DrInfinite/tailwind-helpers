import concat from '@/concat';
import type {
  ClassProp,
  ClassValue,
  OmitUndefined,
  StringToBoolean,
} from '@/variants/types';

type VariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  'class' | 'className'
>;

/**
 * Takes a value of any type and returns a formatted version of that value.
 *
 * If the value is a boolean or a number with the value of 0,
 * it will be converted to a string.
 *
 * Otherwise, the value will be returned as is.
 *
 * This function is used to normalize the values of props
 * that are specified as variants in the configuration.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const formatValue = <T extends unknown>(value: T) =>
  // eslint-disable-next-line no-nested-ternary
  typeof value === 'boolean' ? `${value}` : value === 0 ? '0' : value;

type ConfigSchema = Record<string, Record<string, ClassValue>>;

type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: StringToBoolean<keyof T[Variant]> | null | undefined;
};

type ConfigVariantsMulti<T extends ConfigSchema> = {
  [Variant in keyof T]?:
    | StringToBoolean<keyof T[Variant]>
    | StringToBoolean<keyof T[Variant]>[]
    | undefined;
};

type Config<T> = T extends ConfigSchema
  ? {
      variants?: T;
      defaultVariants?: ConfigVariants<T>;
      compoundVariants?: (T extends ConfigSchema
        ? (ConfigVariants<T> | ConfigVariantsMulti<T>) & ClassProp
        : ClassProp)[];
    }
  : never;

type Props<T> = T extends ConfigSchema
  ? ConfigVariants<T> & ClassProp
  : ClassProp;

/**
 * A higher-order function that generates a function that concatenates
 * classNames based on the props passed in.
 *
 * @template T A type that represents a configuration for the variants
 *
 * @param base An initial class name to concatenate with the rest of the
 * class names
 * @param config An optional configuration object that specifies how to
 * generate class names based on the props passed in
 *
 * @returns A function that takes an optional object of props and
 * concatenates class names based on the configuration passed in and the
 * props passed in
 */
const variants =
  <T>(base?: ClassValue, config?: Config<T>) =>
  (props?: Props<T>) => {
    if (config?.variants == null) {
      return concat(base, props?.class, props?.className);
    }

    const { variants, defaultVariants } = config;

    const getVariantClassNames = Object.keys(variants).map(
      (variant: keyof typeof variants) => {
        const variantProp = props?.[variant as keyof typeof props];
        const defaultVariantProp = defaultVariants?.[variant];

        if (variantProp === null) {
          return null;
        }

        const variantKey = (formatValue(variantProp) ||
          formatValue(
            defaultVariantProp,
          )) as keyof (typeof variants)[typeof variant];

        return variants[variant][variantKey];
      },
    );

    const propsWithoutUndefined =
      props &&
      Object.entries(props).reduce((acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }

        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

    const getCompoundVariantClassNames = config?.compoundVariants?.reduce(
      (
        acc,
        { class: cvClass, className: cvClassName, ...compoundVariantOptions },
      ) =>
        Object.entries(compoundVariantOptions).every(([key, value]) =>
          Array.isArray(value)
            ? value.includes(
                {
                  ...defaultVariants,
                  ...propsWithoutUndefined,
                }[key],
              )
            : {
                ...defaultVariants,
                ...propsWithoutUndefined,
              }[key] === value,
        )
          ? [...acc, cvClass, cvClassName]
          : acc,
      [] as ClassValue[],
    );

    return concat(
      base,
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    );
  };

export { variants, formatValue, type VariantProps };

export default variants;
