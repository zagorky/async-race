import { getCars } from '~/api/garage-api.ts';
import { fetchAndValidateData, path, requestConfig } from '~/api/new-api-handlers.ts';
import { hasSome } from '@powwow-js/core';
import { createErrorModal } from '~/pages/modals.ts';

export type WinnersDataType = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerDetailedDataType = WinnersDataType & {
  color: string;
  name: string;
};

export function isWinnersDetailedData(data: unknown): data is WinnerDetailedDataType[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        hasSome<object>(item) &&
        'color' in item &&
        'name' in item &&
        'wins' in item &&
        'time' in item &&
        typeof item.wins === 'number' &&
        typeof item.time === 'number' &&
        typeof item.color === 'string' &&
        typeof item.name === 'string',
    )
  );
}

export async function getDetailedData() {
  console.log('Fetching winners data...');

  const [garageResponse, winnersResponse] = await Promise.all([getCars(), getWinners()]);
  const garage = garageResponse.data;
  const winners = winnersResponse.data;

  const validData = winners
    .map((winner) => {
      const car = garage.find((car) => car.id === winner.id);
      return car
        ? {
            id: winner.id,
            name: car.name,
            color: car.color,
            wins: winner.wins,
            time: winner.time,
          }
        : null;
    })
    .filter((winner): winner is WinnerDetailedDataType => winner !== null);

  if (validData.length === 0) {
    createErrorModal('No winners with matching cars found');
    return [];
  }
  return validData;
}

export function isWinnersData(data: unknown): data is WinnersDataType[] {
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
