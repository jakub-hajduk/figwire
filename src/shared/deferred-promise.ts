/**
 * from: https://github.com/fwextensions/figma-await-ipc/blob/main/src/DeferredPromise.ts
 */

export class DeferredPromise<T> implements Promise<T> {
  readonly [Symbol.toStringTag]: string = 'Promise';
  private _promise: Promise<T>;

  resolve: (value: PromiseLike<T> | T) => void = () => void 0;

  reject: (reason?: any) => void = () => void 0;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  // biome-ignore lint/suspicious/noThenProperty: this class overwrites Promise.
  then<R = T, E = never>(
    onFulfilled?: (value: T) => PromiseLike<R> | R,
    onRejected?: (reason: any) => PromiseLike<E> | E,
  ) {
    return this._promise.then(onFulfilled, onRejected);
  }

  catch<R = never>(onRejected: (reason: any) => PromiseLike<R> | R) {
    return this._promise.catch(onRejected);
  }

  finally(onFinally?: (() => void) | undefined | null) {
    return this._promise.finally(onFinally);
  }
}
