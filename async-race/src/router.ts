import { createGarageView } from '~/view/garage/garage-view.ts';
import { createWinnerView } from '~/view/winners/winners-view.ts';
import { createErrorView } from '~/view/error/error.ts';

type RouteParameters = {
  path: string;
  view: () => HTMLElement;
};

type MatchesParameters = {
  route: RouteParameters;
  isPage: boolean;
};

export function router(): void {
  const routes: RouteParameters[] = [
    { path: '*', view: createErrorView },
    { path: '/', view: createGarageView },
    { path: '/winners', view: createWinnerView },
  ];

  const matches: MatchesParameters[] = routes.map((route) => {
    return {
      route: route,
      isPage: location.pathname === route.path,
    };
  });

  let match = matches.find((page) => page.isPage);

  if (!match) {
    match = {
      route: routes[0],
      isPage: true,
    };
  }
  const view = match.route.view();
  document.body.replaceChildren(view);
}

export function navigator(url: string) {
  history.pushState(null, '', url);
  router();
}
