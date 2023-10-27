<script setup lang="ts">
import type { VQuicksightDashboardContentOptions, VQuicksightFrameOptions } from '../types'
import type {
  DashboardContentOptions,
  DashboardFrame,
  EmbeddingContext,
  ExperienceFrameMetadata,
  FrameOptions,
  Parameter,
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
      VQuicksightDashboardContentOptions & {
        container?: string | HTMLElement // override from FrameOptions and make it optional
        dashboard?: string
        id?: string
      }
  >(),
  {
    width: '100%',
    height: '100%',
    resizeHeightOnSizeChangedEvent: true,
    withIframePlaceholder: false,
    parameters: () => [],
    sheetOptions: () => ({}),
    toolbarOptions: () => ({}),
    attributionOptions: () => ({})
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

const dashboardFrame = ref<DashboardFrame>()
const changedDashboard = ref<string>()

const containerId = computed(() => props.id || `v-quicksight-dashboard-${nanoid(6)}`)
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
const contentOptions = computed<DashboardContentOptions>(() => {
  return {
    parameters: props.parameters,
    locale: props.locale,
    sheetOptions: props.sheetOptions,
    toolbarOptions: props.toolbarOptions,
    attributionOptions: props.attributionOptions,
    onMessage: async (messageEvent, experienceMetadata) => {
      emit('message', { messageEvent, experienceMetadata })
    }
  }
})

async function embedDashboard(ctx: EmbeddingContext, dashboard?: string) {
  dashboardFrame.value = await ctx.embedDashboard(frameOptions.value, contentOptions.value)
  if (dashboard) {
    navigateToDashboard(dashboardFrame.value, dashboard)
  }
}

async function navigateToDashboard(frame: DashboardFrame, dashboard: string) {
  await frame.navigateToDashboard(dashboard, {
    parameters: props.parameters
  })
}

async function setParameters(frame: DashboardFrame, parameters: Parameter[]) {
  return await frame.setParameters(parameters)
}

watch(
  () => embeddingContext?.value,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      embedDashboard(newValue)
    }
  },
  { immediate: true }
)

watch(
  () => props.dashboard,
  (newValue) => {
    changedDashboard.value = newValue
    if (newValue && dashboardFrame.value) {
      navigateToDashboard(dashboardFrame.value, newValue)
    } else if (embeddingContext?.value) {
      embedDashboard(embeddingContext?.value, newValue)
    } else {
      console.error('could not find any embeddingContext for embedding / updating dashboard')
    }
  }
)

watch(
  () => props.parameters,
  (newValue) => {
    console.log('UPDATE PARAMETERS', {
      newValue,
      dashboardFrame: dashboardFrame.value,
      currentDashboard: changedDashboard.value,
      dashboard: props.dashboard
    })
    if (newValue && dashboardFrame.value) {
      // only set parameters when dashboard has not been changed.
      // Otherwise changes will be handled by navigateToDashboard
      if (!changedDashboard.value || changedDashboard.value === props.dashboard) {
        setParameters(dashboardFrame.value, newValue)
      }
    } else if (embeddingContext?.value) {
      embedDashboard(embeddingContext?.value)
    } else {
      console.error('could not find any embeddingContext for updating parameters')
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="v-quicksight-dashboard" :id="containerId"></div>
</template>
