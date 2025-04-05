export type RaceState = 'initial' | 'preparing' | 'racing' | 'finished' | 'broken';

const transitions: Record<RaceState, RaceState[]> = {
  initial: ['preparing'],
  preparing: ['racing', 'broken'],
  racing: ['finished', 'broken'],
  finished: ['initial'],
  broken: ['initial'],
};

function createRaceStateMachine() {
  let currentState: RaceState = 'initial';
  const subscribers: ((state: RaceState) => void)[] = [];

  function transitionRaceState(newState: RaceState) {
    if (!transitions[currentState].includes(newState)) {
      console.warn(`invalid transition from ${currentState} to ${newState}`);
      return;
    }
    currentState = newState;
    subscribers.forEach((callback) => callback(newState));
  }

  function subscribeToRaceState(callback: (state: RaceState) => void) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  }

  return {
    getCurrentState: () => currentState,
    transitionRaceState: (newState: RaceState) => transitionRaceState(newState),
    subscribeToRaceState: (callback: (state: RaceState) => void) => subscribeToRaceState(callback),
  };
}

export const stateManager = createRaceStateMachine();

export function manageButtonsState(buttons: HTMLButtonElement[]) {
  const updateButtonsState = () => {
    const currentState = stateManager.getCurrentState();

    switch (currentState) {
      case 'initial': {
        buttons.forEach((button) => {
          button.disabled = ['Return', 'Reset'].some((text) => button.textContent?.includes(text));
        });

        break;
      }
      case 'preparing': {
        buttons.forEach((button) => {
          button.disabled = true;
        });
        break;
      }
      case 'racing': {
        buttons.forEach((button) => {
          button.disabled = true;
        });
        break;
      }
      case 'broken': {
        // buttons.forEach((button) => {
        //   button.disabled = !button.textContent?.includes('Reset');
        // });
        buttons.forEach((button) => {
          button.disabled = !['Return', 'Reset'].some((text) => button.textContent?.includes(text));
        });
        break;
      }
      case 'finished': {
        // buttons.forEach((button) => {
        //   button.disabled = !button.textContent?.includes('Reset');
        // });
        buttons.forEach((button) => {
          button.disabled = !['Return', 'Reset'].some((text) => button.textContent?.includes(text));
        });
        break;
      }
      default: {
        buttons.forEach((button) => {
          button.disabled = ['Return', 'Reset'].some((text) => button.textContent?.includes(text));
        });

        break;
      }
    }
  };

  updateButtonsState();
  stateManager.subscribeToRaceState(updateButtonsState);
}

type ButtonStoreApp = {
  garage: HTMLButtonElement[];
  header: HTMLButtonElement[];
  car: Map<number, { buttons: HTMLButtonElement[]; element: HTMLElement }>;
};

export const buttonStore: ButtonStoreApp = {
  garage: [],
  header: [],
  car: new Map(),
};

export function registerButtons(
  type: 'garage' | 'header' | 'car',
  buttons: HTMLButtonElement[],
  carId?: number,
  svg?: HTMLElement,
) {
  if (type === 'car') {
    if (carId !== undefined && svg !== undefined) {
      buttonStore.car.set(carId, {
        element: svg,
        buttons,
      });
      manageButtonsState(buttons);
    }
  } else {
    buttonStore[type] = buttons;
    manageButtonsState(buttons);
  }
}
