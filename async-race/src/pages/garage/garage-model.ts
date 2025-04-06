import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, setCar, getCars } from '~/api/garage-api.ts';
import { hasSome } from '@powwow-js/core';
import type { WinnersDataType } from '~/api/winners-api.ts';
import { setWinner } from '~/api/winners-api.ts';

export type GarageModelType = {
  carPerPage: number;
  getTotalCars: () => number;
  getTotalPages: () => number;
  getCurrentPage: () => number;
  addCar: (car: Omit<GarageDataType, 'id'>) => Promise<number>;
  removeCar: (id: number) => Promise<number>;
  setWinner: (data: WinnersDataType) => Promise<WinnersDataType>;
  getCars: (page?: number) => Promise<GarageDataType[]>;
};

export function isGarageModel(model: unknown): model is GarageModelType {
  return (
    typeof model === 'object' && model !== null && 'getCars' in model && 'getTotalCars' in model
  );
}

export function createGarageModel(): GarageModelType {
  const savedPage = sessionStorage.getItem('Zagorky: garagePage') || '1';
  let currentPage = Math.max(1, Number.parseInt(savedPage));
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
    getCars: (page = currentPage) => {
      currentPage = page;
      sessionStorage.setItem('Zagorky: garagePage', currentPage.toString());
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
    setWinner: (data: WinnersDataType) =>
      setWinner(data)
        .then((data) => data.data)
        .catch((error) => {
          throw error;
        }),
  };
}
