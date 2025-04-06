import { H2, Section } from '~/utils/factory.ts';
import { createHeader } from '~/components/header/header.ts';

export function createErrorView() {
  const pageName = '404 - Page Not Found';
  document.title = pageName;
  return Section([createHeader(), H2(pageName)]);
}
