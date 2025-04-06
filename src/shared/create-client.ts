import type { API } from './api';
import type { MethodPromises, Methods } from './types';

export function createClient<T extends Methods>(api: API): MethodPromises<T> {
  return new Proxy({} as MethodPromises<T>, {
    get(_, prop: string | symbol) {
      return async (...args: unknown[]) => api.request(prop as string, args);
    },
  });
}
