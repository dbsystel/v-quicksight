<script setup lang="ts">
import type { VQuicksightFrameOptions, VQuicksightVisualContentOptions } from '../types'
import type {
  EmbeddingContext,
  ExperienceFrameMetadata,
  FrameOptions,
  Parameter,
  EmbeddingEvents,
  VisualContentOptions,
  VisualExperience
} from 'amazon-quicksight-embedding-sdk'
import { nanoid } from 'nanoid'
import type { Ref } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { EmbeddingContextInjectionKey } from '../symbols'

const props = withDefaults(
  defineProps<
    VQuicksightFrameOptions &
      VQuicksightVisualContentOptions & {
        container?: string | HTMLElement // override from FrameOptions and make it optional
        id?: string
      }
  >(),
  {
    width: '100%',
    height: '100%',
    resizeHeightOnSizeChangedEvent: true,
    fitToIframeWidth: true,
    parameters: () => []
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

const visualFrame = ref<VisualExperience>()

const containerId = computed(() => props.id || `v-quicksight-visual-${nanoid(6)}`)
const frameOptions = computed<FrameOptions>(() => {
  return {
    url: props.url,
    container: props.container || `#${containerId.value}`,
    height: props.height,
    width: props.width,
    className: props.className,
    resizeHeightOnSizeChangedEvent: props.resizeHeightOnSizeChangedEvent,
    withIframePlaceholder: props.withIframePlaceholder,
    onChange: (changeEvent, metadata) => {
      emit('change', { changeEvent, metadata })
    }
  }
})
const contentOptions = computed<VisualContentOptions>(() => {
  return {
    parameters: props.parameters,
    locale: props.locale,
    fitToIframeWidth: props.fitToIframeWidth,
    onMessage: async (messageEvent, experienceMetadata) => {
      emit('message', { messageEvent, experienceMetadata })
    }
  }
})

async function embedVisual(ctx: EmbeddingContext) {
  visualFrame.value = await ctx.embedVisual(frameOptions.value, contentOptions.value)
}

async function setParameters(frame: VisualExperience, parameters: Parameter[]) {
  return await frame.setParameters(parameters)
}

watch(
  () => embeddingContext?.value,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      embedVisual(newValue)
    }
  },
  { immediate: true }
)

watch(
  () => props.parameters,
  (newValue) => {
    if (newValue && visualFrame.value) {
      setParameters(visualFrame.value, newValue)
    } else if (embeddingContext?.value) {
      embedVisual(embeddingContext?.value)
    } else {
      console.error('could not find any embeddingContext for updating parameters')
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="v-quicksight-visual" :id="containerId"></div>
</template>
