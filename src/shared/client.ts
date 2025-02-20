import type { API } from './api';
import type { MethodPromises, Methods } from './types';

export function client<T extends Methods, P extends keyof T = keyof T>(
  api: API,
): MethodPromises<T> {
  return new Proxy({} as T, {
    get(target: T, prop: string | symbol) {
      if (!(prop in target)) {
        Object.defineProperty(target, prop, {
          value: (...args: Parameters<T[P]>) =>
            api.request(prop as string, args),
        });
      }
      return target[prop as P];
    },
  });
}
