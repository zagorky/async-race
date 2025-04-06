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

// export function isWinnersDetailedData(data: unknown): data is WinnerDetailedDataType[] {
//   return (
//     Array.isArray(data) &&
//     data.every(
//       (item) =>
//         hasSome<object>(item) &&
//         'color' in item &&
//         'name' in item &&
//         'wins' in item &&
//         'time' in item &&
//         typeof item.wins === 'number' &&
//         typeof item.time === 'number' &&
//         typeof item.color === 'string' &&
//         typeof item.name === 'string',
//     )
//   );
// }

export function getDetailedData(page = 1) {
  return getWinners(page)
    .then((winnersResponse) => {
      const totalCount = winnersResponse.totalCount;
      const winners = winnersResponse.data;

      const detailedPromises = winners.map((winner) => {
        return getCar(winner.id).then((carResponse) => {
          return {
            id: winner.id,
            name: carResponse.data.name,
            color: carResponse.data.color,
            wins: winner.wins,
            time: winner.time,
          };
        });
      });

      return Promise.all(detailedPromises).then((detailedWinners) => {
        return {
          totalCount,
          detailedWinners: detailedWinners.filter((winner) => winner !== null),
        };
      });
    })
    .catch((error) => {
      console.warn('Failed to get winners data:', error);
      return {
        totalCount: 0,
        detailedWinners: [],
        invalidCount: 0,
        originalCount: 0,
      };
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

export function isWinnerData(data: unknown): data is WinnersDataType {
  return (
    hasSome<object>(data) &&
    'wins' in data &&
    'time' in data &&
    typeof data.wins === 'number' &&
    typeof data.time === 'number'
  );
}

export const getWinners = (page = 1) =>
  fetchAndValidateData(isWinnersData)(`${path.winners}?_page=${page}&_limit=10`, requestConfig.get);

export const setWinner = (data: unknown) =>
  fetchAndValidateData(isWinnerData)(path.winners, requestConfig.post(data));

export const getWinner = (id: number) =>
  fetchAndValidateData(isWinnerData)(`${path.winners}/${id}`, requestConfig.get);

export const updateWinner = (id: number, data: unknown) =>
  fetchAndValidateData(isWinnersData)(`${path.winners}/${id}`, requestConfig.put(data));
