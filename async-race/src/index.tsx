import { navigator, router } from '~/router.ts';
import { assertIsInstanceOf } from '@powwow-js/core';

import { App } from '~/app.tsx';
import { Popik } from '~/engine/popik.ts';

const popikRoot = document.createElement('div');
document.body.append(popikRoot);

Popik.render(<App />, popikRoot);

window.addEventListener('popstate', () => {
  router().catch((error) => {
    console.error('router error:', error);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    assertIsInstanceOf(HTMLElement, event.target);
    if (event.target.matches('[data-href]')) {
      event.preventDefault();
      const href = event.target.dataset.href;
      if (href) {
        navigator(href);
      }
    }
  });
  router().catch((error) => {
    console.error('router error in event listener:', error);
  });
});
