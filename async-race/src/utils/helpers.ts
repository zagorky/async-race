// import { Maybe } from '~/utils/maybe.ts';
//
// export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
//
// export type WithOptional<T, K extends keyof T> = Omit<T, K> & {
//   [P in K]?: T[P];
// };
//
// export type Nil = null | undefined;
//
// export type Nullable<T> = T | Nil;
//
// export type ConstructorOf<T> = {
//   prototype: T;
//   new (...arguments_: never[]): T;
// };
//
// export function assertIsNonNullable<T>(
//   value: unknown,
//   ...infos: unknown[]
// ): asserts value is NonNullable<T> {
//   if (value === undefined || value === null) {
//     throw new Error(`NULLISH_ASSERTION_ERROR"${String(value)}"; ${infos?.join(' ')}`);
//   }
// }
//
// export function isInstanceOf<T>(elementType: ConstructorOf<T>, value: unknown): value is T {
//   return value instanceof elementType;
// }
//
// export function assertIsInstanceOf<T>(
//   elementType: ConstructorOf<T>,
//   value: unknown,
//   ...infos: string[]
// ): asserts value is T {
//   assertIsNonNullable(value, `#${String(elementType)}`);
//   if (!(value instanceof elementType)) {
//     throw new TypeError(
//       `Not expected value: ${JSON.stringify(value)} of type: "${String(elementType)}"; ${infos?.join(' ')}'`,
//     );
//   }
// }
//
// export function maybeInstanceOf<T>(elementType: ConstructorOf<T>) {
//   return function (value: unknown): Maybe<T> {
//     if (isInstanceOf(elementType, value)) {
//       return Maybe.of(value);
//     }
//     return Maybe.none();
//   };
// }
//
// export function isNil<T>(value: Nullable<T>): value is Nil {
//   return value === null || value === undefined;
// }
//
// export function hasSome<T>(value: unknown): value is NonNullable<T> {
//   return value !== null && value !== undefined;
// }
// export const preventDefault = (event: Event): Event => (event.preventDefault(), event);
//
// export const getEventTarget = (event: Event): EventTarget | null => event.target;
//
// export const getClosestByDataAttribute =
//   (attributeName: string) =>
//   (target: Element): Element | null =>
//     target.closest(`[data-${attributeName}]`);
//
// export const getDataAttributeValue =
//   (attributeName: string) =>
//   (actionElement: HTMLElement): Nullable<string> =>
//     actionElement.dataset[attributeName];
//
// export function noop(): void {
//   // intentionsl
// }
// export function replaceCssClass(
//   element: unknown,
//   cssClass: string | string[],
//   newCssClass: string | string[],
// ): void {
//   if (element instanceof HTMLElement) {
//     element.classList.add(...newCssClass);
//     element.classList.remove(...cssClass);
//   }
// }
//
// export function isActionKey<T extends string>(
//   value: unknown,
//   object: Record<T, () => void>,
// ): value is T {
//   return typeof value === 'string' && value in object;
// }
//
// function hasKey<T extends Record<string | number | symbol, unknown>>(
//   object: T,
//   key: unknown,
// ): key is keyof T {
//   return (
//     (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') && key in object
//   );
// }
//
// export const maybeKeyOf =
//   <T extends Record<string | number | symbol, unknown>>(object: T) =>
//   (key: unknown): Maybe<keyof T> =>
//     hasKey(object, key) ? Maybe.of(key) : Maybe.none();
console.log('');
