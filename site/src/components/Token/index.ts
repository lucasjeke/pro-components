import type { App } from 'vue'
import ComponentTokenTable from './components/ComponentTokenTable/index.vue'

export default {
  install(app: App) {
    app.component(ComponentTokenTable.name!, ComponentTokenTable)
  },
}
