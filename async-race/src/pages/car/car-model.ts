import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, updateCar } from '~/api/garage-api.ts';

export type CarModelType = {
  updateCar: (carData: GarageDataType) => Promise<GarageDataType>;
  removeCar: (id: number) => Promise<Response>;
};

export function createCarModel(): CarModelType {
  return {
    updateCar: (carData: GarageDataType) =>
      updateCar(carData.id, { color: carData.color, name: carData.name }).then(
        ({ data: data }) => data,
      ),
    removeCar: (id: number) => deleteCar(id),
    // startCar: () => {},
    // returnCar: () => {},
  };
}
