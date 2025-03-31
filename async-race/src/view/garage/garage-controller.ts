import { createGarageModel } from '~/view/garage/garage-model.ts';
import { createGarageView } from '~/view/garage/garage-view.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { setCar } from '~/api/garage-api.ts';
import { createErrorModal } from '~/view/modals.ts';
import { Button } from '~/utils/factory.ts';

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

export function createControlsContainer() {
  const addCarButton = Button('Add Cat');
  const startRaceButton = Button('Start Race');
  const resetRaceButton = Button('Reset Race');
  const generateCarsButton = Button('Generate Cats');
  const previousPageButton = Button('<=');
  const nextPageButton = Button('=>');

  addCarButton.addEventListener('click', () => {
    // const modal = ;
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

export function handleAddCar(data: Omit<GarageDataType, 'id'>) {
  setCar(data)
    .then(() => {
      return data;
    })
    .catch((error: Error) => createErrorModal(`Error in adding car: ${error.message}`));
}
