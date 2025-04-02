import { path, requestConfig } from '~/api/new-api-handlers.ts';

export type EngineDataType = {
  velocity: number;
  distance: number;
};

export type EngineStatusType = 'started' | 'stopped' | 'drive';

export type EngineMode = Record<'success', boolean>;

export const startEngine = (id: number) =>
  fetch(`${path.engine}?id=${id}&status=started`, requestConfig.patch(null)).then((response) => {
    if (!response.ok) {
      throw new Error(`Engine start failed: ${response.status}`);
    }
    return response.json();
  });

export const stopEngine = (id: number) =>
  fetch(`${path.engine}?id=${id}&status=stopped`, requestConfig.patch(null)).then((response) => {
    if (!response.ok) {
      throw new Error(`Engine stop failed: ${response.status}`);
    }
  });

export const switchEngineMode = (id: number) =>
  fetch(`${path.engine}?id=${id}&status=drive`, requestConfig.patch(null)).then((response) => {
    if (!response.ok) {
      const brokenCarStatus = 500;
      if (response.status === brokenCarStatus) {
        throw new Error('Engine broken down!');
      }
      throw new Error(`Drive mode failed: ${response.status}`);
    }
    return response.json();
  });
