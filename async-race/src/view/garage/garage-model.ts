import type { GarageDataType } from '~/api/garage-api.ts';
import { getCars, setCar } from '~/api/garage-api.ts';

export async function createGarageModel() {
  const cars = await getCars().catch((error) => console.error('Garage error', error));

  return {
    getCars: () => cars,
    createNewCar: async (data: GarageDataType) => {
      await setCar(data);
      await getCars();
    },
    // startRace: () => {},
    // resetRace: () => {},
    // generateCars: () => {},
    // prevPage: () => {},
    // nextPage: () => {},
  };
}
