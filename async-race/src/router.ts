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
// // console.log('');

type PathType = {
  path: string;
  view: (signal?: AbortSignal) => Promise<HTMLElement>;
};

type RouterConfig = {
  routes: PathType[];
};

let abortController: AbortController | null = null;

// config
const config: RouterConfig = {
  routes: [
    {
      path: '/',
      view: async (): Promise<HTMLElement> => {
        const module = await import('../src/view/garage/garage-controller.ts');
        return module.createGarageController();
      },
    },
    {
      path: '/winners',
      view: async (): Promise<HTMLElement> => {
        const module = await import('../src/view/winners/winners-controller.ts');
        return module.createWinnersController();
      },
    },
  ],
};

// router
export async function router(): Promise<void> {
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  const signal = abortController.signal;

  let match = config.routes.find((route) => location.pathname === route.path);

  if (!match) {
    match = {
      path: '/*',
      view: async (): Promise<HTMLElement> => {
        const module = await import('../src/view/error/error.ts');
        return module.createErrorView();
      },
    };
  }

  const view = await match.view(signal);
  if (!signal.aborted) {
    document.body.replaceChildren(view);
  }
}

export function navigator(url: string) {
  history.pushState(null, '', url);
  router().catch((error) => {
    console.error('router error in navigator:', error);
  });
}
