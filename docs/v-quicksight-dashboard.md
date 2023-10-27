# v-quicksight-dashboard

## Example

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

All of the following properties are passed with their default values from the `amazon-quicksight-embedding-sdk` one by one:

- [Common `ContentOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-contentoptions-for-all-embedding-experiences)
- [Common `FrameOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-frameoptions-for-all-embedding-experiences)
- [Dashboard ContentOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#contentoptions)
- [Dashboard FrameOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#frameoptions)

**Additional and important properties**

| **property** | **type**      | **required** | **default**                                            | **description**                                                                             |
|--------------|---------------|--------------|--------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `container`  | `string`      | no           | The default container created by the component itself. | The container where the `iframe` for embedding is created.                                  |
| `dashboard`  | `string`      | no           | -                                                      | The dashboard that should be displayed (it's watched and updated when the property changes) |
| `id`         | `string`      | no           | `v-quicksight-dashboard-${nanoid(6)}`                  | The `id` for the created `iframe` container element (parent)                                |
| `parameters` | `Parameter[]` | no           | `[]`                                                   | The parameters to be passed to the dashboard.                                               |


## Events

**`change`**

Emits a generic event containing the changes as well as optionally the meta data of the frame.

```ts
type VQuicksightChange = {
  changeEvent: SimpleChangeEvent;
  metadata?: ExperienceFrameMetadata;
}
```

**`message`**

Emits a generic event containing the message as well as optionally the meta data of the frame.

```ts
type VQuicksightMessage = {
  messageEvent: SimpleMessageEvent;
  experienceMetadata?: ExperienceFrameMetadata;
}
```
