# v-quicksight-visual

<script setup>
import VisualOne from "@demos/VisualOne.vue"
</script>

<ClientOnly>
  <!-- <VisualOne /> -->
</ClientOnly>

::: code-group

<<< ../src/demos/VisualOne.vue

:::

## Props

All of the following properties are passed with their default values from the `amazon-quicksight-embedding-sdk` one by one:

- [Common `ContentOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-contentoptions-for-all-embedding-experiences)
- [Common `FrameOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-frameoptions-for-all-embedding-experiences)
- [Visual Embedding ContentOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#contentoptions-1)
- [Visual Embedding FrameOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#frameoptions-1)

**Additional and important properties**

| **property** | **type**                         | **required** | **default**                                            | **description**                                                                                                                                            |
|--------------|----------------------------------|--------------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `container`  | `string`                         | no           | The default container created by the component itself. | The container where the `iframe` for embedding is created.                                                                                                 |
| `id`         | `string`                         | no           | `v-quicksight-visual-${nanoid(6)}`                     | The `id` for the created `iframe` container element (parent)                                                                                               |
| `parameters` | `Parameter[]`                    | no           | `[]`                                                   | The parameters to be passed to the visual.                                                                                                                 |
| `theme`      | `string` \| `ThemeConfiguration` | no           | -                                                      | The Theme ARN to use or an overriding [`ThemeConfiguration`](https://docs.aws.amazon.com/de_de/quicksight/latest/APIReference/API_ThemeConfiguration.html) |

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
