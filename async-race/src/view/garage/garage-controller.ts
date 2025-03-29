import { createGarageModel } from '~/view/garage/garage-model.ts';
import { createPopup } from '~/utils/modal.ts';
import { createGarageView } from '~/view/garage/garage-view.ts';

export async function createGarageController() {
  try {
    const model = createGarageModel();
    const cars = await model.getCars();
    return createGarageView(cars);
  } catch (error) {
    const popup = createPopup({ children: 'error' });
    popup.showModal();
    throw error;
  }
}
