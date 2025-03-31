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
        const module = await import('../src/pages/garage/garage-controller.ts');
        return module.createGarageController();
      },
    },
    {
      path: '/winners',
      view: async (): Promise<HTMLElement> => {
        const module = await import('../src/pages/winners/winners-controller.ts');
        return module.createWinnersController();
      },
    },
  ],
};

const routerRoot = document.createElement('div');
document.body.append(routerRoot);

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
        const module = await import('../src/pages/error/error.ts');
        return module.createErrorView();
      },
    };
  }

  const view = await match.view(signal);
  if (!signal.aborted) {
    routerRoot.replaceChildren(view);
  }
}

export function navigator(url: string) {
  history.pushState(null, '', url);
  router().catch((error) => {
    console.error('router error in navigator:', error);
  });
}
