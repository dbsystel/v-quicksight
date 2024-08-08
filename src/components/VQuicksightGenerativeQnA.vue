<script setup lang="ts">
import type { VQuicksightGenerativeQnAContentOptions, VQuicksightFrameOptions } from '../types'
import type {
  GenerativeQnAContentOptions,
  GenerativeQnAExperience,
  EmbeddingContext,
  ExperienceFrameMetadata,
  FrameOptions,
  EmbeddingEvents
} from 'amazon-quicksight-embedding-sdk'
import { nanoid } from 'nanoid'
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { EmbeddingContextInjectionKey } from '../symbols'

const props = withDefaults(
  defineProps<
    VQuicksightFrameOptions &
      VQuicksightGenerativeQnAContentOptions & {
        container?: string | HTMLElement // override from FrameOptions and make it optional
        id?: string
        question?: string
      }
  >(),
  {
    width: '100%',
    height: '100%',
    withIframePlaceholder: false,
    showTopicName: true,
    showPinboard: true,
    allowTopicSelection: true,
    allowFullscreen: true
  }
)

const emit = defineEmits<{
  (e: 'change', data: { changeEvent: EmbeddingEvents; metadata?: ExperienceFrameMetadata }): void
  (
    e: 'message',
    data: { messageEvent: EmbeddingEvents; experienceMetadata?: ExperienceFrameMetadata }
  ): void
}>()

const embeddingContext = inject<Ref<EmbeddingContext>>(EmbeddingContextInjectionKey)

const qnaFrame = ref<GenerativeQnAExperience>()

const containerId = computed(() => props.id || `v-quicksight-generative-qna-${nanoid(6)}`)
const frameOptions = computed<FrameOptions>(() => {
  return {
    url: props.url,
    container: props.container || `#${containerId.value}`,
    height: props.height,
    width: props.width,
    className: props.className,
    withIframePlaceholder: props.withIframePlaceholder,
    onChange: (changeEvent, metadata) => {
      emit('change', { changeEvent, metadata })
    }
  }
})
const contentOptions = computed<GenerativeQnAContentOptions>(() => {
  return {
    showTopicName: props.showTopicName,
    showPinboard: props.showPinboard,
    allowTopicSelection: props.allowTopicSelection,
    allowFullscreen: props.allowFullscreen,
    searchPlaceholderText: props.searchPlaceholderText,
    panelOptions: props.panelOptions,
    themeOptions: props.themeOptions,
    onMessage: async (messageEvent, experienceMetadata) => {
      emit('message', { messageEvent, experienceMetadata })
    }
  }
})

async function embedQnA(ctx: EmbeddingContext) {
  qnaFrame.value = await ctx.embedGenerativeQnA(frameOptions.value, contentOptions.value)
}

async function setQuestion(frame: GenerativeQnAExperience, question?: string) {
  if (question) {
    return await frame.setQuestion(question)
  } else {
    return await frame.close()
  }
}

watch(
  () => embeddingContext?.value,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      embedQnA(newValue)
    }
  },
  { immediate: true }
)

watch(
  () => props.question,
  (newValue) => {
    if (qnaFrame.value) {
      setQuestion(qnaFrame.value, newValue)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="v-quicksight-generative-qna" :id="containerId"></div>
</template>
