export type RaceState = 'initial' | 'preparing' | 'racing' | 'finished' | 'paused' | 'broken';

const transitions: Record<RaceState, RaceState[]> = {
  initial: ['preparing'],
  preparing: ['racing', 'broken'],
  racing: ['finished', 'broken', 'paused'],
  finished: ['initial'],
  paused: ['racing', 'broken', 'finished'],
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
    getSubscribers: () => subscribers,
    transitionRaceState: (newState: RaceState) => transitionRaceState(newState),
    subscribeToRaceState: (callback: (state: RaceState) => void) => subscribeToRaceState(callback),
  };
}

export const stateMachine = createRaceStateMachine();
