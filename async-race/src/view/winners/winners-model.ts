import { getDetailedWinners } from '~/api/winners-api.ts';

export async function createWinnersModel() {
  const winners = await getDetailedWinners();
  return {
    getWinners: () => winners,
  };
}
