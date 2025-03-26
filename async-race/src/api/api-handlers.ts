type QueryParametersType = { key: string; value: string | number }[];

const baseUrl = 'http://127.0.0.1:3000';

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

export const query: QueryParametersType = [{ key: '', value: '' }, paginate.page, paginate.limit];

export async function getData<T>(path: string, query?: QueryParametersType): Promise<T> {
  const queryParameters = query
    ? `?${query.map((element) => `${element.key}=${element.value}`).join('&')}`
    : '';

  return await fetch(`${baseUrl}${path}${queryParameters}`)
    .then((response) => response.json())
    .then((data: T) => {
      return data;
    })
    .catch((error) => {
      console.error(path, error);
      throw error;
    });
}

export async function postData<T>(data: T, path: string): Promise<T> {
  return await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data: T) => {
      return data;
    })
    .catch((error) => {
      console.error(path, error);
      throw error;
    });
}

export async function patchData<T>(id: number, data: T, path: string): Promise<T> {
  return await fetch(`${baseUrl}${path}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data: T) => {
      return data;
    })
    .catch((error) => {
      console.error(path, error);
      throw error;
    });
}

export async function deleteData<T>(id: number, path: string): Promise<T> {
  return await fetch(`${baseUrl}${path}/${id}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data: T) => {
      return data;
    })
    .catch((error) => {
      console.error(path, error);
      throw error;
    });
}
