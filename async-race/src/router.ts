console.log('');

// import { mainPage } from '~/pages/Main/main.ts';
// import { decisionPickerPage } from '~/pages/DecisionPicker/decision-picker.ts';
// import { errorPage } from '~/pages/Error/error.ts';
// import { store } from '~/store/store.ts';
// import { selectors } from '~/store/selectors.ts';
//
// let abortController: AbortController | null = null;
//
// const historyResolver = (url: string): void => {
//   const targetHash = new URL(url, globalThis.location.href).hash || '#/';
//
//   if (globalThis.location.hash !== targetHash) {
//     history.pushState({}, '', url);
//   }
//
//   handleRouteChange(targetHash);
// };
//
// //TODO add config and rewrite func
// const handleRouteChange = (url: string): void => {
//   if (abortController) {
//     abortController.abort();
//   }
//   abortController = new AbortController();
//   const { signal } = abortController;
//
//   document.body.replaceChildren();
//
//   const formattedHash = url.startsWith('#') ? url : '#/';
//
//   switch (formattedHash) {
//     case '#/': {
//       document.body.append(mainPage(signal));
//       break;
//     }
//     case '#/decision-picker': {
//       document.body.append(decisionPickerPage(signal));
//       break;
//     }
//     default: {
//       document.body.append(errorPage(signal));
//       break;
//     }
//   }
// };
//
// globalThis.addEventListener('popstate', () => {
//   const currentHash: string = globalThis.location.hash || '#/';
//   if (!store.useSelector(selectors.hasDataForStart)) {
//     return Router.navigate('#/');
//   }
//   Router.navigate(currentHash);
// });
//
// const Router = {
//   navigate: historyResolver,
// };
//
// export { Router };
