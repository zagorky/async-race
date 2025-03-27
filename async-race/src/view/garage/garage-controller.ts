import { createGarageModel } from '~/view/garage/garage-model.ts';
import { createGarageView } from '~/view/garage/garage-view.ts';

export async function createGarageController() {
  const model = await createGarageModel();
  const cars = model.getCars();
  if (cars) {
    return createGarageView(cars);
  } else {
    throw new Error('there are no cars');
  }
}
