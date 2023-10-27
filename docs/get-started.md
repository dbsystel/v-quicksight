# Get Started

`v-quicksight` is compatible with the following versions:

- **[amazon-quicksight-embedding-sdk](https://github.com/awslabs/amazon-quicksight-embedding-sdk)**: `^2.3.0`
- **[vue](https://github.com/vuejs/core)**: `^3.0.0`

## Installation

```bash
npm install @dbsystel/v-quicksight
```

## Usage

To use `v-quicksight` in your application, you need to register it using `app.use()`:

```ts
import { createApp } from "vue";
import App from "./App.vue";

import VQuicksight from "@dbsystel/v-quicksight";

const app = createApp(App);
app.use(VQuicksight);

app.mount("#app");
```
