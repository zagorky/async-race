import type { GarageDataType } from '~/api/garage-api.ts';
import { getCars } from '~/api/garage-api.ts';
import { hasSome } from '@powwow-js/core';

export type GarageModelType = {
  carPerPage: number;
  getTotalCars: () => number;
  getTotalPages: () => number;
  getCurrentPage: () => number;
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
