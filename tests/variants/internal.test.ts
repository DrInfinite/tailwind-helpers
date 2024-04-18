import { formatValue } from '@/variants';

describe('formatValue function', () => {
  test('should convert a boolean to a string', () => {
    const result = formatValue(true);
    expect(result).toEqual('true');
  });

  test('should convert a number with the value of 0 to a string', () => {
    const result = formatValue(0);
    expect(result).toEqual('0');
  });

  test('should return the value as is', () => {
    const result = formatValue('test');
    expect(result).toEqual('test');
  });
});
