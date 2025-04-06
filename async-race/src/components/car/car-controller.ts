import type { GarageDataType } from '~/api/garage-api.ts';
import { Button, Div } from '~/utils/factory.ts';
import { createModal, createUpdateCarModal } from '~/components/modals/modals.ts';
import type { CarViewType } from '~/components/car/car-view.ts';
import { createCarView } from '~/components/car/car-view.ts';
import type { CarModelType } from '~/components/car/car-model.ts';
import { createCarModel } from '~/components/car/car-model.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import { carAnimations } from '~/components/animation/animation.ts';
import { returnCar, startCar } from '~/components/race/race-utilities.ts';
import { registerButtons } from '~/state/state-manager.ts';

export function createCarController(carData: GarageDataType) {
  const model = createCarModel();
  const viewElements = createCarView(carData);
  const view = viewElements.container;

  const [updateCarButton, removeCarButton, startCarButton, returnCarButton] = createCarControls(
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
  const [updateCarButton, removeCarButton, startCarButton, returnCarButton] = createButtons(
    carData.id,
  );

  registerButtons(
    'car',
    [updateCarButton, removeCarButton, startCarButton, returnCarButton],
    carData.id,
    view.svgContainer,
  );
  const carElement = view.svgContainer;
  carAnimations.set(carElement, {
    frameId: null,
    isBroken: false,
    currentPosition: 0,
  });

  updateCarButton.addEventListener('click', () => {
    const modal = createUpdateCarModal(carData, (updatedData) => {
      return model
        .updateCar(updatedData)
        .then((data) => {
          const updatedCar = createCarController(data);
          view.container.replaceWith(updatedCar);
        })
        .catch((error: Error) => createModal(`Error in update ${error.message}`));
    });

    document.body.append(modal);
    modal.showModal();
  });
  removeCarButton.addEventListener('click', () => {
    model
      .removeCar(carData.id)
      .then(() => view.container.remove())
      .catch((error: Error) => createModal(`error in delete ${error.message}`));
  });
  startCarButton.addEventListener('click', () => {
    startCar(carData.id, true);
  });
  returnCarButton.addEventListener('click', () => {
    returnCar(carData.id);
  });
  return [updateCarButton, removeCarButton, startCarButton, returnCarButton];
}

function createButtons(id: number) {
  return [
    Button('Update', { id: `update-${id}` }),
    Button('Remove', { id: `remove-${id}` }),
    Button('Start', { id: `start-${id}` }),
    Button('Return', { id: `return-${id}` }),
  ];
}
