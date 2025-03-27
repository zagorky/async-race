import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, getCars, updateCar } from '~/api/garage-api.ts';

export function createCarModel() {
  return {
    deleteCar: async (id: number) => {
      await deleteCar(id);
      await getCars();
    },
    updateCar: async (id: number, data: Omit<GarageDataType, 'id'>) => {
      await updateCar(id, data);
      await getCars();
    },
    // startCar: () => {},
    // returnCar: () => {},
  };
}
