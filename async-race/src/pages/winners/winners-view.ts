import { Div, H2, Section } from '~/utils/factory.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { createHeader } from '~/components/header/header.ts';
import type { WinnerModelType } from '~/pages/winners/winners-model.ts';
import {
  createPaginationButtons,
  createPaginationInfo,
} from '~/components/pagination/pagination.ts';
import { createWinnersTable } from '~/components/table/table.ts';

export function createWinnersView(
  initialWinners: WinnerDetailedDataType[],
  model: WinnerModelType,
) {
  const pageName = 'Winners';
  const { table, updateTable, tableBody } = createWinnersTable(initialWinners);
  const { element: paginationInfo, update: updatePaginationInfo } = createPaginationInfo(model);

  const updateAll = (page?: number) => {
    model
      .getWinners(page || model.getCurrentPage())
      .then((winners) => {
        updateTable(winners);
        updatePaginationInfo();
      })
      .catch((error) => {
        console.error('Error fetching winners:', error);
      });
  };

  const paginationButtons = createPaginationButtons(tableBody, model, () => {
    updateAll(model.getCurrentPage());
  });

  const paginationContainer = Div(paginationButtons, {
    id: 'pagination-container',
    class: 'flex-row',
  });

  return Section([createHeader(), H2(pageName), paginationInfo, paginationContainer, table]);
}
