import { getWinners } from '~/api/winners-api.ts';

export async function createWinnersModel() {
  const winners = await getWinners();
  return {
    getWinners: () => winners,
  };
}
