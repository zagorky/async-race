import { fetchAndValidateData, path, requestConfig } from '~/api/new-api-handlers.ts';
import { hasSome } from '@powwow-js/core';

export type GarageDataType = {
  name: string;
  color: string;
  id?: number;
};

function isGarageData(data: unknown): data is GarageDataType[] {
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

export const getCars = () => fetchAndValidateData(isGarageData)(path.garage, requestConfig.get);

export const getCar = (id: number) =>
  fetchAndValidateData(isGarageData)(`${path.garage}/${id}`, requestConfig.get);

export const setCar = (data: unknown) =>
  fetchAndValidateData(isGarageData)(path.garage, requestConfig.post(data));

export const deleteCar = (id: number) =>
  fetchAndValidateData(isGarageData)(`${path.garage}/${id}`, requestConfig.delete);

export const updateCar = (id: number, data: unknown) =>
  fetchAndValidateData(isGarageData)(`${path.garage}/${id}`, requestConfig.patch(data));
