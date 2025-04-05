import { createCarModel } from '~/pages/car/car-model.ts';
import {
  animateCar,
  calculateAnimationDuration,
  carAnimations,
  handleCarBreakdown,
  resetCarPosition,
} from '~/pages/animation/animation.ts';
import { assertIsInstanceOf, assertIsNonNullable } from '@powwow-js/core';
import { createModal } from '~/pages/modals.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { setWinner } from '~/api/winners-api.ts';
import { buttonStore, stateManager } from '~/state/state-manager.ts';

export function startCar(id: number) {
  stateManager.transitionRaceState('preparing');
  const model = createCarModel();
  const carElement = findCarByID(id);
  const animationState = carAnimations.get(carElement);
  assertIsNonNullable(animationState);
  animationState.isBroken = false;

  model
    .startCar(id)
    .then((data) => {
      stateManager.transitionRaceState('racing');
      const duration = calculateAnimationDuration(data.velocity, data.distance);
      animateCar(carElement, duration);

      return model.driveCar(id).then((result) => {
        if (!result.success) {
          handleCarBreakdown(carElement);
        }
        stateManager.transitionRaceState('finished');
        return { id, time: duration };
      });
    })
    .catch(() => {
      handleCarBreakdown(carElement);
      return null;
    });
}

export async function startRace(cars: GarageDataType[]) {
  if (stateManager.getCurrentState() !== 'initial') return;

  stateManager.transitionRaceState('preparing');

  const model = createCarModel();

  const racePromises = cars.map(async (car) => {
    const element = findCarByID(car.id);

    try {
      const data = await model.startCar(car.id);
      const duration = calculateAnimationDuration(data.velocity, data.distance);
      animateCar(element, duration);

      const driveResult = await model.driveCar(car.id);
      if (!driveResult.success) {
        handleCarBreakdown(element);
        return null;
      }
      // createModal(`Winner: ${winner.name} (Time: ${time}s)`);
      stateManager.transitionRaceState('finished');
      return { id: car.id, time: duration, name: car.name };
    } catch {
      const element = findCarByID(car.id);

      if (element) handleCarBreakdown(element);
      return null;
    }
  });

  stateManager.transitionRaceState('racing');

  let winner: { id: number; time: number; name: string } | null = null;
  const results = await Promise.all(racePromises);
  for (const result of results) {
    if (result && (!winner || result.time < winner.time)) {
      winner = result;
    }
  }
  if (winner) {
    const divider = 1000;
    const time = Number((winner.time / divider).toFixed(1));
    stateManager.transitionRaceState('finished');
    createModal(`Winner: ${winner.name} (Time: ${time}s)`);
    try {
      const winnerData = { id: winner.id, wins: 1, time: time };
      console.log(winnerData);
      await setWinner(winnerData);
    } catch (error) {
      console.warn('Failed to save winner:', error);
    }
  } else {
    stateManager.transitionRaceState('finished');
    createModal('All cats are broken, there are no winners');
  }
}

export function resetRace(cars: GarageDataType[]) {
  cars.forEach((car) => {
    const element = findCarByID(car.id);
    assertIsInstanceOf(HTMLElement, element);
    returnCar(car.id);
  });
  stateManager.transitionRaceState('initial');
}

function findCarByID(id: number) {
  const element = buttonStore.car.get(id);
  assertIsInstanceOf(HTMLElement, element?.element);
  return element?.element;
}

export function returnCar(id: number) {
  const model = createCarModel();
  const carElement = findCarByID(id);
  model.returnCar(id).catch((error) => console.warn(`Car #${id}:`, error));
  resetCarPosition(carElement);
  stateManager.transitionRaceState('initial');
}
