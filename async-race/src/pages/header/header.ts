import { Button, H1, Header, Link, Nav } from '~/utils/factory.ts';
import { registerButtons } from '~/state/state-manager.ts';

export function createHeader() {
  const garageLinkButton = Button(Link('Garage', '/'));
  const winnersLinkButton = Button(Link('Winners', '/winners'));
  registerButtons('header', [garageLinkButton, winnersLinkButton]);
  return Header(Nav([garageLinkButton, H1('Async Cats'), winnersLinkButton]));
}
