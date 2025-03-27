import { H1, Header, Link, Nav } from '~/utils/factory.ts';

export function createHeader() {
  const garageLink = Link('Garage', '/');
  const winnersLink = Link('Winners', '/winners');
  return Header(Nav([garageLink, H1('Async Cats'), winnersLink]));
}
