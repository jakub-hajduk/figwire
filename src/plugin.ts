import { API } from './shared/api';
import { createClient } from './shared/create-client';
import type { Callback, MethodPromises, Methods } from './shared/types';

const pluginPostFn = (message: any) => figma.ui.postMessage(message);

const pluginReceiveFn = (callback: Callback) =>
  figma.ui.on('message', callback);

export const pluginApiInstance = new API(
  'plugin',
  pluginPostFn,
  pluginReceiveFn,
);

export function defineApi<T extends Methods>(methods: T): T {
  for (const [name, method] of Object.entries(methods)) {
    pluginApiInstance.registerMethod(name, method);
  }

  return methods;
}

export function client<T extends Methods>(): MethodPromises<T> {
  return createClient<T>(pluginApiInstance);
}
