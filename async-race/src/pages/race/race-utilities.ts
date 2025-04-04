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
  const model = createCarModel();
  const carElement = findCarByID(id);
  const animationState = carAnimations.get(carElement);
  assertIsNonNullable(animationState);
  animationState.isBroken = false;
  model
    .startCar(id)
    .then((data) => {
      const duration = calculateAnimationDuration(data.velocity, data.distance);
      animateCar(carElement, duration);

      return model.driveCar(id).then((result) => {
        if (!result.success) {
          handleCarBreakdown(carElement);
        }
        return { id, time: duration };
      });
    })
    .catch(() => {
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
        handleCarBreakdown(element);
        return null;
      }

      return { id: car.id, time: duration, name: car.name };
    } catch {
      const element = findCarByID(car.id);
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
  }
}

export function resetRace(cars: GarageDataType[]) {
  cars.forEach((car) => {
    const element = findCarByID(car.id);
    assertIsInstanceOf(HTMLElement, element);
    resetCarPosition(element);
  });
  stateMachine.transitionRaceState('initial');
}

function findCarByID(id: number) {
  const element = document.querySelector(`#svg-container-${id}`);
  assertIsInstanceOf(HTMLElement, element);
  return element;
}
