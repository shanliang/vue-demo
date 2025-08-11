<template>
  <div class="virtual-table-demo">
    <h2>虚拟列表行更新示例 (300条数据)</h2>
    
    <div class="controls">
      <vxe-button @click="addRandomData">添加随机数据</vxe-button>
      <vxe-button @click="updateRandomRows">批量更新随机行</vxe-button>
      <vxe-button @click="updateFirst10Rows">批量更新前10行</vxe-button>
      <vxe-button @click="clearData">清空数据</vxe-button>
      <vxe-button @click="generateDataAction">生成300条数据</vxe-button>
    </div>
    
    <div class="stats">
      <span>总数据量: {{ tableData.length }} 条</span>
      <span>更新时间: {{ lastUpdateTime }}</span>
    </div>
    
    <div class="table-container">
      <vxe-table
        ref="xTable"
        :data="tableData"
        :loading="loading"
        height="600"
        border
        stripe
        highlight-hover-row
        :scroll-x="{ enabled: true }"
        :scroll-y="{ enabled: true }"
        :row-config="{ keyField: 'id' }"
        @cell-click="handleCellClick"
      >
        <template #toolbar>
          <vxe-input
            v-model="searchKeyword"
            placeholder="搜索姓名或邮箱"
            style="width: 200px;"
            @input="handleSearch"
          ></vxe-input>
        </template>
        
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column field="id" title="ID" width="80" sortable></vxe-column>
        <vxe-column field="name" title="姓名" width="120" sortable></vxe-column>
        <vxe-column field="age" title="年龄" width="80" sortable></vxe-column>
        <vxe-column field="email" title="邮箱" width="200"></vxe-column>
        <vxe-column field="city" title="城市" width="120"></vxe-column>
        <vxe-column field="status" title="状态" width="100">
          <template #default="{ row }">
            <span :class="['status-badge', `status-${row.status}`]">
              {{ row.status }}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="updateTime" title="更新时间" width="150" sortable></vxe-column>
        <vxe-column title="操作" width="150" fixed="right">
          <template #default="{ row }">
            <vxe-button size="mini" @click="editRow(row)">编辑</vxe-button>
            <vxe-button size="mini" type="danger" @click="deleteRow(row)">删除</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    
    <!-- 编辑对话框 -->
    <vxe-modal
      v-model="showEditModal"
      title="编辑行数据"
      width="500"
      :mask-closable="false"
    >
      <vxe-form :data="editForm" :items="formItems"></vxe-form>
      <template #footer>
        <vxe-button @click="showEditModal = false">取消</vxe-button>
        <vxe-button type="primary" @click="saveEdit">保存</vxe-button>
      </template>
    </vxe-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 表格数据
const tableData = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const lastUpdateTime = ref('')
const showEditModal = ref(false)
const editForm = ref({})
const editIndex = ref(-1)

// 表单配置
const formItems = ref([
  { field: 'name', title: '姓名', itemRender: { name: 'input' } },
  { field: 'age', title: '年龄', itemRender: { name: 'input', attrs: { type: 'number' } } },
  { field: 'email', title: '邮箱', itemRender: { name: 'input' } },
  { field: 'city', title: '城市', itemRender: { name: 'select', options: [
    { label: '北京', value: '北京' },
    { label: '上海', value: '上海' },
    { label: '广州', value: '广州' },
    { label: '深圳', value: '深圳' },
    { label: '杭州', value: '杭州' },
    { label: '成都', value: '成都' },
    { label: '武汉', value: '武汉' },
    { label: '西安', value: '西安' }
  ]}},
  { field: 'status', title: '状态', itemRender: { name: 'select', options: [
    { label: '活跃', value: '活跃' },
    { label: '离线', value: '离线' },
    { label: '忙碌', value: '忙碌' },
    { label: '离开', value: '离开' }
  ]}}
])

// 生成模拟数据
const generateData = (count = 300) => {
  const data = []
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `${names[i % names.length]}${i}`,
      age: Math.floor(Math.random() * 50) + 18,
      email: `user${i}@example.com`,
      city: cities[Math.floor(Math.random() * cities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      updateTime: new Date().toLocaleString()
    })
  }
  return data
}

// 添加随机数据
const addRandomData = () => {
  const newData = generateData(10)
  const startId = tableData.value.length + 1
  newData.forEach((item, index) => {
    item.id = startId + index
  })
  tableData.value.push(...newData)
  updateTime()
}

// 批量更新随机行
const updateRandomRows = () => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  
  // 随机选择10行进行更新
  const updateCount = Math.min(10, tableData.value.length)
  for (let i = 0; i < updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * tableData.value.length)
    const row = tableData.value[randomIndex]
    
    row.age = Math.floor(Math.random() * 50) + 18
    row.city = cities[Math.floor(Math.random() * cities.length)]
    row.status = statuses[Math.floor(Math.random() * statuses.length)]
    row.updateTime = new Date().toLocaleString()
  }
  updateTime()
}

// 批量更新前10行
const updateFirst10Rows = () => {
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  
  // 更新前10行数据
  const updateCount = Math.min(10, tableData.value.length)
  for (let i = 0; i < updateCount; i++) {
    const row = tableData.value[i]
    
    row.age = Math.floor(Math.random() * 50) + 18
    row.city = cities[Math.floor(Math.random() * cities.length)]
    row.status = statuses[Math.floor(Math.random() * statuses.length)]
    row.updateTime = new Date().toLocaleString()
  }
  updateTime()
  console.log(`已更新前${updateCount}行数据`)
}

// 清空数据
const clearData = () => {
  tableData.value = []
  updateTime()
}

// 生成300条数据
const generateDataAction = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = generateData(300)
    loading.value = false
    updateTime()
  }, 500)
}

// 搜索功能
const handleSearch = () => {
  // 这里可以实现搜索逻辑
  console.log('搜索关键词:', searchKeyword.value)
}

// 单元格点击
const handleCellClick = ({ row, column }) => {
  console.log('点击单元格:', row, column)
}

// 编辑行
const editRow = (row) => {
  editForm.value = { ...row }
  editIndex.value = tableData.value.findIndex(item => item.id === row.id)
  showEditModal.value = true
}

// 保存编辑
const saveEdit = () => {
  if (editIndex.value >= 0) {
    tableData.value[editIndex.value] = { 
      ...editForm.value, 
      updateTime: new Date().toLocaleString() 
    }
    showEditModal.value = false
    updateTime()
  }
}

// 删除行
const deleteRow = (row) => {
  const index = tableData.value.findIndex(item => item.id === row.id)
  if (index >= 0) {
    tableData.value.splice(index, 1)
    updateTime()
  }
}

// 更新时间
const updateTime = () => {
  lastUpdateTime.value = new Date().toLocaleString()
}

// 组件挂载时初始化数据
onMounted(() => {
  console.log('VirtualTableDemo 组件已挂载')
  tableData.value = generateData(300)
  updateTime()
  console.log('初始数据条数:', tableData.value.length)
})
</script>

<style scoped>
.virtual-table-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats {
  margin: 15px 0;
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
}

.table-container {
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-活跃 {
  background-color: #e8f5e8;
  color: #52c41a;
}

.status-离线 {
  background-color: #f5f5f5;
  color: #999;
}

.status-忙碌 {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-离开 {
  background-color: #fff1f0;
  color: #ff4d4f;
}
</style>
