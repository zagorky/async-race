import type { WinnerDetailedDataType } from '~/api/winners-api.ts';
import { Button, Cell, Row, TableBody, TableHeader } from '~/utils/factory.ts';
import { createCarPicture } from '~/components/car/car-view.ts';

type SortConfig = {
  field: 'wins' | 'time';
  direction: 'asc' | 'desc';
};

export function createWinnersTable(initialWinners: WinnerDetailedDataType[]) {
  const tableBody = TableBody('');
  let winners = [...initialWinners];
  let sortConfig: SortConfig | null = null;
  const { winsButton, timeButton } = createSortButtons();

  const table = createTableHeader(winsButton, timeButton);

  const updateTable = () => {
    tableBody.replaceChildren();

    const displayWinners = sortConfig
      ? sortWinners([...winners], sortConfig.field, sortConfig.direction)
      : winners;

    displayWinners.forEach((winner) => tableBody.append(createWinnerRow(winner)));
    table.append(tableBody);
  };

  const handleSort = (field: 'wins' | 'time') => {
    const button = field === 'wins' ? winsButton : timeButton;
    const currentDirection = button.textContent?.includes('↑') ? 'asc' : 'desc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    button.textContent = `${field} ${newDirection === 'asc' ? '↑' : '↓'}`;
    sortConfig = { field, direction: newDirection };
    updateTable();
  };

  winsButton.addEventListener('click', () => handleSort('wins'));
  timeButton.addEventListener('click', () => handleSort('time'));

  const updateData = (newWinners: WinnerDetailedDataType[]) => {
    winners = [...newWinners];
    updateTable();
  };

  updateTable();
  return { table, updateTable: updateData, tableBody };
}

function createTableHeader(winsButton: HTMLButtonElement, timeButton: HTMLButtonElement) {
  return TableHeader(
    Row([Cell('ID'), Cell('Car'), Cell('Name'), Cell(winsButton), Cell(timeButton)]),
  );
}

function createSortButtons() {
  const winsButton = Button('Wins ↑');
  const timeButton = Button('Time ↑');
  return { winsButton, timeButton };
}

function createWinnerRow(winner: WinnerDetailedDataType) {
  const carImage = createCarPicture(winner.color, winner.id);
  return Row([
    Cell(String(winner.id)),
    Cell(carImage),
    Cell(winner.name),
    Cell(String(winner.wins)),
    Cell(String(winner.time)),
  ]);
}

function sortWinners(
  winners: WinnerDetailedDataType[],
  field: 'wins' | 'time',
  direction: 'asc' | 'desc',
) {
  return [...winners].sort((a, b) =>
    direction === 'asc' ? a[field] - b[field] : b[field] - a[field],
  );
}
