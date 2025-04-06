import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
import type { GarageModelType } from '~/pages/garage/garage-model.ts';
import { createGarageModel } from '~/pages/garage/garage-model.ts';
import { createGarageView } from '~/pages/garage/garage-view.ts';
import { createAddCarModal, createModal } from '~/components/modals/modals.ts';
import { generateRandomCars } from '~/pages/garage/data-for-generation.ts';
import { createCarController } from '~/components/car/car-controller.ts';
import {
  createPaginationButtons,
  createPaginationInfo,
} from '~/components/pagination/pagination.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import { resetRace, startRace } from '~/components/race/race-utilities.ts';
import { registerButtons } from '~/state/state-manager.ts';
import { createPopup } from '~/utils/modal.ts';

export async function createGarageController() {
  try {
    const model = createGarageModel();
    const cars = await model.getCars(model.getCurrentPage());
    const { element: paginationInfo, update: updatePaginationInfo } = createPaginationInfo(model);
    const view = createGarageView(cars, model, updatePaginationInfo);
    view.prepend(paginationInfo);
    return view;
  } catch (error) {
    const modal = createPopup({
      children: `Failed to load cats ${error instanceof Error ? error.message : String(error)}`,
    });

    document.body.append(modal);
    modal.showModal();
    return modal;
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

  const buttons = [
    addCarButton,
    startRaceButton,
    resetRaceButton,
    generateCarsButton,
    previousPageButton,
    nextPageButton,
  ];

  registerButtons('garage', buttons);

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
  startRaceButton.addEventListener('click', () => {
    model
      .getCars(model.getCurrentPage())
      .then((cars) => {
        startRace(cars).catch((error) => {
          throw error;
        });
      })
      .catch((error) => {
        console.error('Failed to get cars:', error);
      });
  });
  resetRaceButton.addEventListener('click', () => {
    model
      .getCars(model.getCurrentPage())
      .then((cars) => {
        resetRace(cars);
      })
      .catch((error) => {
        console.error('Failed to get cars:', error);
      });
  });

  return buttons;
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
    .catch((error: Error) => createModal(`Error in processing cars: ${error.message}`));
}
