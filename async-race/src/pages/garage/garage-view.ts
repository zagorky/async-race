import { Div, H2, Section } from '~/utils/factory.ts';
import { replaceCssClass } from '~/utils/helpers.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createControlsContainer, updateCarView } from '~/pages/garage/garage-controller.ts';
import { createHeader } from '~/components/header/header.ts';
import type { GarageModelType } from '~/pages/garage/garage-model.ts';
import { createPaginationInfo } from '~/components/pagination/pagination.ts';

export function createGarageView(cars: GarageDataType[], model: GarageModelType) {
  const pageName = 'Garage';
  const container = Div('', { id: 'cars-container' });

  const { element: paginationInfo, update: updatePaginationInfo } = createPaginationInfo(model);

  const updateAll = (page?: number) => {
    model
      .getCars(page || model.getCurrentPage())
      .then((cars) => {
        container.replaceChildren();
        updateCarView(container, cars);
        updatePaginationInfo();
      })
      .catch((error) => {
        console.error('Error fetching cars:', error);
      });
  };

  const controls = Div(
    createControlsContainer(container, model, () => {
      updateAll(model.getCurrentPage());
    }),
    {
      id: 'controls-container',
    },
  );

  document.body.addEventListener('delete-car', () => updateAll(model.getCurrentPage()));

  replaceCssClass(controls, ['flex-col'], ['flex-row', 'flex-wrap']);
  replaceCssClass(container, [], ['w-full']);
  updateCarView(container, cars);
  return Section([createHeader(), H2(pageName), controls, paginationInfo, container]);
}
