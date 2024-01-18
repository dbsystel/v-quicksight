<script setup lang="ts">
import { ref } from 'vue'

const quickSightEmbedUrl = ref(
  'https://eu-central-1.quicksight.aws.amazon.com/embed/12345/dashboards/67890?code=...'
)

function log($event: any) {
  console.log('change', $event)
}
</script>

<template>
  <v-quicksight>
    <v-quicksight-visual class="report-visual" :url="quickSightEmbedUrl" @change="log" />
  </v-quicksight>
</template>
