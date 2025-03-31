// type QueryParametersType = { key: string; value: string | number }[];

type RequestConfigType = {
  get: RequestInit;
  post: (data: unknown) => RequestInit;
  patch: (data: unknown) => RequestInit;
  delete: RequestInit;
};

export const baseUrl = 'http://127.0.0.1:3000';

export const path = {
  garage: '/garage',
  winners: '/winners',
  engine: '/engine',
};

export const paginate = {
  page: {
    key: '_page',
    value: 2,
  },
  limit: {
    key: '_limit',
    value: 7,
  },
};

export const requestConfig: RequestConfigType = {
  get: {
    method: 'GET',
  },
  post: (data: unknown) => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  patch: (data: unknown) => ({
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  delete: {
    method: 'DELETE',
  },
};

class JsonError extends Error {
  public static rethrowFrom = (error: unknown): JsonError => {
    const result = new JsonError('Failed to parse JSON response.');
    result.cause = error;
    throw result;
  };
}

class ResponseError extends Error {
  public static assertIsOk(
    response: Response,
  ): asserts response is Omit<Response, 'ok'> & { ok: true } {
    if (!response.ok) {
      const result = new ResponseError(
        `HTTP error! Status: ${response.status} (${response.statusText})`,
      );

      result.cause = response;
      throw result;
    }
  }
}

class ParseDataError extends Error {
  public static throw = (errorMessage?: string): ParseDataError => {
    throw new ParseDataError(`Parse response data error. \n${errorMessage ?? ''}`);
  };
}

export function validateData<T>(predicat: (data: unknown) => data is T) {
  return function (data: unknown) {
    if (predicat(data)) {
      return data;
    } else {
      throw ParseDataError.throw();
    }
  };
}

const toJSON = async (r: Response): Promise<unknown> => r.json().catch(JsonError.rethrowFrom);

const processResponse = (r: Response) => {
  ResponseError.assertIsOk(r);
  return r;
};

export function fetchAndValidateData<T>(validator: (data: unknown) => data is T) {
  return (endpoint: string, options?: RequestInit) => {
    return fetch(`${baseUrl}${endpoint}`, options)
      .then(processResponse)
      .then(toJSON)
      .then(validateData(validator));
  };
}
