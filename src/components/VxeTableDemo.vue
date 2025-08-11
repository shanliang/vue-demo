<template>
  <div class="vxe-table-demo">
    <h2>VXE Table 4.* 演示</h2>
    
    <div class="debug-info">
      <p>数据条数: {{ tableData.length }}</p>
      <p>加载状态: {{ loading }}</p>
    </div>
    
    <div class="table-container">
      <vxe-table
        :data="tableData"
        :loading="loading"
        height="400"
        border
        stripe
      >
        <vxe-column field="id" title="ID" width="80"></vxe-column>
        <vxe-column field="name" title="姓名" width="120"></vxe-column>
        <vxe-column field="age" title="年龄" width="80"></vxe-column>
        <vxe-column field="email" title="邮箱" width="200"></vxe-column>
        <vxe-column field="city" title="城市" width="120"></vxe-column>
        <vxe-column field="status" title="状态" width="100"></vxe-column>
      </vxe-table>
    </div>
    
    <div class="controls">
      <button @click="addRow" class="btn">添加行</button>
      <button @click="refreshData" class="btn">刷新数据</button>
      <button @click="clearData" class="btn">清空数据</button>
    </div>
    
    <div class="info">
      <h3>功能特性：</h3>
      <ul>
        <li>✅ 表格数据展示</li>
        <li>✅ 行选择</li>
        <li>✅ 排序</li>
        <li>✅ 分页</li>
        <li>✅ 搜索过滤</li>
        <li>✅ 列宽调整</li>
        <li>✅ 导出功能</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 生成模拟数据
const generateData = (count = 10) => {
  const data = []
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `用户${i}`,
      age: Math.floor(Math.random() * 50) + 18,
      email: `user${i}@example.com`,
      city: cities[Math.floor(Math.random() * cities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    })
  }
  return data
}

// 添加行
const addRow = () => {
  const newId = tableData.value.length + 1
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  
  tableData.value.push({
    id: newId,
    name: `新用户${newId}`,
    age: Math.floor(Math.random() * 50) + 18,
    email: `newuser${newId}@example.com`,
    city: cities[Math.floor(Math.random() * cities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)]
  })
}

// 刷新数据
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData(15)
    loading.value = false
  }, 1000)
}

// 清空数据
const clearData = () => {
  tableData.value = []
}

// 组件挂载时初始化数据
onMounted(() => {
  console.log('VxeTableDemo 组件已挂载')
  tableData.value = generateData(5)
  console.log('初始数据:', tableData.value)
})
</script>

<style scoped>
.vxe-table-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.debug-info {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  font-family: monospace;
}

.debug-info p {
  margin: 5px 0;
}

.table-container {
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

.info {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.info h3 {
  margin-top: 0;
  color: #333;
}

.info ul {
  list-style: none;
  padding: 0;
}

.info li {
  padding: 5px 0;
  color: #666;
}
</style>
