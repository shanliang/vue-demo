import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// 引入 vxe-table
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

// 配置 vxe-table
const app = createApp(App)

// 启用性能监控
app.config.performance = true

app.use(VXETable)
app.mount('#app')
