import type { WinnerModelType } from '~/pages/winners/winners-model.ts';
import { isWinnersModel } from '~/pages/winners/winners-model.ts';
import { Button, Div } from '~/utils/factory.ts';
import type { GarageModelType } from '~/pages/garage/garage-model.ts';
import { isGarageModel } from '~/pages/garage/garage-model.ts';
import { createModal } from '~/components/modals/modals.ts';
import { updateCarView } from '~/pages/garage/garage-controller.ts';
import { createWinnersTable } from '~/pages/winners/winners-view.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import type { WinnersDataType } from '~/api/winners-api.ts';

type PaginationModelType = {
  getCurrentPage: () => number;
  getTotalPages: () => number;
} & (
  | { getCars: (page: number) => Promise<GarageDataType[]> }
  | { getWinners: (page: number) => Promise<WinnersDataType[]> }
);

export function createPaginationButtons(
  container: HTMLElement,
  model: GarageModelType | WinnerModelType,
  onUpdate: () => void,
) {
  const previousPageButton = Button('Prev page');
  const nextPageButton = Button('Next page');

  previousPageButton.addEventListener('click', () => {
    handlePagination('prev', container, model);
    onUpdate();
  });
  nextPageButton.addEventListener('click', () => {
    handlePagination('next', container, model);
    onUpdate();
  });

  return [previousPageButton, nextPageButton];
}

export function handlePagination(
  direction: 'prev' | 'next',
  container: HTMLElement,
  model: PaginationModelType,
) {
  const currentPage = model.getCurrentPage();
  const totalPages = model.getTotalPages();
  const newPage = direction === 'prev' ? currentPage - 1 : currentPage + 1;
  if (newPage < 1 || (direction === 'next' && newPage > totalPages)) return;

  if (isGarageModel(model)) {
    model
      .getCars(newPage)
      .then((cars) => {
        container.replaceChildren();
        updateCarView(container, cars);
      })
      .catch((error: Error) => createModal(`${error.toString()}`));
  }
  if (isWinnersModel(model)) {
    model
      .getWinners(newPage)
      .then((winners) => {
        container.replaceChildren();
        createWinnersTable(winners);
      })
      .catch((error: Error) => createModal(`${error.toString()}`));
  }
}

export function createPaginationInfo(model: PaginationModelType) {
  const paginationInfo = Div('', { id: 'pagination-info' });

  function updatePaginationInfo() {
    const currentPage = model.getCurrentPage();
    const totalPages = model.getTotalPages();

    if (isGarageModel(model)) {
      const totalCars = model.getTotalCars();
      paginationInfo.textContent = `Page ${currentPage} of ${totalPages} | Total cats: ${totalCars}`;
    }
    if (isWinnersModel(model)) {
      const totalWinners = model.getTotalWinners();
      paginationInfo.textContent = `Page ${currentPage} of ${totalPages} | Total winners: ${totalWinners}`;
    }
  }

  updatePaginationInfo();
  return { element: paginationInfo, update: updatePaginationInfo };
}
