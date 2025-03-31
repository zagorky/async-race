import { getDetailedData } from '~/api/winners-api.ts';

export function createWinnersModel() {
  const winners = getDetailedData();
  return {
    getWinners: () => winners,
  };
}
