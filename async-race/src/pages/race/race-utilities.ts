import { createCarModel } from '~/pages/car/car-model.ts';
import {
  animateCar,
  calculateAnimationDuration,
  carAnimations,
  handleCarBreakdown,
} from '~/pages/animation/animation.ts';
import { hasSome } from '@powwow-js/core';

export function startCar(id: number, model = createCarModel(), carElement: HTMLElement) {
  const animationState = carAnimations.get(carElement);
  if (hasSome(animationState)) {
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
        });
      })
      .catch(() => handleCarBreakdown(carElement));
  }
}
