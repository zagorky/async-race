import type { GarageDataType } from '~/api/garage-api.ts';
import { deleteCar, updateCar } from '~/api/garage-api.ts';
import { createErrorModal, createUpdateCarModal } from '~/view/modals.ts';
import { createCarView } from '~/view/car/car-view.ts';
import { Button } from '~/utils/factory.ts';

export function handleRemoveCar(id: number, container: HTMLElement) {
  deleteCar(id)
    .then(() => {
      console.log(`car ${id} is deleted`);
      container.remove();
    })
    .catch((error: Error) => createErrorModal(`error in delete ${error.message}`));
}

export function handleUpdateCar(carData: GarageDataType, container: HTMLElement) {
  updateCar(carData.id, { color: carData.color, name: carData.name })
    .then((data) => {
      const updatedCar = createCarView(data);
      container.replaceWith(updatedCar);
    })
    .catch((error: Error) => createErrorModal(`Error in update ${error.message}`));
}

export function createCarControls(
  carData: GarageDataType,
  onUpdate: (data: GarageDataType) => void,
  onDelete: (id: number) => void,
) {
  const updateCarButton = Button('Update', { id: `update-${carData.id}` });
  updateCarButton.addEventListener('click', () => {
    const modal = createUpdateCarModal(carData, (updatedData) => onUpdate(updatedData));
    document.body.append(modal);
    modal.showModal();
  });
  const removeCarButton = Button('Remove', { id: `remove-${carData.id}` });
  removeCarButton.addEventListener('click', () => {
    onDelete(carData.id);
  });
  const startCarButton = Button('Start', { id: `start-${carData.id}` });
  startCarButton.addEventListener('click', () => {
    // onStart
  });
  const returnCarButton = Button('Return', { id: `return-${carData.id}` });
  returnCarButton.addEventListener('click', () => {
    //onReturn
  });
  return {
    updateCarButton,
    removeCarButton,
    startCarButton,
    returnCarButton,
  };
}
