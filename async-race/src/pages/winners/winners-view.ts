import { Button, Cell, H2, Row, Section, Table, TableBody, TableHeader } from '~/utils/factory.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { createHeader } from '~/pages/header/header.ts';
import { createCarPicture } from '~/pages/car/car-view.ts';
import type { WinnerModelType } from '~/pages/winners/winners-model.ts';
import { handleSort } from '~/pages/winners/winners-controller.ts';

export function createWinnersView(
  winners: WinnerDetailedDataType[],
  model: WinnerModelType,
  onUpdate: () => void,
) {
  const pageName = 'Winners';
  const table = createWinnersTable(winners);
  console.log(model, onUpdate);

  // const [previousPageButton, nextPageButton] = createPaginationButtons(table, model, onUpdate);

  return Section([createHeader(), H2(pageName), table]);
}

export function addWinnerToTable(winner: WinnerDetailedDataType) {
  const cat = createCarPicture(winner.color);
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

  winners.forEach((winner) => tableBody.append(addWinnerToTable(winner)));
  table.append(tableBody);
  return table;
}
