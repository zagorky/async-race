export type CreateElementProperties<T extends keyof HTMLElementTagNameMap> = {
  tag: T;
  cssClasses?: string[];
  attributes?: Record<string, string>;
  children?: Children;
};

export type Children = string | HTMLElement | string[] | HTMLElement[];

export type ModalProperties = {
  children: Children;
  onClose?: () => void;
};
