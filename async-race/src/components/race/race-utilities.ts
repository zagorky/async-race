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

  const racePromises = cars.map(async (car) => raceSingleCar(car));

  stateManager.transitionRaceState('racing');

  let winner: { id: number; time: number; name: string } | null = null;
  const results = await Promise.all(racePromises);
  for (const result of results) {
    if (result && (!winner || result.time < winner.time)) {
      winner = result;
    }
  }
  if (winner) {
    await processWinner(winner);
    stateManager.transitionRaceState('finished');
  } else {
    stateManager.transitionRaceState('finished');
    createModal('All cats are broken, there are no winners');
  }
}

async function raceSingleCar(
  car: GarageDataType,
): Promise<{ id: number; time: number; name: string } | null> {
  const element = findCarByID(car.id);
  if (!element) return null;

  try {
    const data = await createCarModel().startCar(car.id);
    const duration = calculateAnimationDuration(data.velocity, data.distance);
    animateCar(element, duration);

    const driveResult = await createCarModel().driveCar(car.id);
    if (!driveResult.success) {
      handleCarBreakdown(element);
      return null;
    }
    return { id: car.id, time: duration, name: car.name };
  } catch {
    handleCarBreakdown(element);
    return null;
  }
}

async function processWinner(winner: { id: number; time: number; name: string }) {
  const divider = 1000;
  const time = winner.time > 0 ? Number((winner.time / divider).toFixed(1)) : 0;

  createModal(`Winner: ${winner.name} (Time: ${time}s)`);

  try {
    const allWinners = await getWinners().then((data) => data.data);
    const existingWinner = allWinners.find((w) => w.id === winner.id);

    try {
      await (existingWinner
        ? updateWinner(winner.id, {
            id: winner.id,
            wins: (existingWinner.wins || 0) + 1,
            time: Math.min(existingWinner.time, time),
          })
        : setWinner({
            id: winner.id,
            wins: 1,
            time: time,
          }));
    } catch (error) {
      console.error('Failed to save winner data:', error);
    }
  } catch (error) {
    console.error('Failed to fetch winners list:', error);
  }
}

export function resetRace(cars: GarageDataType[]) {
  cars.forEach((car) => {
    const element = findCarByID(car.id);
    assertIsInstanceOf(HTMLElement, element);
    resetCarPosition(element);
  });
  stateManager.transitionRaceState('initial');
}

function findCarByID(id: number) {
  const element = buttonStore.car.get(id);
  assertIsInstanceOf(HTMLElement, element?.element);
  return element?.element;
}

// export function returnCar(id: number) {
//   const model = createCarModel();
//   const carElement = findCarByID(id);
//   model.returnCar(id).catch((error) => console.warn(`Car #${id}:`, error));
//   resetCarPosition(carElement);
// }

export function returnCar(id: number) {
  const carElement = findCarByID(id);
  resetCarPosition(carElement);
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
