import { createElement } from '~/utils/create-element.ts';
import type { Children } from '~/utils/types/types.ts';

const H1 = (children: Children): HTMLHeadingElement =>
  createElement({
    tag: 'h1',
    cssClasses: ['text-2xl', 'font-bold', 'text-pink-600', 'p-3', 'text-center'],
    children,
  });

const H2 = (children: Children): HTMLHeadingElement =>
  createElement({
    tag: 'h1',
    cssClasses: ['text-xl', 'font-bold', 'text-pink-800', 'p-3', 'text-center'],
    children,
  });

const Main = (children: Children): HTMLElement =>
  createElement({
    tag: 'main',
    cssClasses: ['flex', 'flex-col', 'justify-center', 'items-center'],
    children,
  });

const Section = (children: Children): HTMLElement =>
  createElement({
    tag: 'section',
    cssClasses: ['flex', 'flex-col', 'justify-center', 'items-center'],
    children,
  });

const Div = (children: Children): HTMLDivElement =>
  createElement({
    tag: 'div',
    children,
    cssClasses: ['flex', 'flex-col', 'justify-center', 'items-center'],
  });

const Button = (children: Children): HTMLButtonElement => {
  return createElement({
    tag: 'button',
    cssClasses: [
      'w-114',
      'px-4',
      'py-2',
      'border',
      'border-gray-300',
      'bg-emerald-500',
      'text-white',
      'rounded-lg',
      'hover:bg-emerald-900',
      'm-2',
      'cursor-pointer',
    ],
    children,
  });
};

const Nav = (children: Children): HTMLElement =>
  createElement({
    tag: 'nav',
    children,
    cssClasses: ['flex', 'justify-center', 'items-center'],
  });

const Header = (children: Children): HTMLElement =>
  createElement({
    tag: 'header',
    children,
    cssClasses: ['flex', 'justify-center', 'items-center'],
  });

const Input = (children: Children, attributes?: Record<string, string>): HTMLInputElement =>
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

const Label = (children: Children, forLabel: string): HTMLLabelElement =>
  createElement({
    tag: 'label',
    children,
    attributes: { type: 'text', for: `${forLabel}` },
  });

const Link = (children: Children, url: string): HTMLAnchorElement =>
  createElement({
    tag: 'a',
    attributes: {
      'data-href': `${url}`,
      href: `${url}`,
    },
    cssClasses: ['w-full'],
    children,
  });

const Dialog = (children: Children): HTMLDialogElement =>
  createElement({
    tag: 'dialog',
    children,
  });

const AudioElement = (source: string): HTMLAudioElement =>
  createElement({ tag: 'audio', attributes: { preload: 'auto', src: source } });

const Ul = (children: Children): HTMLUListElement =>
  createElement({ tag: 'ul', children, cssClasses: ['flex', 'flex-col', 'items-end'] });

const Li = (children: Children): HTMLLIElement => createElement({ tag: 'li', children });

const Span = (children: Children): HTMLSpanElement => createElement({ tag: 'span', children });

const Form = (children: Children): HTMLFormElement =>
  createElement({
    tag: 'form',
    children,
    cssClasses: ['flex', 'items-center', 'justify-center', 'flex-col'],
  });

const TextArea = (children: Children, attributes?: Record<string, string>): HTMLTextAreaElement =>
  createElement({
    tag: 'textarea',
    children,
    cssClasses: ['bg-white', 'p-6', 'rounded-2xl', 'shadow-xl', 'font-mono'],
    attributes: { ...attributes },
  });

export {
  H1,
  H2,
  Main,
  Section,
  Header,
  Div,
  Nav,
  Button,
  Input,
  Label,
  Link,
  Dialog,
  AudioElement,
  Ul,
  Li,
  Span,
  Form,
  TextArea,
};
