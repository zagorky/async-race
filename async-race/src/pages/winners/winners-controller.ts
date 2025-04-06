import { createWinnersModel } from '~/pages/winners/winners-model.ts';
import { addWinnerToTable, createWinnersView } from '~/pages/winners/winners-view.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { createPaginationInfo } from '~/components/pagination/pagination.ts';
import { createPopup } from '~/utils/modal.ts';

export async function createWinnersController() {
  try {
    const model = createWinnersModel();
    const winners = await model.getWinners(model.getCurrentPage());
    const { element: paginationInfo, update: updatePaginationInfo } = createPaginationInfo(model);
    const view = createWinnersView(winners, model, updatePaginationInfo);
    view.prepend(paginationInfo);
    return view;
  } catch (error) {
    const modal = createPopup({
      children: `Failed to load winners ${error instanceof Error ? error.message : String(error)}`,
    });

    document.body.append(modal);
    modal.showModal();
    return modal;
  }
}

export function handleSort(
  button: HTMLButtonElement,
  sortBy: 'wins' | 'time',
  winners: WinnerDetailedDataType[],
  parent: HTMLElement,
) {
  const direction = button.textContent?.includes('↑') ? 'asc' : 'desc';
  button.textContent = button.textContent?.includes('↑') ? `${sortBy} ↓` : `${sortBy} ↑`;
  const sortedWinners = sortWinners(winners, sortBy, direction);
  parent.replaceChildren();
  sortedWinners.forEach((winner) => parent.append(addWinnerToTable(winner)));
}

function sortWinners(
  winners: WinnerDetailedDataType[],
  sortBy: 'wins' | 'time',
  direction: 'asc' | 'desc',
) {
  return [...winners].sort((a, b) =>
    direction === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy],
  );
}
