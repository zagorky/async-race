import { createElement } from '~/utils/create-element.ts';
import type { Children } from '~/utils/types/types.ts';

export const H1 = (children: Children): HTMLHeadingElement =>
  createElement({
    tag: 'h1',
    cssClasses: ['text-2xl', 'font-bold', 'text-pink-600', 'p-3', 'text-center'],
    children,
  });

export const H2 = (children: Children): HTMLHeadingElement =>
  createElement({
    tag: 'h1',
    cssClasses: ['text-xl', 'font-bold', 'text-pink-800', 'p-3', 'text-center'],
    children,
  });

export const Section = (children: Children): HTMLElement =>
  createElement({
    tag: 'section',
    cssClasses: ['flex', 'flex-col', 'justify-center', 'items-center'],
    children,
  });

export const Div = (children: Children, attributes?: Record<string, string>): HTMLDivElement =>
  createElement({
    tag: 'div',
    children,
    attributes: attributes,
    cssClasses: ['flex', 'flex-col', 'justify-center', 'items-center'],
  });

export const Button = (
  children: Children,
  attributes?: Record<string, string>,
): HTMLButtonElement => {
  return createElement({
    tag: 'button',
    cssClasses: [
      'min-w-17',
      'size-max',
      'px-1',
      'py-1',
      'border',
      'border-gray-300',
      'bg-emerald-500',
      'text-white',
      'rounded-lg',
      'hover:bg-emerald-900',
      'm-2',
      'cursor-pointer',
      'disabled:bg-rose-300',
      'disabled:opacity-60',
      'disabled:pointer-events-none',
    ],
    attributes: attributes,
    children,
  });
};

export const Nav = (children: Children): HTMLElement =>
  createElement({
    tag: 'nav',
    children,
    cssClasses: ['flex', 'justify-center', 'items-center', 'w-full'],
  });

export const Header = (children: Children): HTMLElement =>
  createElement({
    tag: 'header',
    children,
    cssClasses: ['flex', 'items-center'],
  });

export const Input = (children: Children, attributes?: Record<string, string>): HTMLInputElement =>
  createElement({
    tag: 'input',
    children,
    cssClasses: [
      'px-4',
      'py-2',
      'm-1',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-pink-500',
      'focus:border-pink-500',
      'transition',
      'duration-200',
    ],
    attributes: attributes,
  });

export const Label = (children: Children, forLabel: string): HTMLLabelElement =>
  createElement({
    tag: 'label',
    children,
    attributes: { type: 'text', for: `${forLabel}` },
  });

export const Link = (children: Children, url: string): HTMLAnchorElement =>
  createElement({
    tag: 'a',
    attributes: {
      'data-href': `${url}`,
      href: `${url}`,
    },
    cssClasses: ['hover:text-pink-500', 'hover:underline', 'p-1', 'm-2'],
    children,
  });

export const Dialog = (children: Children): HTMLDialogElement =>
  createElement({
    tag: 'dialog',
    children,
  });

export const Span = (children: Children): HTMLSpanElement =>
  createElement({ tag: 'span', children, cssClasses: ['capitalize'] });

export const TableHeader = (
  children: Children,
  attributes?: Record<string, string>,
): HTMLTableSectionElement => createElement({ tag: 'thead', children, attributes });

export const TableBody = (
  children: Children,
  attributes?: Record<string, string>,
): HTMLTableSectionElement => createElement({ tag: 'tbody', children, attributes });

export const Row = (children: Children, attributes?: Record<string, string>): HTMLTableRowElement =>
  createElement({ tag: 'tr', children, attributes });

export const Cell = (
  children: Children,
  attributes?: Record<string, string>,
): HTMLTableCellElement =>
  createElement({
    tag: 'th',
    children,
    attributes,
    cssClasses: [
      'p-1',
      'm-1',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'hover:outline-none',
      'hover:ring-2',
      'hover:ring-pink-500',
      'hover:border-pink-500',
    ],
  });
