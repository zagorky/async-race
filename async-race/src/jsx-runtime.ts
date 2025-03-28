import { Popik, VirtualElement } from './engine/popik.ts';

declare global {
  namespace JSX {
    type IntrinsicElements = Record<keyof HTMLElementTagNameMap, Record<string, any>>;
    type Element = VirtualElement | ((props: Record<string, unknown>) => VirtualElement);
  }
}

export const jsx = {
  component: Popik.createElement,
};
