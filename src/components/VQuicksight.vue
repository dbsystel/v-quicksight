<script setup lang="ts">
import {
  createEmbeddingContext,
  type EmbeddingContext,
  type ExperienceFrameMetadata,
  type EmbeddingEvents
} from 'amazon-quicksight-embedding-sdk'
import { onBeforeMount, provide, ref } from 'vue'
import { EmbeddingContextInjectionKey } from '../symbols'

withDefaults(
  defineProps<{
    className?: string
  }>(),
  {
    className: 'v-quicksight'
  }
)

const emit = defineEmits<{
  (e: 'change', data: { changeEvent: EmbeddingEvents; metadata?: ExperienceFrameMetadata }): void
}>()

const embeddingContext = ref<EmbeddingContext>()

onBeforeMount(setupEmbeddingContext)

async function setupEmbeddingContext() {
  embeddingContext.value = await createEmbeddingContext({
    onChange: (changeEvent, metadata) => {
      emit('change', { changeEvent, metadata })
    }
  })
}

provide(EmbeddingContextInjectionKey, embeddingContext)
</script>

<template>
  <div :class="className"><slot></slot></div>
</template>

<style>
.quicksight-embedding-iframe {
  height: 100%;
}
</style>
