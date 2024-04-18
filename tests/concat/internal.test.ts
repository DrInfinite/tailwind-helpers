import { concatValues } from '@/concat';

describe('concatValues function', () => {
  test('should return the input string as is', () => {
    const result = concatValues('test string');
    expect(result).toEqual('test string');
  });

  test('should return the input number as a string', () => {
    const result = concatValues(123);
    expect(result).toEqual('123');
  });

  test('should concatenate values in an array', () => {
    const result = concatValues(['value1', 'value2']);
    expect(result).toEqual('value1 value2');
  });

  test('should concatenate class names from an object', () => {
    const result = concatValues({ class1: true, class2: false, class3: true });
    expect(result).toEqual('class1 class3');
  });
});
