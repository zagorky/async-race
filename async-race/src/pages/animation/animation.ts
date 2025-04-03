import { hasSome } from '@powwow-js/core';

export type AnimationState = {
  frameId: number | null;
  isBroken: boolean;
  currentPosition: number;
};

let animationFrameId: number | null = null;

export const carAnimations = new Map<HTMLElement, AnimationState>();

export function animateCar(carElement: HTMLElement, duration: number) {
  const animationState = carAnimations.get(carElement);

  if (hasSome(animationState)) {
    if (animationState.frameId) {
      cancelAnimationFrame(animationState.frameId);
    }

    const startTime = performance.now();
    const startPosition = animationState.currentPosition;
    const offset = 50;
    const distanceToMove = window.innerWidth - carElement.offsetWidth - startPosition - offset;

    const animate = (currentTime: number) => {
      if (animationState.isBroken) return;

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const currentX = startPosition + progress * distanceToMove;
      carElement.style.transform = `translateX(${currentX}px)`;
      animationState.currentPosition = currentX;

      if (progress < 1) {
        animationState.frameId = requestAnimationFrame(animate);
      }
    };

    animationState.frameId = requestAnimationFrame(animate);
  }
}

export function stopCar(carElement: HTMLElement) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  carElement.style.transform = 'translateX(0)';
  carElement.style.border = '3px solid red';
}

export function calculateAnimationDuration(velocity: number, distance: number) {
  return distance / velocity;
}

export function handleCarBreakdown(carElement: HTMLElement) {
  const animationState = carAnimations.get(carElement);
  if (hasSome(animationState)) {
    animationState.isBroken = true;

    if (animationState.frameId) {
      cancelAnimationFrame(animationState.frameId);
      animationState.frameId = null;
    }

    carElement.style.border = '3px solid red';
  }
}

export function resetCarPosition(carElement: HTMLElement) {
  const animationState = carAnimations.get(carElement);
  if (hasSome(animationState)) {
    animationState.isBroken = false;
    animationState.currentPosition = 0;

    if (animationState.frameId) {
      cancelAnimationFrame(animationState.frameId);
      animationState.frameId = null;
    }

    carElement.style.transform = 'translateX(0)';
    carElement.style.border = '';
  }
}
