export type MsgType = string;

export type Method = (...args: any[]) => any;

export interface Methods {
  [k: string]: Method;
}

export type Message = RequestMessage | ResponseMessage | ErrorMessage;

export type Callback = (message: any) => any;

export interface RequestMessage<A = any[]> {
  type: 'request';
  name: string;
  args: A;
}

export interface ResponseMessage<R = void> {
  type: 'response';
  name: string;
  return?: R;
}

export interface ErrorMessage {
  type: 'error';
  name: string;
  message: string;
}

export interface APIOptions {
  silentError: boolean;
}

export const isRequestMessage = (message: Message): message is RequestMessage =>
  message.type === 'request';

export const isResponseMessage = (
  message: Message,
): message is ResponseMessage => message.type === 'response';

export const isErrorMessage = (message: Message): message is ErrorMessage =>
  message.type === 'error';

export type MethodPromises<T extends Record<string, (...args: any[]) => any>> =
  {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R
      ? (...args: A) => Promise<Awaited<R>>
      : never;
  };
