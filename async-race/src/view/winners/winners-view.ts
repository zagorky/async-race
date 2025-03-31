import { Button, Cell, H2, Row, Section, Table, TableBody, TableHeader } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';
import { createCarPicture } from '~/view/car/car-view.ts';
import type { WinnerDetailedDataType } from '~/api/winners-api.ts';

export function createWinnersView(winners: WinnerDetailedDataType[]) {
  const pageName = 'Winners';
  const table = createWinnersTable(winners);
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

function createWinnersTable(winners: WinnerDetailedDataType[]) {
  const winsButton = Button('Wins ↑');
  const timeButton = Button('Time ↑');
  const tableBody = TableBody('');

  winsButton.addEventListener('click', () => {
    const direction = winsButton.textContent?.includes('↑') ? 'asc' : 'desc';
    winsButton.textContent = winsButton.textContent?.includes('↑') ? 'Wins ↓' : 'Wins ↑';
    const sortedWinners = sortWinners(winners, 'wins', direction);
    tableBody.replaceChildren();
    sortedWinners.forEach((winner) => tableBody.append(addWinnerToTable(winner)));
  });
  timeButton.addEventListener('click', () => {
    const direction = timeButton.textContent?.includes('↑') ? 'asc' : 'desc';
    timeButton.textContent = timeButton.textContent?.includes('↑') ? 'Time ↓' : 'Time ↑';
    const sortedWinners = sortWinners(winners, 'time', direction);
    tableBody.replaceChildren();
    sortedWinners.forEach((winner) => tableBody.append(addWinnerToTable(winner)));
  });

  const table = Table(
    TableHeader(Row([Cell('ID'), Cell('Cat'), Cell('Name'), Cell(winsButton), Cell(timeButton)])),
  );

  winners.forEach((winner) => tableBody.append(addWinnerToTable(winner)));
  table.append(tableBody);
  return table;
}

function sortWinners(
  winners: WinnerDetailedDataType[],
  sortBy: 'wins' | 'time',
  direction: 'asc' | 'desc',
) {
  return [...winners].sort((a, b) => {
    if (sortBy === 'wins') {
      return direction === 'asc' ? a.wins - b.wins : b.wins - a.wins;
    } else {
      return direction === 'asc' ? a.time - b.time : b.time - a.time;
    }
  });
}
