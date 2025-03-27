import { deleteData, getData, patchData, path, postData } from '~/api/api-handlers.ts';

export type WinnersDataType = {
  id?: number;
  wins: number;
  time: number;
};

export const getWinners = async () => await getData<WinnersDataType>(path.winners);

export const getWinner = async (id: number) =>
  await getData<WinnersDataType>(`${path.winners}/${id}`);

export const setWinner = async (winnerData: WinnersDataType) =>
  await postData(winnerData, path.winners);

export const deleteWinner = async (id: number) => await deleteData(id, path.winners);

export const updateWinner = async (
  id: number,
  winnerData: Pick<WinnersDataType, 'wins' | 'time'>,
) => await patchData(id, winnerData, path.winners);
