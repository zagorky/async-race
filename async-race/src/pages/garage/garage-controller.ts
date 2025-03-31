import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { Button } from '~/utils/factory.ts';
import { createGarageModel } from '~/pages/garage/garage-model.ts';
import { createGarageView } from '~/pages/garage/garage-view.ts';
import { createAddCarModal, createErrorModal } from '~/pages/modals.ts';
import { createCarView } from '~/pages/car/car-view.ts';
import { carBrands, carModels } from '~/pages/garage/data-for-generation.ts';
import { getRandomColor } from '~/utils/random-function.ts';

export async function createGarageController() {
  try {
    const model = createGarageModel();
    const cars = await model.getCars();
    return createGarageView(cars);
  } catch (error) {
    createErrorModal(`Error in update`);
    throw error;
  }
}

export function createControlsContainer(container: HTMLElement) {
  const addCarButton = Button('Add Cat');
  const startRaceButton = Button('Start Race');
  const resetRaceButton = Button('Reset Race');
  const generateCarsButton = Button('Generate Cats');
  const previousPageButton = Button('<=');
  const nextPageButton = Button('=>');

  addCarButton.addEventListener('click', () => {
    const modal = createAddCarModal((data) => handleAddCar(data, container));
    document.body.append(modal);
    modal.showModal();
  });

  generateCarsButton.addEventListener('click', () => handleGenerateCars(container));

  return [
    addCarButton,
    startRaceButton,
    resetRaceButton,
    generateCarsButton,
    previousPageButton,
    nextPageButton,
  ];
}

export function handleAddCar(data: Omit<GarageDataType, 'id'>, container: HTMLElement) {
  setCar(data)
    .then((createdData) => {
      const newCar = createCarView(createdData);
      container.append(newCar);
    })
    .catch((error: Error) => createErrorModal(`Error in adding car: ${error.message}`));
}

export function handleGenerateCars(container: HTMLElement) {
  const randomCars = generateRandomCars();
  Promise.all(randomCars.map((car) => setCar(car)))
    .then((createdCars) => {
      createdCars.forEach((car) => {
        const newCar = createCarView(car);
        container.append(newCar);
      });
    })
    .catch((error: Error) => createErrorModal(`Error in generating car: ${error.message}`));
}

function generateRandomCars() {
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
