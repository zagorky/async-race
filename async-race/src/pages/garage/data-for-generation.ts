import { getRandomColor } from '~/utils/random-function.ts';

export const carBrands = [
  'Tesla',
  'Dasha',
  'Porsche',
  'Sasarik',
  'Ferrari',
  'BMW',
  'Mercedes',
  'Popik',
  'Toyota',
  'Honda',
];

export const carModels = [
  'Model S',
  'Mustang',
  '911',
  'Popik',
  'F40',
  'M5',
  'AMG GT',
  'Sasarik',
  'Dasha',
  'Supra',
  'Civic Type R',
];

export function generateRandomCars() {
  const numberOfNewCars = 10; // TODO не забудь исправить на 100
  const cars = [];
  for (let i = 0; i < numberOfNewCars; i += 1) {
    const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
    const model = carModels[Math.floor(Math.random() * carModels.length)];
    cars.push({
      name: `${brand} ${model}`,
      color: getRandomColor(),
    });
  }
  return cars;
}
