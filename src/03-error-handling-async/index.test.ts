import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    await expect(resolveValue(5)).resolves.toBe(5);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const message = 'Provided error';
    expect(() => throwError(message)).toThrow(new Error(message));
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow(new Error('Oops!'));
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
  });
});
