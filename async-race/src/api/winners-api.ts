import { deleteData, getData, patchData, path, postData } from '~/api/api-handlers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';

export type WinnersDataType = {
  id: number;
  wins: number;
  time: number;
};

export type WinnerDetailedDataType = WinnersDataType & Omit<GarageDataType, 'id'>;

export const getWinners = async () => {
  await getData<WinnersDataType>(path.winners);
};

export const getWinner = async (id: number) =>
  await getData<WinnersDataType>(`${path.winners}/${id}`);

export const setWinner = async (winnerData: WinnersDataType) =>
  await postData(winnerData, path.winners);

export const deleteWinner = async (id: number) => await deleteData(id, path.winners);

export const updateWinner = async (
  id: number,
  winnerData: Pick<WinnersDataType, 'wins' | 'time'>,
) => await patchData(id, winnerData, path.winners);

export const getDetailedWinners = async (): Promise<
  (WinnersDataType & Omit<GarageDataType, 'id'>)[]
> => {
  const garage = await getData<GarageDataType[]>(path.garage);
  const winners = await getData<WinnersDataType[]>(path.winners);
  return winners.map((winner) => {
    const car = garage.find((car) => car.id === winner.id);
    if (!car) {
      throw new Error('there is no detailed data');
    }
    return {
      id: winner.id,
      name: car.name,
      color: car.color,
      wins: winner.wins,
      time: winner.time,
    };
  });
};
