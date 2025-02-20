import { API } from './shared/api';
import { client } from './shared/client';
import type { Callback, MethodPromises, Methods } from './shared/types';

const pluginPostFn = (message: any) => figma.ui.postMessage(message);

const pluginReceiveFn = (callback: Callback) =>
  figma.ui.on('message', callback);

export const pluginApiInstance = new API(pluginPostFn, pluginReceiveFn);

export function pluginApi<T extends Methods>(methods: T): T {
  for (const [name, method] of Object.entries(methods)) {
    pluginApiInstance.registerMethod(name, method);
  }

  return methods;
}

export function uiApiClient<
  T extends Methods,
  P extends keyof T = string,
>(): MethodPromises<T> {
  return client<T, P>(pluginApiInstance);
}
