import { getRandomColor } from '~/utils/random-function.ts';

export const carBrands = [
  'Tesla',
  'Porsche',
  'Ferrari',
  'Lamborghini',
  'Aston Martin',
  'Bugatti',
  'McLaren',
  'Popik',
  'Pagani',
  'Rolls-Royce',
  'Bentley',
  'Maserati',
  'Alfa Romeo',
  'Lexus',
  'Genesis',
];

export const carModels = [
  'Roadster 2025',
  '911 GT3 RS',
  'SF90 Stradale',
  'Revuelto V12',
  'Valkyrie',
  'Chiron Super Sport',
  'Sasarik',
  'Jesko Absolut',
  'Huayra R',
  'Phantom VIII',
  'Continental GT Speed',
  'MC20 Cielo',
  '33 Stradale',
  'LFA Nürburgring',
  'G90 Excellence',
];

export function generateRandomCars() {
  const numberOfNewCars = 100;
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
