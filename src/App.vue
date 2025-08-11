<script setup>
import { ref, nextTick, onUpdated, onMounted } from 'vue'
import VxeTableDemo from './components/VxeTableDemo.vue'
import VirtualTableDemo from './components/VirtualTableDemo.vue'

const count = ref(0)
const message = ref('')
const updateLog = ref([])
const updateCount = ref(0)
const currentView = ref('nextTick') // 'nextTick', 'vxeTable', 'virtualTable'

// 使用 nextTick 的例子
async function incrementWithNextTick() {
  count.value++
  message.value = '正在更新...'
  
  // 此时 DOM 还未更新
  console.log('nextTick 前 - count:', count.value)
  console.log('nextTick 前 - DOM 内容:', document.getElementById('counter').textContent)
  
  await nextTick()
  
  // DOM 此时已经更新
  console.log('nextTick 后 - count:', count.value)
  console.log('nextTick 后 - DOM 内容:', document.getElementById('counter').textContent)
  message.value = '更新完成！'
  
  console.log('nextTick 后 - DOM 内容:', document.getElementById('message').textContent)
  // 在点击处理函数中更新日志，而不是在 onUpdated 中
  updateLog.value.push(`点击更新 #${updateCount.value + 1}: count = ${count.value}`)
  updateCount.value++
}

// 使用 onUpdated 生命周期钩子 - 只用于观察，不修改状态
onUpdated(() => {
  console.log('onUpdated 触发 - 组件已更新')
  console.log('onUpdated - count:', count.value)
  console.log('onUpdated - DOM 内容:', document.getElementById('counter')?.textContent)
  
  // 不在这里修改任何响应式状态！
  // 这样可以避免无限更新循环
  
  // 正确的用法示例：
  // - 调试和监控
  // - 与第三方库集成
  // - 性能分析
  // - 外部 DOM 操作（非响应式）
})

// 组件挂载时的日志
onMounted(() => {
  console.log('组件已挂载')
  // updateLog.value.push('组件初始化')
})

// 切换视图
const switchView = (view) => {
  currentView.value = view
}
</script>

<template>
  <div class="container">
    <h1>Vue 3 演示项目</h1>
    
    <!-- 导航按钮 -->
    <div class="nav-buttons">
      <button 
        @click="switchView('nextTick')" 
        :class="['nav-btn', { active: currentView === 'nextTick' }]"
      >
        nextTick 演示
      </button>
      <button 
        @click="switchView('vxeTable')" 
        :class="['nav-btn', { active: currentView === 'vxeTable' }]"
      >
        VXE Table 演示
      </button>
      <button 
        @click="switchView('virtualTable')" 
        :class="['nav-btn', { active: currentView === 'virtualTable' }]"
      >
        虚拟列表演示
      </button>
    </div>
    
    <!-- VXE Table 演示 -->
    <div v-if="currentView === 'vxeTable'" class="demo-section">
      <VxeTableDemo />
    </div>
    
    <!-- 虚拟列表演示 -->
    <div v-else-if="currentView === 'virtualTable'" class="demo-section">
      <VirtualTableDemo />
    </div>
    
    <!-- nextTick vs onUpdated 演示 -->
    <div v-else class="demo-section">
      <h2>Vue 3 nextTick vs onUpdated 对比</h2>
      
      <div class="demo-section">
        <h3>nextTick 示例</h3>
        <button id="counter" @click="incrementWithNextTick" class="btn">
          Count: {{ count }}
        </button>
        <p id="message" class="message">{{ message }}</p>
      </div>
      
      <div class="demo-section">
        <h3>onUpdated 观察</h3>
        <p class="info">onUpdated 钩子会在每次组件更新后自动触发，请查看控制台输出</p>
        <p class="note">注意：onUpdated 中不应该修改响应式状态，避免无限循环</p>
        <div class="execution-order">
          <h4>执行顺序：</h4>
          <ol>
            <li>点击按钮 → 数据变化</li>
            <li>DOM 更新</li>
            <li>nextTick 回调执行</li>
            <li>onUpdated 钩子触发</li>
          </ol>
        </div>
      </div>
      
      <div class="demo-section">
        <h3>更新日志</h3>
        <div class="log-container">
          <div v-for="(log, index) in updateLog" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
      
      <div class="explanation">
        <h3>关键区别：</h3>
        <ul>
          <li><strong>nextTick</strong>: 手动调用，确保在 DOM 更新后执行特定代码</li>
          <li><strong>onUpdated</strong>: 自动触发，每次组件更新都会执行</li>
          <li><strong>执行时机</strong>: nextTick 更精确，onUpdated 更频繁</li>
          <li><strong>使用场景</strong>: nextTick 用于特定操作，onUpdated 用于监听所有更新</li>
          <li><strong>重要原则</strong>: 不要在 onUpdated 中修改响应式状态！</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.nav-buttons {
  margin: 20px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #f0f0f0;
  color: #333;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.nav-btn.active {
  background-color: #2196F3;
  color: white;
  border-color: #2196F3;
}

.demo-section {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn:hover {
  background-color: #45a049;
}

.message {
  color: #666;
  font-style: italic;
  margin-top: 10px;
}

.info {
  color: #2196F3;
  background-color: #E3F2FD;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #2196F3;
  margin: 10px 0;
}

.note {
  color: #FF9800;
  background-color: #FFF3E0;
  padding: 10px;
  border-radius: 4px;
  border-left: 4px solid #FF9800;
  margin: 10px 0;
  font-weight: bold;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.log-item {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-family: monospace;
  font-size: 14px;
}

.execution-order {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f7fd;
  border-radius: 6px;
  border-left: 4px solid #2196F3;
}

.execution-order h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #2196F3;
}

.execution-order ol {
  padding-left: 20px;
}

.execution-order li {
  margin-bottom: 5px;
}

.explanation {
  margin-top: 30px;
  padding: 20px;
  background-color: #e8f4f8;
  border-radius: 8px;
}

.explanation ul {
  margin: 10px 0;
  padding-left: 20px;
}

.explanation li {
  margin: 5px 0;
}
</style>