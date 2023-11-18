<script setup lang="ts">
import type { VQuicksightSearchContentOptions, VQuicksightFrameOptions } from '../types'
import type {
  QSearchContentOptions,
  QSearchExperience,
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
      VQuicksightSearchContentOptions & {
        container?: string | HTMLElement // override from FrameOptions and make it optional
        id?: string
        question?: string
      }
  >(),
  {
    width: '100%',
    height: '100%',
    withIframePlaceholder: false,
    hideTopicName: false,
    allowTopicSelection: true
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

const searchFrame = ref<QSearchExperience>()

const containerId = computed(() => props.id || `v-quicksight-search-${nanoid(6)}`)
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
const contentOptions = computed<QSearchContentOptions>(() => {
  return {
    hideTopicName: props.hideTopicName,
    theme: props.theme,
    allowTopicSelection: props.allowTopicSelection,
    onMessage: async (messageEvent, experienceMetadata) => {
      emit('message', { messageEvent, experienceMetadata })
    }
  }
})

async function embedSearch(ctx: EmbeddingContext) {
  searchFrame.value = await ctx.embedQSearchBar(frameOptions.value, contentOptions.value)
}

async function setQuestion(frame: QSearchExperience, question?: string) {
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
      embedSearch(newValue)
    }
  },
  { immediate: true }
)

watch(
  () => props.question,
  (newValue) => {
    if (searchFrame.value) {
      setQuestion(searchFrame.value, newValue)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="v-quicksight-search" :id="containerId"></div>
</template>
