import { baseUrl, fetchAndValidateData, path, requestConfig } from '~/api/new-api-handlers.ts';
import { hasSome } from '@powwow-js/core';

export type GarageDataType = {
  name: string;
  color: string;
  id: number;
};

type PaginatedResponse = {
  data: GarageDataType[];
  totalCount?: number;
};

export function isGarageData(data: unknown): data is GarageDataType[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        hasSome<object>(item) &&
        'name' in item &&
        'color' in item &&
        typeof item.name === 'string' &&
        typeof item.color === 'string',
    )
  );
}

export function isSingleGarageData(data: unknown): data is GarageDataType {
  return (
    hasSome<object>(data) &&
    'name' in data &&
    'color' in data &&
    typeof data.name === 'string' &&
    typeof data.color === 'string'
  );
}

export const getCars = (page = 1): Promise<PaginatedResponse> =>
  fetchAndValidateData(isGarageData)(`${path.garage}?_page=${page}&_limit=7`, requestConfig.get);

// export const getCar = (id: number) =>
//   fetchAndValidateData(isSingleGarageData)(`${path.garage}/${id}`, requestConfig.get);

export const setCar = (data: unknown) =>
  fetchAndValidateData(isSingleGarageData)(path.garage, requestConfig.post(data));

// export const deleteCar = (id: number) =>
//   fetchAndValidateData(isSingleGarageData)(`${path.garage}/${id}`, requestConfig.delete);

export const updateCar = (id: number, data: unknown) =>
  fetchAndValidateData(isSingleGarageData)(`${path.garage}/${id}`, requestConfig.patch(data));

// TODO подумать как переписать функцию fetchAndValidateData
export const deleteCar = (id: number) =>
  fetch(`${baseUrl}${path.garage}/${id}`, requestConfig.delete).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  });
