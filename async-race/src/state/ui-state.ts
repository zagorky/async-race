import type { RaceState } from '~/state/state-machine.ts';
import { stateMachine } from '~/state/state-machine.ts';

function createUIState() {
  let allControls: HTMLElement[] = [];
  let exemptControls: HTMLElement[] = [];

  function updateIUState(state: RaceState) {
    const isRaceInProgress = state === 'racing' || state === 'preparing';
    allControls.forEach((control: HTMLElement) => {
      if (exemptControls.includes(control)) {
        return;
      }
      if (isRaceInProgress) {
        control.dataset.previousState = control.getAttribute('disabled') || '';
        control.setAttribute('disabled', 'true');
      } else {
        if (control.dataset.previousState === '') {
          control.removeAttribute('disabled');
        } else {
          control.setAttribute('disabled', control.dataset.previousState || '');
        }
        delete control.dataset.previousState;
      }
    });
  }

  function initUIState(controls: HTMLElement[]) {
    allControls = controls;
    updateIUState(stateMachine.getCurrentState());
    stateMachine.subscribeToRaceState(updateIUState);
  }

  function markControl(controls: HTMLElement[]) {
    exemptControls = [...exemptControls, ...controls];
    controls.forEach((control: HTMLElement) => control.setAttribute('exempt', 'true'));
  }

  return {
    getAllControls: () => allControls,
    getExemptControls: () => exemptControls,
    updateIUState: (state: RaceState) => updateIUState(state),
    initUIState: (controls: HTMLElement[]) => initUIState(controls),
    markControl: (controls: HTMLElement[]) => markControl(controls),
  };
}

export const UIStateManager = createUIState();
