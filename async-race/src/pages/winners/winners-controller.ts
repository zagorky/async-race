import { createWinnersModel } from '~/pages/winners/winners-model.ts';
import { createWinnersView } from '~/pages/winners/winners-view.ts';
import { createPopup } from '~/utils/modal.ts';

export async function createWinnersController() {
  try {
    const model = createWinnersModel();
    const winners = await model.getWinners();
    return createWinnersView(winners, model);
  } catch (error) {
    const modal = createPopup({
      children: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });

    document.body.append(modal);
    modal.showModal();
    return modal;
  }
}
