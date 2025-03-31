import type { GarageDataType } from '~/api/garage-api.ts';
import { getCars } from '~/api/garage-api.ts';

export type GarageModelType = {
  getCars: () => Promise<GarageDataType[]>;
};

// export function isGarageModel(data: unknown): data is GarageModelType {
//   return typeof data === 'object' && hasSome<object>(data) && 'getCars' in data;
// }

export function createGarageModel(): GarageModelType {
  return {
    getCars: () =>
      getCars()
        .then((cars) => cars)
        .catch((error) => {
          throw error;
        }),
  };
}
