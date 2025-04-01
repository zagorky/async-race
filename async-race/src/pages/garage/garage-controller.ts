import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
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
    const { element: paginationInfo, update: updatePagination } = createPaginationInfo(model);

    const view = createGarageView(cars, model, updatePagination);

    view.prepend(paginationInfo);
    return view;
  } catch (error) {
    createErrorModal(`Error in loading data`);
    throw error;
  }
}

export function createControlsContainer(
  container: HTMLElement,
  model: GarageModelType,
  onUpdate: () => void,
) {
  const addCarButton = Button('Add Cat');
  const startRaceButton = Button('Start Race');
  const resetRaceButton = Button('Reset Race');
  const generateCarsButton = Button('Generate Cats');
  const previousPageButton = Button('Prev page');
  const nextPageButton = Button('Next page');

  addCarButton.addEventListener('click', () => {
    const modal = createAddCarModal((data) => handleAddCar(data, container, model, onUpdate));
    document.body.append(modal);
    modal.showModal();
  });
  generateCarsButton.addEventListener('click', () => {
    handleGenerateCars(container, model, onUpdate);
  });
  previousPageButton.addEventListener('click', () => {
    handlePagination('prev', container, model);
    onUpdate();
  });
  nextPageButton.addEventListener('click', () => {
    handlePagination('next', container, model);
    onUpdate();
  });

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
  onUpdate: () => void,
) {
  addCarsAndUpdateView([data], container, model, onUpdate);
}

export function handleGenerateCars(
  container: HTMLElement,
  model: GarageModelType,
  onUpdate: () => void,
) {
  const randomCars = generateRandomCars();
  addCarsAndUpdateView(randomCars, container, model, onUpdate);
}

function generateRandomCars() {
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

function addCarsAndUpdateView(
  cars: Omit<GarageDataType, 'id'>[],
  container: HTMLElement,
  model: GarageModelType,
  onUpdate: () => void,
) {
  Promise.all(cars.map((car) => setCar(car)))
    .then(() => model.getCars(model.getCurrentPage()))
    .then((updatedCars) => {
      container.replaceChildren();
      updateCarView(container, updatedCars);
      onUpdate();
    })
    .catch((error: Error) => createErrorModal(`Error in processing cars: ${error.message}`));
}

function createPaginationInfo(model: GarageModelType) {
  const paginationInfo = Div('', { id: 'pagination-info' });

  function updatePaginationInfo() {
    const currentPage = model.getCurrentPage();
    const totalPages = model.getTotalPages();
    const totalCars = model.getTotalCars();
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages} | Total cars: ${totalCars}`;
  }

  updatePaginationInfo();
  return { element: paginationInfo, update: updatePaginationInfo };
}
