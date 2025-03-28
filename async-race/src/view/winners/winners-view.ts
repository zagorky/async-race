import { Cell, H2, Row, Section, Table, TableHeader } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import { createCarPicture } from '~/view/car/car-view.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';

export function createWinnersView(winners: WinnerDetailedDataType[]) {
  const pageName = 'Winners';
  const table = createWinnersTable();
  winners.forEach((winner) => table.append(addWinnerToTable(winner)));
  return Section([createHeader(), H2(pageName), table]);
}

function addWinnerToTable(winner: WinnerDetailedDataType) {
  const cat = createCarPicture(winner.color);
  return Row([
    Cell(String(winner.id)),
    Cell(cat),
    Cell(winner.name),
    Cell(String(winner.wins)),
    Cell(String(winner.time)),
  ]);
}

function createWinnersTable() {
  return Table(
    TableHeader(Row([Cell('ID'), Cell('Cat'), Cell('Name'), Cell('Wins'), Cell('Time')])),
  );
}
