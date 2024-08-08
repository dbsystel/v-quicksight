import type { App } from 'vue'

import VQuicksight from './VQuicksight.vue'
import VQuicksightDashboard from './VQuicksightDashboard.vue'
import VQuicksightVisual from './VQuicksightVisual.vue'
import VQuicksightConsole from './VQuicksightConsole.vue'
import VQuicksightSearch from './VQuicksightSearch.vue'
import VQuicksightGenerativeQnA from '@/components/VQuicksightGenerativeQnA.vue'

function install(app: App) {
  app.component('v-quicksight', VQuicksight)
  app.component('v-quicksight-dashboard', VQuicksightDashboard)
  app.component('v-quicksight-visual', VQuicksightVisual)
  app.component('v-quicksight-console', VQuicksightConsole)
  app.component('v-quicksight-search', VQuicksightSearch)
  app.component('v-quicksight-generative-qna', VQuicksightGenerativeQnA)
}

export default install

export {
  install,
  VQuicksight,
  VQuicksightDashboard,
  VQuicksightVisual,
  VQuicksightConsole,
  VQuicksightSearch,
  VQuicksightGenerativeQnA
}
