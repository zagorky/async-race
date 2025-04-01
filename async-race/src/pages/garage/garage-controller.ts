import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { Button } from '~/utils/factory.ts';
import type { GarageModelType } from '~/pages/garage/garage-model.ts';
import { createGarageModel } from '~/pages/garage/garage-model.ts';
import { createGarageView } from '~/pages/garage/garage-view.ts';
import { createAddCarModal, createErrorModal } from '~/pages/modals.ts';
import { carBrands, carModels } from '~/pages/garage/data-for-generation.ts';
import { getRandomColor } from '~/utils/random-function.ts';
import { createCarController } from '~/pages/car/car-controller.ts';

export async function createGarageController() {
  try {
    const model = createGarageModel();
    const cars = await model.getCars();
    return createGarageView(cars, model);
  } catch (error) {
    createErrorModal(`Error in loading data`);
    throw error;
  }
}

export function createControlsContainer(container: HTMLElement, model: GarageModelType) {
  const addCarButton = Button('Add Cat');
  const startRaceButton = Button('Start Race');
  const resetRaceButton = Button('Reset Race');
  const generateCarsButton = Button('Generate Cats');
  const previousPageButton = Button('Prev page');
  const nextPageButton = Button('Next page');

  addCarButton.addEventListener('click', () => {
    const modal = createAddCarModal((data) => handleAddCar(data, container, model));
    document.body.append(modal);
    modal.showModal();
  });
  generateCarsButton.addEventListener('click', () => handleGenerateCars(container));
  previousPageButton.addEventListener('click', () => handlePagination('prev', container, model));
  nextPageButton.addEventListener('click', () => handlePagination('next', container, model));

  return [
    addCarButton,
    startRaceButton,
    resetRaceButton,
    generateCarsButton,
    previousPageButton,
    nextPageButton,
  ];
}

export function handleAddCar(
  data: Omit<GarageDataType, 'id'>,
  container: HTMLElement,
  model: GarageModelType,
) {
  model
    .addCar(data)
    .then((lastPage) => {
      if (model.getCurrentPage() === lastPage) {
        return model.getCars(lastPage);
      }
      return [];
    })
    .then((cars) => {
      if (cars.length > 0) {
        container.replaceChildren();
        updateCarView(container, cars);
      }
    })
    .catch((error: Error) => createErrorModal(`Error in adding car: ${error.message}`));
}

export function handleGenerateCars(container: HTMLElement) {
  const randomCars = generateRandomCars();
  Promise.all(randomCars.map((car) => setCar(car)))
    .then((response) => {
      const createdCars = response.map(({ data }) => data);
      updateCarView(container, createdCars);
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

export function updateCarView(container: HTMLElement, cars: GarageDataType[]) {
  cars.forEach((car) => container.append(createCarController(car)));
}

function handlePagination(
  direction: 'prev' | 'next',
  container: HTMLElement,
  model: GarageModelType,
) {
  const currentPage = model.getCurrentPage();
  const totalPages = model.getTotalPages();

  const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
  if (newPage < 1 || (direction === 'next' && newPage > totalPages)) return;
  model
    .getCars(newPage)
    .then((cars) => {
      container.replaceChildren();
      updateCarView(container, cars);
    })
    .catch((error: Error) => createErrorModal(`${error.toString()}`));
}
