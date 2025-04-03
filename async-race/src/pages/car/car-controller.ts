import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
import { createErrorModal, createUpdateCarModal } from '~/pages/modals.ts';
import type { CarViewType } from '~/pages/car/car-view.ts';
import { createCarView } from '~/pages/car/car-view.ts';
import type { CarModelType } from '~/pages/car/car-model.ts';
import { createCarModel } from '~/pages/car/car-model.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import { assertIsInstanceOf } from '@powwow-js/core';

export function createCarController(carData: GarageDataType) {
  const model = createCarModel();
  const viewElements = createCarView(carData);
  const view = viewElements.container;

  const { updateCarButton, removeCarButton, startCarButton, returnCarButton } = createCarControls(
    carData,
    model,
    viewElements,
  );

  const controlsContainer = Div([
    updateCarButton,
    removeCarButton,
    startCarButton,
    returnCarButton,
  ]);

  replaceCssClass(controlsContainer, ['flex-col'], ['flex-row']);
  view.prepend(controlsContainer);
  return view;
}

export function createCarControls(carData: GarageDataType, model: CarModelType, view: CarViewType) {
  const buttons = createButtons(carData.id);
  const carElement = view.svgContainer;
  assertIsInstanceOf(HTMLElement, carElement);

  buttons.updateCarButton.addEventListener('click', () => {
    const modal = createUpdateCarModal(carData, (updatedData) => {
      return model
        .updateCar(updatedData)
        .then((data) => {
          const updatedCar = createCarController(data);
          view.container.replaceWith(updatedCar);
        })
        .catch((error: Error) => createErrorModal(`Error in update ${error.message}`));
    });

    document.body.append(modal);
    modal.showModal();
  });
  buttons.removeCarButton.addEventListener('click', () => {
    model
      .removeCar(carData.id)
      .then(() => view.container.remove())
      .catch((error: Error) => createErrorModal(`error in delete ${error.message}`));
  });
  buttons.startCarButton.addEventListener('click', () => {
    model
      .startCar(carData.id)
      .then((data) => {
        const duration = calculateAnimationDuration(data.velocity, data.distance);
        animateCar(carElement, duration);

        return model.driveCar(carData.id).then((result) => {
          if (!result.success) {
            carElement.style.border = '3px solid red';
            carElement.style.animation = 'blink 0.5s infinite alternate';
            carElement.style.transform = `translateX(0)`;
          }
        });
      })
      .catch((error) => console.warn(`${error instanceof Error ? error.message : String(error)}`));
  });
  buttons.returnCarButton.addEventListener('click', () => resetCarPosition(carElement));
  return buttons;
}

function animateCar(carElement: HTMLElement, duration: number) {
  carElement.style.transform = `translateX(${window.innerWidth - carElement.offsetWidth}px)`;
  carElement.style.transition = `transform ${duration}ms linear`;
}

function resetCarPosition(carElement: HTMLElement) {
  carElement.style.transform = `none`;
  carElement.style.transition = 'translateX(0)';
}

function calculateAnimationDuration(velocity: number, distance: number) {
  return distance / velocity;
}

function createButtons(id: number) {
  return {
    updateCarButton: Button('Update', { id: `update-${id}` }),
    removeCarButton: Button('Remove', { id: `remove-${id}` }),
    startCarButton: Button('Start', { id: `start-${id}` }),
    returnCarButton: Button('Return', { id: `return-${id}`, disabled: 'true' }),
  };
}
