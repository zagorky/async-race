import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
import { createErrorModal, createUpdateCarModal } from '~/pages/modals.ts';
import { createCarView } from '~/pages/car/car-view.ts';
import type { CarModelType } from '~/pages/car/car-model.ts';
import { createCarModel } from '~/pages/car/car-model.ts';
import { replaceCssClass } from '~/utils/helpers.ts';

export function createCarController(carData: GarageDataType) {
  const model = createCarModel();
  const view = createCarView(carData);

  const { updateCarButton, removeCarButton, startCarButton, returnCarButton } = createCarControls(
    carData,
    model,
    view,
  );

  const controlsContainer = Div([
    updateCarButton,
    removeCarButton,
    startCarButton,
    returnCarButton,
  ]);

  replaceCssClass(controlsContainer, ['flex-col'], ['flex-row']);
  controlsContainer.append(updateCarButton, removeCarButton, startCarButton, returnCarButton);
  view.prepend(controlsContainer);
  return view;
}

export function createCarControls(carData: GarageDataType, model: CarModelType, view: HTMLElement) {
  const updateCarButton = Button('Update', { id: `update-${carData.id}` });
  updateCarButton.addEventListener('click', () => {
    const modal = createUpdateCarModal(carData, (updatedData) => {
      return model
        .updateCar(updatedData)
        .then((data) => {
          const updatedCar = createCarController(data);
          view.replaceWith(updatedCar);
        })
        .catch((error: Error) => createErrorModal(`Error in update ${error.message}`));
    });

    document.body.append(modal);
    modal.showModal();
  });
  const removeCarButton = Button('Remove', { id: `remove-${carData.id}` });
  removeCarButton.addEventListener('click', () => {
    model
      .removeCar(carData.id)
      .then(() => view.remove())
      .catch((error: Error) => createErrorModal(`error in delete ${error.message}`));
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

function animateCar(carElement: HTMLElement, duration: number) {
  carElement.style.transform = `translateX(calc(100%-${carElement.offsetWidth}px)`;
  carElement.style.transition = `transform ${duration}ms linear`;
}

function resetCarPosition(carElement: HTMLElement) {
  carElement.style.transform = `none`;
  carElement.style.transition = 'translateX(0)';
}

function calculateAnimationDuration(velocity: number, distance: number) {
  return distance / velocity;
}

console.log(animateCar, resetCarPosition, calculateAnimationDuration);
