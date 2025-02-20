# Figwire

Figwire is a lightweight, TypeScript-friendly library for seamless communication between Figma plugins and their UI.

Inspired by [Hono's RPC](https://hono.dev/docs/guides/rpc) and [figma-await-ipc](https://github.com/fwextensions/figma-await-ipc), Figwire provides a structured way to define APIs for both plugin and UI sides while maintaining strong type safety.

## TLDR;

> Figwire keeps Figma plugin communication **simple, type-safe, and predictable**.
> - Define methods using `defineApi`.
> - Call them from the other side using `client<T>`.
> - Import from `figwire/plugin` in plugin code and `figwire/ui` in ui code.
> - Ensure TypeScript knows about available methods via type exports.

## Usage

### General idea

Figwire revolves around two core elements:

- **`defineApi`** – Defines methods executed on the plugin (or UI) side.
- **`client`** – A client to call those methods from the opposite side.

The key rule is simple:
- In **UI code**, import from `figwire/ui`.
- In **plugin code**, import from `figwire/plugin`.

Example:

```typescript
// plugin.ts
import { defineApi, client } from 'figwire/plugin';
```

```typescript
// ui.ts
import { defineApi, client } from 'figwire/ui';
```

### Typings

The `client` is **not inherently aware** of the API methods (`defineApi`).

To enable TypeScript to recognize available methods, we **explicitly define and export types** from the plugin (or UI) side.

#### Step 1: Define and export API type in the plugin
```typescript
// plugin.ts
const pluginApi = defineApi({
  greet: (name: string) => `Hello ${name}!`
});

export type PluginAPI = typeof pluginApi;
```

#### Step 2: Import and use the API type in the UI
```typescript
// ui.ts
import type { PluginAPI } from '../plugin/plugin';
import { client } from 'figwire/ui';

const pluginApiClient = client<PluginAPI>();
```

This pattern works **both ways**, so UI can also define an API that the plugin can call.

## Examples

### Requesting plugin methods from UI

#### Plugin side
```typescript
import { defineApi } from 'figwire/plugin';

const pluginApi = defineApi({
  greet: (name: string) => `Hello ${name}!`
});

export type PluginAPI = typeof pluginApi;
```

#### UI side
```typescript
import { client } from 'figwire/ui';
import type { PluginAPI } from './plugin';

(async () => {
  const pluginApiClient = client<PluginAPI>();
  const greeting = await pluginApiClient.greet('Johnny Jeep');

  console.log(greeting); // "Hello Johnny Jeep!"
})();
```

### Requesting UI methods from plugin

#### UI side
```typescript
import { defineApi } from 'figwire/ui';

const uiApi = defineApi({
  getInputValue: () => (document.getElementById('username') as HTMLInputElement).value
});

export type UIAPI = typeof uiApi;
```

#### Plugin side
```typescript
import { client } from 'figwire/plugin';
import type { UIAPI } from './ui';

(async () => {
  const uiApiClient = client<UIAPI>();
  const username = await uiApiClient.getInputValue();

  console.log(username);
})();
```

### Full example: bidirectional communication

#### Plugin side
```typescript
import { defineApi, client } from 'figwire/plugin';
import type { UIAPI } from './ui';

const pluginApi = defineApi({
  cloneNode: (copies: number) => {
    // Clone a node in Figma
    return { message: 'Node successfully cloned.' };
  }
});

export type PluginAPI = typeof pluginApi;

(async () => {
  const uiApiClient = client<UIAPI>();
  const username = await uiApiClient.getInputValue();

  console.log(username);
})();
```

#### UI side
```typescript
import { defineApi, client } from 'figwire/ui';
import type { PluginAPI } from './plugin';

const uiApi = defineApi({
  getInputValue: () => (document.getElementById('username') as HTMLInputElement).value
});

export type UIAPI = typeof uiApi;

(async () => {
  const pluginApiClient = client<PluginAPI>();

  document.getElementById('button').addEventListener('click', async () => {
    await pluginApiClient.cloneNode(5);
  });
})();
```
