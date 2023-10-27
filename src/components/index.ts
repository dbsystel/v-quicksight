import type { App } from 'vue'

import VQuicksight from './VQuicksight.vue'
import VQuicksightDashboard from './VQuicksightDashboard.vue'
import VQuicksightVisual from './VQuicksightVisual.vue'

function install(app: App) {
  app.component('v-quicksight', VQuicksight)
  app.component('v-quicksight-dashboard', VQuicksightDashboard)
  app.component('v-quicksight-visual', VQuicksightVisual)
}

export default install

export { install, VQuicksight, VQuicksightDashboard, VQuicksightVisual }
