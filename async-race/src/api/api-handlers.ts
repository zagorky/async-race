type GarageDataType = {
  name: string;
  color: string;
  id: number;
};

type WinnersDataType = {
  id: number;
  wins: number;
  time: number;
};

type QueryParametersType = Record<string, string | number>[];

const baseUrl = 'http://127.0.0.1:3000';

const path = {
  garage: '/garage',
  winners: '/winners',
};

const paginate = {
  page: {
    key: '_page',
    value: 2,
  },
  limit: {
    key: '_limit',
    value: 7,
  },
};

const query: QueryParametersType = [{ key: '', value: '' }, paginate.page, paginate.limit];

console.log(query);

async function getData<T>(path: string, query?: QueryParametersType): Promise<T> {
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

async function postData<T>(data: T, path: string): Promise<T> {
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

async function patchData<T>(id: number, data: T, path: string): Promise<T> {
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

async function deleteData<T>(id: number, path: string): Promise<T> {
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

const getGarageData = await getData<GarageDataType>(path.garage);
const getWinnersData = await getData<WinnersDataType>(path.winners);

console.log(
  getGarageData,
  getWinnersData,
  await postData({}, ''),
  await patchData(0, {}, ''),
  await deleteData(0, ''),
);
