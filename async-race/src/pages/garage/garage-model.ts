import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, setCar, getCars } from '~/api/garage-api.ts';
import { hasSome } from '@powwow-js/core';

export type GarageModelType = {
  carPerPage: number;
  getTotalCars: () => number;
  getTotalPages: () => number;
  getCurrentPage: () => number;
  addCar: (car: Omit<GarageDataType, 'id'>) => Promise<number>;
  removeCar: (id: number) => Promise<number>;
  getCars: (page?: number) => Promise<GarageDataType[]>;
};

export function createGarageModel(): GarageModelType {
  let currentPage = 1;
  const carPerPage = 7;
  let totalCars = 0;

  return {
    carPerPage,
    getTotalCars: () => totalCars,
    getCurrentPage: () => currentPage,
    getTotalPages: () => Math.ceil(totalCars / carPerPage),
    addCar: (data: Omit<GarageDataType, 'id'>) =>
      setCar(data)
        .then(() => {
          totalCars += 1;
          return Math.ceil((totalCars + 1) / carPerPage);
        })
        .catch((error) => {
          throw error;
        }),
    removeCar: (id: number) =>
      deleteCar(id)
        .then(() => {
          totalCars -= 1;
          const lastPage = Math.ceil(totalCars / carPerPage);
          if (currentPage > lastPage && lastPage > 0) {
            currentPage = lastPage;
          }
          return currentPage;
        })
        .catch((error) => {
          throw error;
        }),
    getCars: (page = 1) => {
      currentPage = page;
      return getCars(page)
        .then(({ data, totalCount }) => {
          if (hasSome(totalCount)) {
            totalCars = totalCount;
          }
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
  };
}
