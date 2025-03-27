import { createWinnersModel } from '~/view/winners/winners-model.ts';
import { createWinnersView } from '~/view/winners/winners-view.ts';

export async function createWinnersController() {
  const model = await createWinnersModel();
  const winners = model.getWinners();
  if (winners) {
    return createWinnersView(winners);
  } else {
    throw new Error('there are no winners');
  }
}
