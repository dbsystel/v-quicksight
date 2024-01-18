<script setup lang="ts">
import { ref } from 'vue'

const search = ref('How many apples were sold?')

const quickSightEmbedUrl = ref(
  'https://eu-central-1.quicksight.aws.amazon.com/embed/12345/dashboards/67890?code=...'
)

function log($event: any) {
  console.log('change', $event)
}
</script>

<template>
  <v-quicksight>
    <v-quicksight-search
      class="q-search"
      :url="quickSightEmbedUrl"
      :search="search"
      @change="log"
    />
  </v-quicksight>
</template>
