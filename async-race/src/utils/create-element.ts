import type { CreateElementProperties } from '~/utils/types/types.ts';

function createElement<T extends keyof HTMLElementTagNameMap>(
  properties: CreateElementProperties<T>,
): HTMLElementTagNameMap[T] {
  const { tag, cssClasses = [], attributes = {}, children = [] } = properties;

  const element = document.createElement(tag);

  element.classList.add(...cssClasses);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  if (children) {
    if (typeof children === 'string' || children instanceof Node) {
      element.append(children);
    } else if (Array.isArray(children)) {
      for (const childElement of children) {
        element.append(childElement);
      }
    }
  }

  return element;
}

export { createElement };
