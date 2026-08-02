import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import App from './App.vue'
import registerComponents from './components'

import { setupRouterGuard } from './router/guard.ts'
import './assets/styles/index.css'
// import 'antd.css'
import 'uno.css'

async function bootstrap() {
  const app = createApp(App)

  // 挂载状态管理
  app.use(store)

  // 挂载路由
  app.use(router)

  // 注册路由导航守卫
  setupRouterGuard(router)

  // 注册自定义组件
  app.use(registerComponents)

  // 路由是否准备就绪
  await router.isReady()

  // 挂载APP实例
  app.mount('#app')
}

bootstrap()
