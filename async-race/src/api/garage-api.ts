import { deleteData, getData, patchData, path, postData } from '~/api/api-handlers.ts';

export type GarageDataType = {
  name: string;
  color: string;
  id?: number;
};

export const getCars = async () => await getData<GarageDataType[]>(path.garage);

export const getCar = async (id: number) => await getData<GarageDataType>(`${path.garage}/${id}`);

export const setCar = async (carData: GarageDataType) => await postData(carData, path.garage);

export const deleteCar = async (id: number) => await deleteData(id, path.garage);

export const updateCar = async (id: number, carData: Pick<GarageDataType, 'name' | 'color'>) =>
  await patchData(id, carData, path.garage);
