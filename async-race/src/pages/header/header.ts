import { Button, H1, Header, Link, Nav } from '~/utils/factory.ts';
import { manageButtonsState } from '~/state/state-machine.ts';

export function createHeader() {
  const garageLinkButton = Button(Link('Garage', '/'));
  const winnersLinkButton = Button(Link('Winners', '/winners'));
  manageButtonsState([garageLinkButton, winnersLinkButton]);
  return Header(Nav([garageLinkButton, H1('Async Cats'), winnersLinkButton]));
}
