# v-quicksight-generative-qna

<script setup>
import GenerativeQnAOne from "@demos/GenerativeQnAOne.vue"
</script>

<ClientOnly>
  <!-- <GenerativeQnAOne /> -->
</ClientOnly>

::: code-group

<<< ../src/demos/GenerativeQnAOne.vue

:::

## Props

All of the following properties are passed with their default values from the `amazon-quicksight-embedding-sdk` one by one:

- [Common `ContentOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-contentoptions-for-all-embedding-experiences)
- [Common `FrameOptions` for All Embedding Experiences
](https://github.com/awslabs/amazon-quicksight-embedding-sdk#common-properties-of-frameoptions-for-all-embedding-experiences)
- [Visual Embedding ContentOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#contentoptions-4)
- [Visual Embedding FrameOptions](https://github.com/awslabs/amazon-quicksight-embedding-sdk#frameoptions-4)

**Additional and important properties**

| **property** | **type**     | **required** | **default**                                            | **description**                                                                                                |
|--------------|--------------|--------------|--------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `container`  | `string`     | no           | The default container created by the component itself. | The container where the `iframe` for embedding is created.                                                     |
| `id`         | `string`     | no           | `v-quicksight-visual-${nanoid(6)}`                     | The `id` for the created `iframe` container element (parent)                                                   |
| `question`   | `string`     | no           | `undefined`                                            | The question to ask or a nullish value if the search should be closed. This property is watched for changes.   |

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
