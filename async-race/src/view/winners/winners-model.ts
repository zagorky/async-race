import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { getDetailedWinners } from '~/api/winners-api.ts';

export async function createWinnersModel() {
  const winners: WinnerDetailedDataType[] = await getDetailedWinners();
  return {
    getWinners: () => winners,
  };
}
