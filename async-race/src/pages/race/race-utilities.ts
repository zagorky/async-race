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
import { stateMachine } from '~/state/state-machine.ts';

export function startCar(id: number) {
  stateMachine.transitionRaceState('preparing');
  const model = createCarModel();
  const carElement = findCarByID(id);
  const animationState = carAnimations.get(carElement);
  assertIsNonNullable(animationState);
  animationState.isBroken = false;

  model
    .startCar(id)
    .then((data) => {
      stateMachine.transitionRaceState('racing');
      const duration = calculateAnimationDuration(data.velocity, data.distance);
      animateCar(carElement, duration);

      return model.driveCar(id).then((result) => {
        if (!result.success) {
          stateMachine.transitionRaceState('broken');
          handleCarBreakdown(carElement);
        }
        stateMachine.transitionRaceState('finished');
        return { id, time: duration };
      });
    })
    .catch(() => {
      stateMachine.transitionRaceState('broken');
      handleCarBreakdown(carElement);
      return null;
    });
}

export async function startRace(cars: GarageDataType[]) {
  stateMachine.transitionRaceState('preparing');

  const model = createCarModel();

  const racePromises = cars.map(async (car) => {
    const element = findCarByID(car.id);

    try {
      const data = await model.startCar(car.id);
      const duration = calculateAnimationDuration(data.velocity, data.distance);
      animateCar(element, duration);

      const driveResult = await model.driveCar(car.id);
      if (!driveResult.success) {
        stateMachine.transitionRaceState('broken');
        handleCarBreakdown(element);
        return null;
      }
      stateMachine.transitionRaceState('finished');
      return { id: car.id, time: duration, name: car.name };
    } catch {
      const element = findCarByID(car.id);
      stateMachine.transitionRaceState('broken');

      if (element) handleCarBreakdown(element);
      return null;
    }
  });

  stateMachine.transitionRaceState('racing');

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
    stateMachine.transitionRaceState('finished');
    createModal(`Winner: ${winner.name} (Time: ${time}s)`);
    try {
      const winnerData = { id: winner.id, wins: 1, time: time };
      console.log(winnerData);
      await setWinner(winnerData);
    } catch (error) {
      console.warn('Failed to save winner:', error);
    }
  } else {
    stateMachine.transitionRaceState('broken');
    createModal('All cats are broken, there are no winners');
  }
}

export function resetRace(cars: GarageDataType[]) {
  cars.forEach((car) => {
    const element = findCarByID(car.id);
    assertIsInstanceOf(HTMLElement, element);
    returnCar(car.id);
  });
  stateMachine.transitionRaceState('initial');
}

function findCarByID(id: number) {
  const element = document.querySelector(`#svg-container-${id}`);
  assertIsInstanceOf(HTMLElement, element);
  return element;
}

export function returnCar(id: number) {
  const model = createCarModel();
  const carElement = findCarByID(id);
  model
    .returnCar(id)
    .catch((error) => console.warn(`Ошибка при остановке двигателя машины с ID ${id}:`, error));
  resetCarPosition(carElement);
  stateMachine.transitionRaceState('initial');
}
