// import type { EventEmitterType, StoreEvents } from '~/types';
//
// function createEventEmitter(): EventEmitterType {
//   const eventMap = new Map<keyof StoreEvents, ((data: StoreEvents[keyof StoreEvents]) => void)[]>();
//
//   return {
//     on: (event, callback): void => {
//       const handlers = eventMap.get(event) || [];
//
//       handlers.push(callback);
//       eventMap.set(event, handlers);
//     },
//
//     off: (event, callback): void => {
//       const handlers = eventMap.get(event)?.filter((handler) => handler !== callback);
//
//       if (handlers) {
//         eventMap.set(event, handlers);
//       }
//     },
//
//     emit: (event, data): void => {
//       const handlers = eventMap.get(event);
//
//       if (handlers) {
//         handlers.forEach((handler) => handler(data));
//       }
//     },
//   };
// }
//
// export { createEventEmitter };
console.log('');
