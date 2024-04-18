import { concat, liteConcat } from '@/concat';

describe('concat function', () => {
  test('should return an empty string when no arguments are provided', () => {
    const result = concat();
    expect(result).toEqual('');
  });

  test('should concatenate strings correctly', () => {
    const result = concat('class1', 'class2', 'class3');
    expect(result).toEqual('class1 class2 class3');
  });

  test('should handle nested arrays and objects correctly', () => {
    const result = concat('class1', ['class2', 'class3'], {
      class4: true,
      class5: false,
      class6: true,
    });
    expect(result).toEqual('class1 class2 class3 class4 class6');
  });
});

describe('liteConcat function', () => {
  test('should join valid strings and filter out undefined, null, and false values', () => {
    const result = liteConcat(
      'class1',
      null,
      'class2',
      undefined,
      false,
      'class3',
    );
    expect(result).toEqual('class1 class2 class3');
  });

  test('should return an empty string if all values are undefined, null, or false', () => {
    const result = liteConcat(null, undefined, false);
    expect(result).toEqual('');
  });

  test('should return an empty string if no valid strings are provided', () => {
    const result = liteConcat(null, undefined, false);
    expect(result).toEqual('');
  });
});
