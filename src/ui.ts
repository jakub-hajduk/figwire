import { API } from './shared/api';
import { createClient } from './shared/create-client';
import type { Callback, MethodPromises, Methods } from './shared/types';

const uiPostFn = (message: any) =>
  window.parent.postMessage({ pluginMessage: message }, '*');

const uiReceiveFn = (callback: Callback) => {
  window.addEventListener('message', (message) => {
    callback(message.data.pluginMessage);
  });
};

export const uiApiInstance = new API('ui', uiPostFn, uiReceiveFn);

export function defineApi<T extends Methods>(methods: T): T {
  for (const [name, method] of Object.entries(methods)) {
    uiApiInstance.registerMethod(name, method);
  }

  return methods;
}

export function client<
  T extends Methods,
  P extends keyof T = string,
>(): MethodPromises<T> {
  return createClient<T, P>(uiApiInstance);
}
