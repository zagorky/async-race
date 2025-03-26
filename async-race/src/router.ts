// import { createGarageView } from '~/view/garage/garage-view.ts';
// import { createWinnerView } from '~/view/winners/winners-view.ts';
// import { createErrorView } from '~/view/error/error.ts';
//
// type RouteParameters = {
//   path: string;
//   view: () => Promise<HTMLElement> | HTMLElement;
// };
//
// type MatchesParameters = {
//   route: RouteParameters;
//   isPage: boolean;
// };
//
// export async function router(): Promise<void> {
//   const routes: RouteParameters[] = [
//     { path: '*', view: createErrorView },
//     { path: '/', view: createGarageView },
//     { path: '/winners', view: createWinnerView },
//   ];
//
//   const matches: MatchesParameters[] = routes.map((route) => {
//     return {
//       route: route,
//       isPage: location.pathname === route.path,
//     };
//   });
//
//   let match = matches.find((page) => page.isPage);
//
//   if (!match) {
//     match = {
//       route: routes[0],
//       isPage: true,
//     };
//   }
//   const view = await match.route.view();
//   document.body.innerHTML = '';
//   document.body.append(view);
// }
//
// export async function navigator(url: string) {
//   history.pushState(null, '', url);
//   await router();
// }
console.log('');
