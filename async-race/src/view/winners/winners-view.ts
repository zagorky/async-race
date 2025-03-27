import { Cell, H2, Row, Section, Table, TableHeader } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import type { WinnersDataType } from '~/api/winners-api.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { createCarPicture } from '~/view/car/car-view.ts';

export function createWinnersView(winners: (WinnersDataType & GarageDataType)[]) {
  const pageName = 'Winners';
  const table = createWinnersTable();
  winners.forEach((winner) => table.append(addWinnerToTable(winner)));
  return Section([createHeader(), H2(pageName), table]);
}

function addWinnerToTable(winner: WinnersDataType & GarageDataType) {
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
    TableHeader(Row([Cell('ID'), Cell('Car'), Cell('Name'), Cell('Wins'), Cell('Time')])),
  );
}
