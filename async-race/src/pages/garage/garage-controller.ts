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
import { createPaginationButtons, createPaginationInfo } from '~/pages/pagination/pagination.ts';
import { replaceCssClass } from '~/utils/helpers.ts';

export async function createGarageController() {
  try {
    const model = createGarageModel();
    const cars = await model.getCars(model.getCurrentPage());
    const { element: paginationInfo, update: updatePagination } = createPaginationInfo(model);

    const view = createGarageView(cars, model, updatePagination);

    view.prepend(paginationInfo);
    return view;
  } catch (error) {
    return createErrorModal(
      `Failed to load cats ${error instanceof Error ? error.message : String(error)}`,
    );
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
  const [previousPageButton, nextPageButton] = createPaginationButtons(container, model, onUpdate);

  const paginationContainer = Div([previousPageButton, nextPageButton], {
    id: 'pagination-container',
  });

  replaceCssClass(paginationContainer, ['flex-col'], ['flex-row']);

  addCarButton.addEventListener('click', () => {
    const modal = createAddCarModal((data) => handleAddCar(data, container, model, onUpdate));
    document.body.append(modal);
    modal.showModal();
  });
  generateCarsButton.addEventListener('click', () => {
    handleGenerateCars(container, model, onUpdate);
  });

  return [addCarButton, startRaceButton, resetRaceButton, generateCarsButton, paginationContainer];
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
