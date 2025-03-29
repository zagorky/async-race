import { getCars } from '~/api/garage-api.ts';
import { fetchAndValidateData, path, requestConfig } from '~/api/new-api-handlers.ts';
import { hasSome } from '@powwow-js/core';

export type WinnersDataType = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerDetailedDataType = WinnersDataType & {
  color: string;
  name: string;
};

export function getDetailedData() {
  return Promise.all([getCars(), getWinners()])
    .then(([garage, winners]) => {
      return winners.map((winner) => {
        const car = garage.find((car) => car.id === winner.id);
        if (!car) {
          throw new Error('there is no detailed data');
        }
        return {
          id: winner.id,
          name: car.name,
          color: car.color,
          wins: winner.wins,
          time: winner.time,
        };
      });
    })
    .catch((error) => {
      throw error;
    });
}

function isWinnersData(data: unknown): data is WinnersDataType[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        hasSome<object>(item) &&
        'wins' in item &&
        'time' in item &&
        typeof item.wins === 'number' &&
        typeof item.time === 'number',
    )
  );
}

export const getWinners = () =>
  fetchAndValidateData(isWinnersData)(path.winners, requestConfig.get);

export const getWinner = (id: number) =>
  fetchAndValidateData(isWinnersData)(`${path.winners}/${id}`, requestConfig.get);

export const setWinner = (data: unknown) =>
  fetchAndValidateData(isWinnersData)(path.winners, requestConfig.post(data));

export const deleteWinner = (id: number) =>
  fetchAndValidateData(isWinnersData)(`${path.winners}/${id}`, requestConfig.delete);

export const updateWinner = (id: number, data: unknown) =>
  fetchAndValidateData(isWinnersData)(`${path.winners}/${id}`, requestConfig.patch(data));
