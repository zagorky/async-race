import { Div, H2, Section } from '~/utils/factory.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createControlsContainer } from '~/pages/garage/garage-controller.ts';
import { createCarView } from '~/pages/car/car-view.ts';
import { createHeader } from '~/pages/header/header.ts';

export function createGarageView(cars: GarageDataType[]) {
  const pageName = 'Garage';
  const container = Div('', { id: 'cars-container' });
  const controls = Div(createControlsContainer(container), { id: 'controls-container' });
  replaceCssClass(controls, ['flex-col'], ['flex-row', 'flex-wrap']);
  replaceCssClass(container, [], ['w-full']);
  cars.forEach((car) => {
    container.append(createCarView(car));
  });

  return Section([createHeader(), H2(pageName), controls, container]);
}
