import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, updateCar } from '~/api/garage-api.ts';
import { startEngine, stopEngine, switchEngineMode } from '~/api/engine-api.ts';

export type CarModelType = {
  updateCar: (carData: GarageDataType) => Promise<GarageDataType>;
  removeCar: (id: number) => Promise<Response>;
  startCar: (id: number) => Promise<void>;
  returnCar: (id: number) => Promise<void>;
  driveCar: (id: number) => Promise<void>;
};

export function createCarModel(): CarModelType {
  return {
    updateCar: (carData: GarageDataType) =>
      updateCar(carData.id, { color: carData.color, name: carData.name }).then(
        ({ data: data }) => data,
      ),
    removeCar: (id: number) => deleteCar(id),
    startCar: (id: number) => startEngine(id),
    returnCar: (id: number) => stopEngine(id),
    driveCar: (id: number) => switchEngineMode(id),
  };
}
