import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { getDetailedData } from '~/api/winners-api.ts';
import { hasSome } from '@powwow-js/core';

export type WinnerModelType = {
  winnerPerPage: number;
  getTotalPages: () => number;
  getCurrentPage: () => number;
  getTotalWinners: () => number;
  getWinners: (page?: number) => Promise<WinnerDetailedDataType[]>;
};

export function isWinnersModel(model: unknown): model is WinnerModelType {
  return (
    typeof model === 'object' &&
    model !== null &&
    'getWinners' in model &&
    'getTotalWinners' in model
  );
}

export function createWinnersModel(): WinnerModelType {
  const savedPage = sessionStorage.getItem('Zagorky: winnersPage') || '1';
  let currentPage = Math.max(1, Number.parseInt(savedPage));
  const winnerPerPage = 10;
  let totalWinners = 0;

  return {
    winnerPerPage,
    getTotalPages: () => Math.ceil(totalWinners / winnerPerPage),
    getCurrentPage: () => currentPage,
    getTotalWinners: () => totalWinners,
    getWinners: (page = currentPage) => {
      currentPage = page;
      sessionStorage.setItem('Zagorky: winnersPage', currentPage.toString());
      return getDetailedData(page)
        .then(({ detailedWinners, totalCount }) => {
          if (hasSome(totalCount)) {
            totalWinners = totalCount;
          }
          return detailedWinners;
        })
        .catch((error) => {
          throw error;
        });
    },
  };
}
