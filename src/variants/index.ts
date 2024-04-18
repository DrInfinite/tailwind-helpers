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
function formatValue<T>(value: T): T | string {
  if (typeof value === 'boolean' || value === 0) {
    return String(value);
  }

  return value;
}

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
function variants<T>(
  base?: ClassValue,
  config?: Config<T>,
): (props?: Props<T>) => ClassValue {
  return (props?: Props<T>) => {
    /**
     * If there is no configuration for generating class names based on
     * props, simply return the initial class name and any class names
     * passed in through the props
     */
    if (config?.variants == null) {
      return concat(base, props?.class, props?.className);
    }

    const { variants, defaultVariants } = config;

    /**
     * For each variant specified in the configuration, get the class name
     * to use for that variant based on the prop passed in
     */
    const getVariantClassNames = Object.keys(variants).map(
      (variant: keyof typeof variants) => {
        /**
         * Get the value of the prop specified for the current variant. If
         * the prop is null or undefined, use null as the class name for
         * this variant
         */
        const variantProp = props?.[variant as keyof typeof props];
        if (variantProp === null || variantProp === undefined) {
          return null;
        }

        /**
         * Get the default value of the prop for the current variant if one
         * is specified in the configuration. If no default value is
         * specified, use null as the default value
         */
        const defaultVariantProp = defaultVariants?.[variant];

        /**
         * If the prop value is a boolean or a number that evaluates to
         * false (0), format it as a string. Otherwise, use it as is
         */
        const variantKey = (formatValue(variantProp) ||
          formatValue(
            defaultVariantProp,
          )) as keyof (typeof variants)[typeof variant];

        /**
         * Get the class name to use for the current variant from the
         * configuration using the key we just generated
         */
        return variants[variant][variantKey];
      },
    );

    /**
     * If there are props that have been passed in, create a new object
     * that only contains the keys and values of the props, excluding any
     * keys that have a value of undefined
     */
    const propsWithoutUndefined =
      props &&
      Object.entries(props).reduce((acc, [key, value]) => {
        if (value === undefined) {
          return acc;
        }

        acc[key] = value;
        return acc;
      }, {} as Record<string, unknown>);

    /**
     * For each compound variant specified in the configuration, check if
     * all of the props specified in the compound variant are true. If
     * they are, get the class names specified by the compound variant
     */
    const getCompoundVariantClassNames = config?.compoundVariants?.reduce(
      function (
        acc,
        { class: cvClass, className: cvClassName, ...compoundVariantOptions },
      ): ClassValue[] {
        return Object.entries(compoundVariantOptions).every(([key, value]) =>
          /**
           * If the current prop is an array, check if the value of the
           * prop (from the config or the props) is included in the array
           * of values specified for the prop in the compound variant
           */
          Array.isArray(value)
            ? value.includes(
                /**
                 * Use the default value of the prop if it exists, or the
                 * value of the prop from the props if not
                 */
                {
                  ...defaultVariants,
                  ...propsWithoutUndefined,
                }[key],
              )
            : /**
               * Otherwise, check if the current value of the prop (from the
               * config or the props) is equal to the value specified for
               * the prop in the compound variant
               */

              {
                ...defaultVariants,
                ...propsWithoutUndefined,
              }[key] === value,
        )
          ? /**
             * If all of the props specified in the compound variant are
             * true, add the class names specified by the compound variant
             * to the array of class names to return
             */

            [...acc, cvClass, cvClassName]
          : acc;
      },

      /**
       * Start with an empty array of class names to return
       */
      [] as ClassValue[],
    );

    /**
     * Return the concatenated class names based on the initial class
     * name, the class names generated from the variants, and the class
     * names generated from the compound variants, as well as any class
     * names passed in through the props
     */
    return concat(
      base,
      getVariantClassNames,
      getCompoundVariantClassNames,
      props?.class,
      props?.className,
    );
  };
}

export { variants, formatValue, type VariantProps };

export default variants;
