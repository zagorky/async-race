import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar, getCars } from '~/api/garage-api.ts';
import { hasSome } from '@powwow-js/core';
import type { WinnersDataType } from '~/api/winners-api.ts';
import { setWinner } from '~/api/winners-api.ts';

export type GarageModelType = {
  carPerPage: number;
  getTotalCars: () => number;
  getTotalPages: () => number;
  getCurrentPage: () => number;
  addCar: (car: Omit<GarageDataType, 'id'>) => Promise<number>;
  setWinner: (data: WinnersDataType) => Promise<WinnersDataType>;
  getCars: (page?: number) => Promise<GarageDataType[]>;
};

export function isGarageModel(model: unknown): model is GarageModelType {
  return (
    typeof model === 'object' && model !== null && 'getCars' in model && 'getTotalCars' in model
  );
}

export function createGarageModel(): GarageModelType {
  const state = initializeGarageState();
  return {
    carPerPage: state.carPerPage,
    getTotalCars: () => state.totalCars,
    getCurrentPage: () => state.currentPage,
    getTotalPages: () => Math.ceil(state.totalCars / state.carPerPage),
    addCar: (data: Omit<GarageDataType, 'id'>) =>
      setCar(data)
        .then(() => {
          state.totalCars += 1;
          return Math.ceil((state.totalCars + 1) / state.carPerPage);
        })
        .catch((error) => {
          throw error;
        }),
    getCars: (page = state.currentPage) => {
      state.currentPage = page;
      sessionStorage.setItem('Zagorky: garagePage', state.currentPage.toString());
      return getCars(page)
        .then(({ data, totalCount }) => {
          if (hasSome(totalCount)) {
            state.totalCars = totalCount;
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

function initializeGarageState() {
  const savedPage = sessionStorage.getItem('Zagorky: garagePage') || '1';
  const carPerPage = 7;
  return {
    currentPage: Math.max(1, Number.parseInt(savedPage)),
    carPerPage,
    totalCars: 0,
  };
}
