import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  const amount = 1000;
  const largerAmount = 1100;
  let account = getBankAccount(amount);

  afterEach(() => {
    account = getBankAccount(amount);
  });

  test('should create account with initial balance', () => {
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(largerAmount)).toThrow(
      new InsufficientFundsError(amount),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const secondaryAccount = getBankAccount(0);
    expect(() =>
      account.transfer(largerAmount, secondaryAccount),
    ).toThrowError();
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(amount, account)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    expect(account.deposit(amount)).toBe(account);
    expect(account.getBalance()).toBe(amount * 2);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(amount)).toBe(account);
    expect(account.getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    const secondaryAccount = getBankAccount(0);
    account.transfer(amount, secondaryAccount);
    expect(account.getBalance()).toBe(0);
    expect(secondaryAccount.getBalance()).toBe(amount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 1);
    await expect(account.fetchBalance()).resolves.toEqual(expect.any(Number));
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = 100;
    jest
      .spyOn(account, 'fetchBalance')
      .mockImplementation(async () => newBalance);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockImplementation(async () => null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
