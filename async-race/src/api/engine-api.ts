import { fetchAndValidateData, path, requestConfig } from '~/api/new-api-handlers.ts';

export type EngineDataType = {
  velocity: number;
  distance: number;
};

export type EngineStatusType = 'started' | 'stopped' | 'drive';

export type EngineMode = Record<'success', boolean>;

const isEngineData = (data: unknown): data is EngineDataType => {
  return typeof data === 'object' && data !== null && 'velocity' in data && 'distance' in data;
};

const isEngineMode = (data: unknown): data is EngineMode => {
  return typeof data === 'object' && data !== null && 'success' in data;
};

export const startEngine = (id: number) =>
  fetchAndValidateData(isEngineData)(
    `${path.engine}?id=${id}&status=started`,
    requestConfig.patch({}),
  );

export const switchEngineMode = (id: number) =>
  fetchAndValidateData(isEngineMode)(
    `${path.engine}?id=${id}&status=drive`,
    requestConfig.patch({}),
  );

export const stopEngine = (id: number) =>
  fetch(`${path.engine}?id=${id}&status=stopped`, requestConfig.patch(null)).then((response) => {
    if (!response.ok) {
      throw new Error(`Engine stop failed: ${response.status}`);
    }
  });
