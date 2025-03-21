import { H2, Section } from '~/utils/factory.ts';
import { createHeader } from '~/view/header/header.ts';

export function createWinnerView() {
  const pageName = 'Winners';
  document.title = pageName;
  return Section([createHeader(), H2(pageName)]);
}
