# v-quicksight

A component that's responsible to [setup the embedding context](https://github.com/awslabs/amazon-quicksight-embedding-sdk#creating-the-embedding-context).
The embedding context creates an additional zero-pixel `iframe` and appends it
into the `body` element on the page to centralize communication between the
Quicksight SDK and the embedded QuickSight content.

<script setup>
import DashboardOne from "@demos/DashboardOne.vue"
</script>

<ClientOnly>
  <!-- <DashboardOne /> -->
</ClientOnly>

::: code-group

<<< ../src/demos/DashboardOne.vue

:::

## Props

| **property** | **type** | **required** | **default**    | **description**                                                       |
|--------------|----------|--------------|----------------|-----------------------------------------------------------------------|
| `className`  | `string` | no           | `v-quicksight` | A CSS class name, the wrapper component for `v-quicksight` will have. |

## Events

**`change`**

Emits a generic event containing the changes as well as optionally the meta data of the frame.

```ts
type VQuicksightChange = {
  changeEvent: SimpleChangeEvent;
  metadata?: ExperienceFrameMetadata;
}
```

## Provides

| **symbol**                     | **type**                | **description**                                                                         |
|--------------------------------|-------------------------|-----------------------------------------------------------------------------------------|
| `EmbeddingContextInjectionKey` | `Ref<EmbeddingContext>` | Provides the general embedding context to used in other `v-quicksight` child components |
