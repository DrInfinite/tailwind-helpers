import { variants } from '@/variants';
import { ClassProp } from '@/variants/types';

describe('variants function', () => {
  test('should concatenate class names with no config', () => {
    const baseClass = 'base-class';
    const props: ClassProp = {
      class: 'extra-class',
    };
    const generateClassNames = variants<string>(baseClass);
    const result = generateClassNames(props);
    expect(result).toEqual('base-class extra-class');
  });

  test('should concatenate className names with no config', () => {
    const baseClass = 'base-class';
    const props: ClassProp = {
      className: 'extra-className',
    };
    const generateClassNames = variants<string>(baseClass);
    const result = generateClassNames(props);
    expect(result).toEqual('base-class extra-className');
  });
});
