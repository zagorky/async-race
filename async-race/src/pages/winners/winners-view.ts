import {
  Button,
  Cell,
  Div,
  H2,
  Row,
  Section,
  Table,
  TableBody,
  TableHeader,
} from '~/utils/factory.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { createHeader } from '~/pages/header/header.ts';
import { createCarPicture } from '~/pages/car/car-view.ts';
import type { WinnerModelType } from '~/pages/winners/winners-model.ts';
import { handleSort } from '~/pages/winners/winners-controller.ts';
import { createPaginationButtons } from '~/pages/pagination/pagination.ts';
import { replaceCssClass } from '~/utils/helpers.ts';

export function createWinnersView(
  winners: WinnerDetailedDataType[],
  model: WinnerModelType,
  onUpdate: () => void,
) {
  const pageName = 'Winners';
  const { table, updateTable } = createWinnersTable(winners);
  console.log(updateTable);

  const paginationContainer = Div(createPaginationButtons(table, model, onUpdate), {
    id: 'pagination-container',
  });

  replaceCssClass(paginationContainer, ['flex-col'], ['flex-row']);
  return Section([createHeader(), H2(pageName), paginationContainer, table]);
}

export function addWinnerToTable(winner: WinnerDetailedDataType) {
  const cat = createCarPicture(winner.color, winner.id);
  return Row([
    Cell(String(winner.id)),
    Cell(cat),
    Cell(winner.name),
    Cell(String(winner.wins)),
    Cell(String(winner.time)),
  ]);
}

export function createWinnersTable(winners: WinnerDetailedDataType[]) {
  const winsButton = Button('Wins ↑');
  const timeButton = Button('Time ↑');
  const tableBody = TableBody('');

  winsButton.addEventListener('click', () => handleSort(winsButton, 'wins', winners, tableBody));
  timeButton.addEventListener('click', () => handleSort(timeButton, 'time', winners, tableBody));

  const table = Table(
    TableHeader(Row([Cell('ID'), Cell('Cat'), Cell('Name'), Cell(winsButton), Cell(timeButton)])),
  );

  function updateTable(newWinners: WinnerDetailedDataType[]) {
    tableBody.replaceChildren();
    newWinners.forEach((winner: WinnerDetailedDataType) =>
      tableBody.append(addWinnerToTable(winner)),
    );
  }

  winners.forEach((winner) => tableBody.append(addWinnerToTable(winner)));
  table.append(tableBody);
  return { table, updateTable };
}
