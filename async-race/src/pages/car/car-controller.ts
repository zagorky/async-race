import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
import { createErrorModal, createUpdateCarModal } from '~/pages/modals.ts';
import type { CarViewType } from '~/pages/car/car-view.ts';
import { createCarView } from '~/pages/car/car-view.ts';
import type { CarModelType } from '~/pages/car/car-model.ts';
import { createCarModel } from '~/pages/car/car-model.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import {
  animateCar,
  calculateAnimationDuration,
  carAnimations,
  handleCarBreakdown,
  resetCarPosition,
} from '~/pages/animation/animation.ts';
import { hasSome } from '@powwow-js/core';

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
  carAnimations.set(carElement, {
    frameId: null,
    isBroken: false,
    currentPosition: 0,
  });

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
    const animationState = carAnimations.get(carElement);
    if (hasSome(animationState)) {
      animationState.isBroken = false;
      carElement.style.border = '';
      carElement.style.animation = '';

      setButtonsState(buttons, true);

      model
        .startCar(carData.id)
        .then((data) => {
          const duration = calculateAnimationDuration(data.velocity, data.distance);
          animateCar(carElement, duration);

          return model.driveCar(carData.id).then((result) => {
            if (!result.success) {
              handleCarBreakdown(carElement); // Обработка поломки
            }
          });
        })

        .catch(() => handleCarBreakdown(carElement));
    }
  });
  buttons.returnCarButton.addEventListener('click', () => {
    resetCarPosition(carElement);
    setButtonsState(buttons, false);
  });
  return buttons;
}

function createButtons(id: number) {
  return {
    updateCarButton: Button('Update', { id: `update-${id}` }),
    removeCarButton: Button('Remove', { id: `remove-${id}` }),
    startCarButton: Button('Start', { id: `start-${id}` }),
    returnCarButton: Button('Return', { id: `return-${id}` }),
  };
}

const setButtonsState = (buttons: ReturnType<typeof createButtons>, disabled: boolean) => {
  buttons.startCarButton.disabled = disabled;
  buttons.updateCarButton.disabled = disabled;
  buttons.removeCarButton.disabled = disabled;
  buttons.returnCarButton.disabled = !disabled;
};
