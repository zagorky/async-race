import { Div, H2, Section } from '~/utils/factory.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createControlsContainer, updateCarView } from '~/pages/garage/garage-controller.ts';
import { createHeader } from '~/pages/header/header.ts';
import type { GarageModelType } from '~/pages/garage/garage-model.ts';

export function createGarageView(cars: GarageDataType[], model: GarageModelType) {
  const pageName = 'Garage';
  const container = Div('', { id: 'cars-container' });
  const controls = Div(createControlsContainer(container, model), { id: 'controls-container' });
  replaceCssClass(controls, ['flex-col'], ['flex-row', 'flex-wrap']);
  replaceCssClass(container, [], ['w-full']);
  updateCarView(container, cars);

  return Section([createHeader(), H2(pageName), controls, container]);
}
