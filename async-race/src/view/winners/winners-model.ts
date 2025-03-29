import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { getDetailedData } from '~/api/winners-api.ts';

export async function createWinnersModel() {
  const winners: WinnerDetailedDataType[] = await getDetailedData();
  return {
    getWinners: () => winners,
  };
}
