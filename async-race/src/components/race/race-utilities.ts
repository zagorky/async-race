import { type CarModelType, createCarModel } from '~/components/car/car-model.ts';
import {
  animateCar,
  calculateAnimationDuration,
  carAnimations,
  handleCarBreakdown,
  resetCarPosition,
} from '~/components/animation/animation.ts';
import { assertIsInstanceOf, assertIsNonNullable } from '@powwow-js/core';
import { createModal, createUpdateCarModal } from '~/components/modals/modals.ts';
import type { GarageDataType } from '~/api/garage-api.ts';
import { getWinners, setWinner, updateWinner } from '~/api/winners-api.ts';
import { buttonStore, stateManager } from '~/state/state-manager.ts';
import { createCarController } from '~/components/car/car-controller.ts';

export function startCar(id: number, isSingleCar = false) {
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
          if (isSingleCar) {
            stateManager.transitionRaceState('finished');
          }
        }
        stateManager.transitionRaceState('finished');
        return { id, time: duration };
      });
    })
    .catch(() => {
      handleCarBreakdown(carElement);
      if (isSingleCar) {
        stateManager.transitionRaceState('finished');
      }
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
        if (stateManager.getCurrentState() === 'racing') {
          stateManager.transitionRaceState('finished');
        }
        return null;
      }
      return { id: car.id, time: duration, name: car.name };
    } catch {
      const element = findCarByID(car.id);
      handleCarBreakdown(element);
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
    const time = winner.time && winner.time > 0 ? Number((winner.time / divider).toFixed(1)) : 0;
    stateManager.transitionRaceState('finished');
    createModal(`Winner: ${winner.name} (Time: ${time}s)`);
    try {
      const allWinners = await getWinners().then((data) => data.data);
      const existingWinner = allWinners.find((w) => w.id === winner.id);

      if (existingWinner) {
        const updatedWinnerData = {
          id: winner.id,
          wins: (existingWinner.wins || 0) + 1,
          time: time,
        };

        await updateWinner(winner.id, updatedWinnerData);
      } else {
        const newWinnerData = {
          id: winner.id,
          wins: 1,
          time: time,
        };

        await setWinner(newWinnerData);
      }
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

export function deleteCar(id: number, container: HTMLElement) {
  const model = createCarModel();
  model
    .removeCar(id)
    .then(() => {
      container.remove();
      document.body.dispatchEvent(new CustomEvent('delete-car'));
    })
    .catch((error: Error) => createModal(`Error deleting car ${error.message}`));
}

export function updateCar(carData: GarageDataType, model: CarModelType, container: HTMLElement) {
  const modal = createUpdateCarModal(carData, (updatedData) => {
    return model
      .updateCar(updatedData)
      .then((data) => {
        const updatedCar = createCarController(data);
        container.replaceWith(updatedCar);
      })
      .catch((error: Error) => createModal(`Error in update ${error.message}`));
  });

  document.body.append(modal);
  modal.showModal();
}
