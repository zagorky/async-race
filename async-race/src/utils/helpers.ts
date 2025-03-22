export function replaceCssClass(
  element: unknown,
  cssClass: string | string[],
  newCssClass: string | string[],
): void {
  if (element instanceof HTMLElement) {
    element.classList.add(...newCssClass);
    element.classList.remove(...cssClass);
  }
}
