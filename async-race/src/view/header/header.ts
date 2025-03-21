import { H1, Header, Link, Nav } from '~/utils/factory.ts';

export function createHeader() {
  const garageLink = Link('Garage', '/');
  const winnersLink = Link('Winners', '/winners');
  return Header([H1('Async Race'), Nav([garageLink, winnersLink])]);
}
