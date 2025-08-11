<script setup>
import { ref, nextTick, onUpdated, onMounted } from 'vue'

const count = ref(0)
const message = ref('')
const updateLog = ref([])

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
}

// 使用 onUpdated 生命周期钩子
onUpdated(() => {
  console.log('onUpdated 触发 - 组件已更新')
  console.log('onUpdated - count:', count.value)
  console.log('onUpdated - DOM 内容:', document.getElementById('counter').textContent)
  
  updateLog.value.push(`更新 #${updateLog.value.length + 1}: count = ${count.value}`)
})

// 组件挂载时的日志
onMounted(() => {
  console.log('组件已挂载')
  updateLog.value.push('组件初始化')
})
</script>

<template>
  <div class="container">
    <h2>Vue 3 nextTick vs onUpdated 对比</h2>
    
    <div class="demo-section">
      <h3>nextTick 示例</h3>
      <button id="counter" @click="incrementWithNextTick" class="btn">
        Count: {{ count }}
      </button>
      <p class="message">{{ message }}</p>
    </div>
    
    <div class="demo-section">
      <h3>onUpdated 日志</h3>
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
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
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