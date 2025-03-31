import { Div, H2, Section } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createCarView } from '~/view/car/car-view.ts';
import { createControlsContainer } from '~/view/garage/garage-controller.ts';

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
