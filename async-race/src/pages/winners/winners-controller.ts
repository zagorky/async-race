import { createWinnersModel } from '~/pages/winners/winners-model.ts';
import { createWinnersView } from '~/pages/winners/winners-view.ts';
import { createErrorModal } from '~/pages/modals.ts';

export async function createWinnersController() {
  try {
    const model = createWinnersModel();
    const winners = await model.getWinners();
    return createWinnersView(winners);
  } catch {
    createErrorModal(`Failed to load winners`);
    return createWinnersView([]);
  }
}
