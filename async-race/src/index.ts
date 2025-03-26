// import { navigator, router } from '~/router.ts';
// import { assertIsInstanceOf } from '@powwow-js/core';
//
// window.addEventListener('popstate', () => void router());
//
// document.addEventListener('DOMContentLoaded', () => {
//   document.body.addEventListener('click', (event) => {
//     assertIsInstanceOf(HTMLElement, event.target);
//     if (event.target.matches('[data-href]')) {
//       event.preventDefault();
//       const href = event.target.dataset.href;
//
//       if (href) {
//         void navigator(href);
//       }
//     }
//   });
//   void router();
// });

import { createGarageView } from '~/view/garage/garage-view.ts';

document.addEventListener('DOMContentLoaded', () => {
  createGarageView()
    .then((view) => {
      document.body.append(view);
    })
    .catch((error) => {
      console.error('error loading', error);
    });
});
