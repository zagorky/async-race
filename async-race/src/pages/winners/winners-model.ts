import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { getDetailedData } from '~/api/winners-api.ts';

export type WinnerModelType = {
  getTotalPages: () => number;
  getCurrentPage: () => number;
  getTotalWinners: () => number;
  getWinners: () => Promise<WinnerDetailedDataType[]>;
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
  const currentPage = 1;
  const winnerPerPage = 10;
  let totalWinners = 0;
  let allWinners: WinnerDetailedDataType[] = [];

  return {
    getTotalPages: () => Math.ceil(totalWinners / winnerPerPage),
    getCurrentPage: () => currentPage,
    getTotalWinners: () => totalWinners,
    getWinners: () => {
      return getDetailedData()
        .then((data) => {
          allWinners = data;
          totalWinners = allWinners.length;
          return allWinners;
        })
        .catch((error) => {
          throw error;
        });
    },
  };
}
