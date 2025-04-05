import { assertIsNonNullable } from '@powwow-js/core';

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
  let previousState = '';
  const subscribers: ((state: RaceState) => void)[] = [];

  function transitionRaceState(newState: RaceState) {
    console.log('current:', stateMachine.getCurrentState());
    if (!transitions[currentState].includes(newState)) {
      console.warn(`invalid transition from ${currentState} to ${newState}`);
      return;
    }
    previousState = currentState;
    currentState = newState;
    console.log('newState:', stateMachine.getCurrentState());

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
    getPreviousState: () => previousState,
    getSubscribers: () => subscribers,
    transitionRaceState: (newState: RaceState) => transitionRaceState(newState),
    subscribeToRaceState: (callback: (state: RaceState) => void) => subscribeToRaceState(callback),
  };
}

export const stateMachine = createRaceStateMachine();

export function manageButtonsState(buttons: HTMLButtonElement[]) {
  const updateButtonsState = () => {
    const currentState = stateMachine.getCurrentState();

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
  stateMachine.subscribeToRaceState(updateButtonsState);
}

export const setButtonsState = (buttons: HTMLButtonElement[], disabled: boolean) => {
  buttons.forEach((button) => {
    assertIsNonNullable(button.textContent);
    button.disabled = button.textContent.includes('Return') ? !disabled : disabled;
  });
};
