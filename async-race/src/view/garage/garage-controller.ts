import { createGarageModel } from '~/view/garage/garage-model.ts';
import { createGarageView } from '~/view/garage/garage-view.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { createAddCarModal, createErrorModal } from '~/view/modals.ts';
import { Button } from '~/utils/factory.ts';
import { createCarView } from '~/view/car/car-view.ts';

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
