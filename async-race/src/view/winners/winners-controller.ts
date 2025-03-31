import { createWinnersModel } from '~/view/winners/winners-model.ts';
import { createWinnersView } from '~/view/winners/winners-view.ts';
import { createErrorModal } from '~/view/modals.ts';

export async function createWinnersController() {
  try {
    const model = createWinnersModel();
    const winners = await model.getWinners();
    return createWinnersView(winners);
  } catch {
    createErrorModal(`Failed to load winners`);
  }
}
