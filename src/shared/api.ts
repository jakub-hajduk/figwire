import { DeferredPromise } from './deferred-promise';
import { hash } from './hash';
import { isRequestMessage, isResponseMessage } from './types';

import type { Message, Method, RequestMessage, ResponseMessage } from './types';

export class API {
  private requestQueue = new Map<string, DeferredPromise<any>>();
  private callbacks = new Map<string, Method>();
  hasher = hash();

  constructor(
    private postFn: (message: Message) => void,
    private receiveFn: (callback: (message: Message) => void) => void,
  ) {
    this.receiveFn(async (message: Message) => {
      if (isRequestMessage(message)) {
        const methodName = message.name.split('-')[0];
        const method = this.callbacks.get(methodName);
        if (!method) return;
        const result = await Promise.resolve(method(...message.args));
        this.postFn({
          type: 'response',
          name: message.name,
          return: result,
        } as ResponseMessage);
      }

      if (isResponseMessage(message)) {
        const promise = this.requestQueue.get(message.name);
        if (!promise) return;
        promise.resolve(message.return);
        this.requestQueue.delete(message.name);
      }
    });
  }

  async request(name: string, args?: any[]) {
    const hash = this.hasher.create();
    const requestName = `${name}-${hash}`;
    const promise = new DeferredPromise();

    this.requestQueue.set(requestName, promise);

    this.postFn({
      type: 'request',
      name: requestName,
      args: args || [],
    } as RequestMessage);

    return promise;
  }

  registerMethod(name: string, callback: Method) {
    this.callbacks.set(name, callback);
  }
}
