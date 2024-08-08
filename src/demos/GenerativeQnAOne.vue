<script setup lang="ts">
import { ref } from 'vue'

const question = ref('How many apples were sold?')

const quickSightEmbedUrl = ref(
  'https://eu-central-1.quicksight.aws.amazon.com/embed/12345/dashboards/67890?code=...'
)

function log($event: any) {
  console.log('change', $event)
}
</script>

<template>
  <v-quicksight>
    <v-quicksight-generative-qna
      class="report-dashboard"
      :url="quickSightEmbedUrl"
      :question="question"
      @change="log" />
  </v-quicksight>
</template>
