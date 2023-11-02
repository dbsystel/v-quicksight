<script setup lang="ts">
import type { VQuicksightConsoleContentOptions, VQuicksightFrameOptions } from '../types'
import type {
  ConsoleContentOptions,
  ConsoleFrame,
  EmbeddingContext,
  ExperienceFrameMetadata,
  FrameOptions,
  SimpleChangeEvent,
  SimpleMessageEvent
} from 'amazon-quicksight-embedding-sdk/dist/types'
import { nanoid } from 'nanoid'
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { EmbeddingContextInjectionKey } from '../symbols'

const props = withDefaults(
  defineProps<
    VQuicksightFrameOptions &
      VQuicksightConsoleContentOptions & {
        container?: string | HTMLElement // override from FrameOptions and make it optional
        id?: string
      }
  >(),
  {
    width: '100%',
    height: '100%',
    withIframePlaceholder: false
  }
)

const emit = defineEmits<{
  (e: 'change', data: { changeEvent: SimpleChangeEvent; metadata?: ExperienceFrameMetadata }): void
  (
    e: 'message',
    data: { messageEvent: SimpleMessageEvent; experienceMetadata?: ExperienceFrameMetadata }
  ): void
}>()

const embeddingContext = inject<Ref<EmbeddingContext>>(EmbeddingContextInjectionKey)

const consoleFrame = ref<ConsoleFrame>()

const containerId = computed(() => props.id || `v-quicksight-console-${nanoid(6)}`)
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
const contentOptions = computed<ConsoleContentOptions>(() => {
  return {
    locale: props.locale,
    onMessage: async (messageEvent, experienceMetadata) => {
      emit('message', { messageEvent, experienceMetadata })
    }
  }
})

async function embedConsole(ctx: EmbeddingContext) {
  consoleFrame.value = await ctx.embedConsole(frameOptions.value, contentOptions.value)
}

watch(
  () => embeddingContext?.value,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      embedConsole(newValue)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="v-quicksight-console" :id="containerId"></div>
</template>
