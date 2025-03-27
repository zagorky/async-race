import { getData, path } from '~/api/api-handlers.ts';

// type EngineDataType = {
//   velocity: number;
//   distance: number;
// };

// type EngineStatusType = 'started' | 'stopped' | 'drive';

// type EngineMode = Record<'success', boolean>;

// const startEngine = async () => {};
//
// const stopEngine = async () => {};
//
// const switchEngineMode = async () => {};

console.log(await getData<unknown>(`${path.engine}?id=1&status=drive`));
