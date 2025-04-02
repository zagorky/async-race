import type { WinnerModelType } from '~/pages/winners/winners-model.ts';
import { createWinnersModel } from '~/pages/winners/winners-model.ts';
import { addWinnerToTable, createWinnersView } from '~/pages/winners/winners-view.ts';
import { createErrorModal } from '~/pages/modals.ts';
import { Div } from '~/utils/factory.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';

export async function createWinnersController() {
  try {
    const model = createWinnersModel();
    const winners = await model.getWinners();
    const { element: paginationInfo, update: updatePagination } = createPaginationInfo(model);

    const view = createWinnersView(winners, model, updatePagination);

    view.prepend(paginationInfo);
    return view;
  } catch {
    createErrorModal(`Failed to load winners`);
  }
}

function createPaginationInfo(model: WinnerModelType) {
  const paginationInfo = Div('', { id: 'pagination-info' });

  function updatePaginationInfo() {
    const currentPage = model.getCurrentPage();
    const totalPages = model.getTotalPages();
    const totalWinners = model.getTotalWinners();
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages} | Total winners: ${totalWinners}`;
  }

  updatePaginationInfo();
  return { element: paginationInfo, update: updatePaginationInfo };
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
