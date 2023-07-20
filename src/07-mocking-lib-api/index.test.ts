import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const data = [
  {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  },
  {
    userId: 1,
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    completed: false,
  },
];

describe('throttledGetDataFromApi', () => {
  const url = 'url';

  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data });
    jest.spyOn(axios, 'create').mockImplementationOnce(() => axios);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(url);
    expect(axiosCreateSpy).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    jest.spyOn(axios, 'get').mockImplementationOnce((relativePath) => {
      return new Promise((res, rej) => {
        if (relativePath === url) {
          res({ data });
        } else {
          rej();
        }
      });
    });
    await expect(throttledGetDataFromApi(url)).resolves.toBe(data);
  });

  test('should return response data', async () => {
    await expect(throttledGetDataFromApi(url)).resolves.toBe(data);
  });
});
