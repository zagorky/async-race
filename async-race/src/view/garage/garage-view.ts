import { Button, Div, H2, Section } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createCarView } from '~/view/car/car-view.ts';

export function createGarageView(cars: GarageDataType[]) {
  const pageName = 'Garage';
  const controls = Div(createControlsContainer());
  replaceCssClass(controls, ['flex-col'], ['flex-row', 'flex-wrap']);
  const container = Div('');
  replaceCssClass(container, [], ['w-full']);
  cars.forEach((car) => {
    container.append(createCarView(car));
  });

  return Section([createHeader(), H2(pageName), controls, container]);
}

export function createControlsContainer() {
  const addCarButton = Button('Add Cat');
  const startRaceButton = Button('Start Race');
  const resetRaceButton = Button('Reset Race');
  const generateCarsButton = Button('Generate Cats');
  const previousPageButton = Button('<=');
  const nextPageButton = Button('=>');

  return [
    addCarButton,
    startRaceButton,
    resetRaceButton,
    generateCarsButton,
    previousPageButton,
    nextPageButton,
  ];
}
