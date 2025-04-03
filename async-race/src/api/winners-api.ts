import { getCar } from '~/api/garage-api.ts';
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

export function getDetailedData() {
  return getWinners().then((winnersResponse) => {
    const totalWinners = winnersResponse.totalCount;
    const winners = winnersResponse.data;

    const detailedPromises = winners.map((winner) => {
      return getCar(winner.id)
        .then((carResponse) => {
          return {
            id: winner.id,
            name: carResponse.data.name,
            color: carResponse.data.color,
            wins: winner.wins,
            time: winner.time,
          };
        })
        .catch(() => null);
    });

    return Promise.all(detailedPromises).then((detailedWinners) => {
      return { totalWinners, detailedWinners: detailedWinners.filter((winner) => winner !== null) };
    });
  });
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
  fetchAndValidateData(isWinnersData)(`${path.winners}`, requestConfig.get);
