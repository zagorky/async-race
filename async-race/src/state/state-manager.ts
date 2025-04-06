export type RaceState = 'initial' | 'preparing' | 'racing' | 'finished' | 'broken';

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
      case 'initial':
      default: {
        buttons.forEach((button) => {
          button.disabled = isReturnOrReset(button);
        });
        break;
      }

      case 'preparing':
      case 'racing': {
        buttons.forEach((button) => {
          button.disabled = true;
        });
        break;
      }

      case 'broken':
      case 'finished': {
        buttons.forEach((button) => {
          button.disabled = !isReturnOrReset(button);
        });
        break;
      }
    }
  };

  updateButtonsState();
  stateManager.subscribeToRaceState(updateButtonsState);
}

const isReturnOrReset = (button: HTMLButtonElement) =>
  ['Return', 'Reset'].some((text) => button.textContent?.includes(text));

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
