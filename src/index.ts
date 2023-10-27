import { EmbeddingContextInjectionKey } from './symbols'
import * as VQuicksight from './components/index'
import type { App, Plugin } from 'vue'

const install: Plugin = (app: App) => {
  app.use(VQuicksight.install)
}

const plugin = { install }

export default plugin
export { install, EmbeddingContextInjectionKey }
