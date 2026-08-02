import type { App } from 'vue'
import CodeDemo from './CodeDemo'
import ComponentOverview from './ComponentOverview/index.vue'
import InstallDependencies from './InstallDependencies/index.vue'
import Token from './Token'

function install(app: App) {
  app.component(InstallDependencies.name!, InstallDependencies)
  app.component(ComponentOverview.name!, ComponentOverview)
  app.use(CodeDemo)
  app.use(Token)
}
export default {
  install,
}
