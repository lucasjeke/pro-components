import type { App } from 'vue'
import Group from './components/Demo/Group.vue'
import Demo from './components/Demo/index.vue'
import CodeDemoInline from './components/Inline/index.vue'

export default {
  install(app: App) {
    app.component(CodeDemoInline.name!, CodeDemoInline)
    app.component(Demo.name!, Demo)
    app.component(Group.name!, Group)
  },
}
