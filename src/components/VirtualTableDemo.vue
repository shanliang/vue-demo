<template>
  <div class="virtual-table-demo">
    <h2>虚拟列表行更新示例 (200条数据)</h2>
    
    <div class="controls">
      <div class="control-group">
        <h4>数据操作</h4>
        <div class="button-row">
          <vxe-button size="small" @click="addRandomData" type="primary">
            <span class="btn-icon">➕</span>
            添加数据
          </vxe-button>
          <vxe-button size="small" @click="updateRandomRows" type="info">
            <span class="btn-icon">🔄</span>
            随机更新
          </vxe-button>
          <vxe-button size="small" @click="updateFirst10Rows" type="warning">
            <span class="btn-icon">⚡</span>
            更新前10行
          </vxe-button>
          <vxe-button size="small" @click="clearData" type="danger">
            <span class="btn-icon">🗑️</span>
            清空数据
          </vxe-button>
          <vxe-button size="small" @click="generateDataAction" type="success">
            <span class="btn-icon">📊</span>
            生成200条
          </vxe-button>
        </div>
      </div>
      
             <div class="control-group">
         <h4>性能监测</h4>
         <div class="button-row">
           <vxe-button size="small" @click="runPerformanceTest" type="warning">
             <span class="btn-icon">🧪</span>
             性能测试(10次)
           </vxe-button>
           <vxe-button size="small" @click="runSinglePerformanceTest" type="info">
             <span class="btn-icon">⚡</span>
             性能测试(1次)
           </vxe-button>
           <vxe-button size="small" @click="exportPerformanceData" type="success">
             <span class="btn-icon">📥</span>
             导出数据
           </vxe-button>
         </div>
       </div>
    </div>
    
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">📊 总数据量:</span>
        <span class="stat-value">{{ tableData.length }} 条</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">🕒 更新时间:</span>
        <span class="stat-value">{{ lastUpdateTime }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">⚡ 操作次数:</span>
        <span class="stat-value">{{ performanceMetrics.tableOperations.length }} 次</span>
      </div>
      <div class="stat-item" v-if="getPerformanceStats()">
        <span class="stat-label">⏱️ 平均耗时:</span>
        <span class="stat-value">{{ getPerformanceStats().avgDuration }}ms</span>
      </div>
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
         :row-config="{ keyField: 'id', height: 40 }"
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
                 <vxe-column field="updateTime" title="更新时间" width="200" sortable></vxe-column>
         <vxe-column title="操作" width="95" fixed="right">
          <template #default="{ row }">
            <vxe-button size="mini" @click="editRow(row)">编辑</vxe-button>
            <vxe-button size="mini" type="danger" @click="deleteRow(row)">删除</vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    
    <!-- 性能监测面板 -->
    <div class="performance-panel" v-if="performanceMetrics.tableOperations.length > 0">
      <h3>性能监测数据</h3>
      <div class="performance-metrics">
        <div class="metric-group">
          <h4>Web Vitals</h4>
          <div class="metric-item" v-if="performanceMetrics.cls">
            <span>CLS: {{ performanceMetrics.cls.value.toFixed(4) }}</span>
          </div>
          <div class="metric-item" v-if="performanceMetrics.fcp">
            <span>FCP: {{ performanceMetrics.fcp.value.toFixed(0) }}ms</span>
          </div>
          <div class="metric-item" v-if="performanceMetrics.lcp">
            <span>LCP: {{ performanceMetrics.lcp.value.toFixed(0) }}ms</span>
          </div>
          <div class="metric-item" v-if="performanceMetrics.ttfb">
            <span>TTFB: {{ performanceMetrics.ttfb.value.toFixed(0) }}ms</span>
          </div>
          <div class="metric-item" v-if="performanceMetrics.inp">
            <span>INP: {{ performanceMetrics.inp.value.toFixed(0) }}ms</span>
          </div>
        </div>
        
        <div class="metric-group">
          <h4>表格操作统计</h4>
          <div class="metric-item" v-if="getPerformanceStats()">
            <span>总操作: {{ getPerformanceStats().totalOperations }} 次</span>
          </div>
          <div class="metric-item" v-if="getPerformanceStats()">
            <span>平均耗时: {{ getPerformanceStats().avgDuration }}ms</span>
          </div>
          <div class="metric-item" v-if="getPerformanceStats()">
            <span>平均内存: {{ getPerformanceStats().avgMemory }}KB</span>
          </div>
        </div>
        
                 <div class="metric-group">
           <h4>最近操作</h4>
           <div class="recent-operations">
             <div 
               v-for="(op, index) in performanceMetrics.tableOperations.slice(-5)" 
               :key="index"
               class="operation-item"
             >
               <div class="operation-header">
                 <span class="operation-name">{{ op.operation }}</span>
                 <span class="operation-time">{{ op.totalDuration || op.duration }}ms</span>
               </div>
               <div class="operation-details" v-if="op.phases">
                 <div class="phase-item">
                   <span class="phase-label">数据更新:</span>
                   <span class="phase-time">{{ op.phases.dataUpdate }}ms</span>
                 </div>
                 <div class="phase-item">
                   <span class="phase-label">Vue更新:</span>
                   <span class="phase-time">{{ op.phases.vueUpdate }}ms</span>
                 </div>
                 <div class="phase-item">
                   <span class="phase-label">DOM渲染:</span>
                   <span class="phase-time">{{ op.phases.render }}ms</span>
                 </div>
               </div>
               <div class="operation-memory">内存: {{ op.memoryDelta }}KB</div>
             </div>
           </div>
         </div>
      </div>
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
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals'

// 性能监测数据
const performanceMetrics = ref({
  cls: null,
  fcp: null,
  lcp: null,
  ttfb: null,
  inp: null,
  tableOperations: []
})

// 初始化 Web Vitals 监测
const initWebVitals = () => {
  // 累积布局偏移 (CLS)
  onCLS((metric) => {
    performanceMetrics.value.cls = metric
    console.log('CLS:', metric)
  })

  // 首次内容绘制 (FCP)
  onFCP((metric) => {
    performanceMetrics.value.fcp = metric
    console.log('FCP:', metric)
  })

  // 最大内容绘制 (LCP)
  onLCP((metric) => {
    performanceMetrics.value.lcp = metric
    console.log('LCP:', metric)
  })

  // 首次字节时间 (TTFB)
  onTTFB((metric) => {
    performanceMetrics.value.ttfb = metric
    console.log('TTFB:', metric)
  })

  // 交互到下一次绘制 (INP)
  onINP((metric) => {
    performanceMetrics.value.inp = metric
    console.log('INP:', metric)
  })
}

// 性能监测工具函数
const measurePerformance = (operationName, operation) => {
  const startTime = performance.now()
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  
  return new Promise((resolve) => {
    // 使用 requestAnimationFrame 确保在下一帧执行
    requestAnimationFrame(() => {
      const result = operation()
      const endTime = performance.now()
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
      
      const duration = endTime - startTime
      const memoryDelta = endMemory - startMemory
      
      const metric = {
        operation: operationName,
        duration: Math.round(duration),
        memoryDelta: Math.round(memoryDelta / 1024), // KB
        timestamp: new Date().toISOString(),
        dataCount: tableData.value.length
      }
      
      performanceMetrics.value.tableOperations.push(metric)
      console.log(`性能监测 - ${operationName}:`, metric)
      
      resolve(result)
    })
  })
}

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
const generateData = (count = 200) => {
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
const addRandomData = async () => {
  await measurePerformance('添加随机数据', () => {
    const newData = generateData(10)
    const startId = tableData.value.length + 1
    newData.forEach((item, index) => {
      item.id = startId + index
    })
    tableData.value.push(...newData)
    updateTime()
  })
}

// 批量更新随机行
const updateRandomRows = async () => {
  await measurePerformance('批量更新随机行', () => {
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
  })
}

// 批量更新前10行 - 精确测量渲染时间
const updateFirst10Rows = async () => {
  const startTime = performance.now()
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  
  console.log('🚀 开始批量更新前10行数据...')
  
  // 第一阶段：数据更新
  const dataUpdateStart = performance.now()
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
  const dataUpdateEnd = performance.now()
  const dataUpdateTime = dataUpdateEnd - dataUpdateStart
  
  console.log(`📊 数据更新完成，耗时: ${Math.round(dataUpdateTime)}ms`)
  
  // 第二阶段：等待Vue响应式更新
  const vueUpdateStart = performance.now()
  await nextTick()
  const vueUpdateEnd = performance.now()
  const vueUpdateTime = vueUpdateEnd - vueUpdateStart
  
  console.log(`⚡ Vue响应式更新完成，耗时: ${Math.round(vueUpdateTime)}ms`)
  
  // 第三阶段：等待DOM渲染完成
  const renderStart = performance.now()
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
  const renderEnd = performance.now()
  const renderTime = renderEnd - renderStart
  
  console.log(`🎨 DOM渲染完成，耗时: ${Math.round(renderTime)}ms`)
  
  // 总耗时
  const totalTime = performance.now() - startTime
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  const memoryDelta = endMemory - startMemory
  
  const detailedMetric = {
    operation: '批量更新前10行',
    totalDuration: Math.round(totalTime),
    dataUpdateTime: Math.round(dataUpdateTime),
    vueUpdateTime: Math.round(vueUpdateTime),
    renderTime: Math.round(renderTime),
    memoryDelta: Math.round(memoryDelta / 1024),
    timestamp: new Date().toISOString(),
    dataCount: tableData.value.length,
    updateCount: updateCount,
    phases: {
      dataUpdate: Math.round(dataUpdateTime),
      vueUpdate: Math.round(vueUpdateTime),
      render: Math.round(renderTime)
    }
  }
  
  performanceMetrics.value.tableOperations.push(detailedMetric)
  console.log('✅ 批量更新前10行完成，详细性能数据:', detailedMetric)
  
  updateTime()
  console.log(`已更新前${updateCount}行数据`)
}

// 清空数据
const clearData = async () => {
  await measurePerformance('清空数据', () => {
    tableData.value = []
    updateTime()
  })
}

// 生成300条数据
const generateDataAction = async () => {
  loading.value = true
  await measurePerformance('生成200条数据', () => {
    setTimeout(() => {
      tableData.value = generateData(200)
      loading.value = false
      updateTime()
    }, 500)
  })
}

// 搜索功能
const handleSearch = async () => {
  await measurePerformance('搜索操作', () => {
    // 这里可以实现搜索逻辑
    console.log('搜索关键词:', searchKeyword.value)
  })
}

// 单元格点击
const handleCellClick = async ({ row, column }) => {
  await measurePerformance('单元格点击', () => {
    console.log('点击单元格:', row, column)
  })
}

// 编辑行
const editRow = async (row) => {
  await measurePerformance('编辑行', () => {
    editForm.value = { ...row }
    editIndex.value = tableData.value.findIndex(item => item.id === row.id)
    showEditModal.value = true
  })
}

// 保存编辑
const saveEdit = async () => {
  await measurePerformance('保存编辑', () => {
    if (editIndex.value >= 0) {
      tableData.value[editIndex.value] = { 
        ...editForm.value, 
        updateTime: new Date().toLocaleString() 
      }
      showEditModal.value = false
      updateTime()
    }
  })
}

// 删除行
const deleteRow = async (row) => {
  await measurePerformance('删除行', () => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index >= 0) {
      tableData.value.splice(index, 1)
      updateTime()
    }
  })
}

// 更新时间
const updateTime = () => {
  lastUpdateTime.value = new Date().toLocaleString()
}

// 获取性能统计
const getPerformanceStats = () => {
  const operations = performanceMetrics.value.tableOperations
  if (operations.length === 0) return null
  
  const avgDuration = operations.reduce((sum, op) => {
    // 兼容不同的字段名：duration 或 totalDuration
    const duration = op.duration || op.totalDuration || 0
    return sum + duration
  }, 0) / operations.length
  
  const avgMemory = operations.reduce((sum, op) => {
    const memory = op.memoryDelta || 0
    return sum + memory
  }, 0) / operations.length
  
  return {
    totalOperations: operations.length,
    avgDuration: Math.round(avgDuration),
    avgMemory: Math.round(avgMemory),
    lastOperation: operations[operations.length - 1]
  }
}

// 导出性能数据
const exportPerformanceData = () => {
  const data = {
    webVitals: performanceMetrics.value,
    tableOperations: performanceMetrics.value.tableOperations,
    stats: getPerformanceStats(),
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `table-performance-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 运行单次性能测试
const runSinglePerformanceTest = async () => {
  console.log('⚡ 开始单次性能测试...')
  
  const startTime = performance.now()
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  
  // 第一阶段：数据更新
  const dataUpdateStart = performance.now()
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
  const statuses = ['活跃', '离线', '忙碌', '离开']
  
  const updateCount = Math.min(10, tableData.value.length)
  for (let i = 0; i < updateCount; i++) {
    const row = tableData.value[i]
    row.age = Math.floor(Math.random() * 50) + 18
    row.city = cities[Math.floor(Math.random() * cities.length)]
    row.status = statuses[Math.floor(Math.random() * statuses.length)]
    row.updateTime = new Date().toLocaleString()
  }
  const dataUpdateTime = performance.now() - dataUpdateStart
  
  // 第二阶段：等待Vue响应式更新
  const vueUpdateStart = performance.now()
  await nextTick()
  const vueUpdateTime = performance.now() - vueUpdateStart
  
  // 第三阶段：等待DOM渲染完成
  const renderStart = performance.now()
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
  const renderTime = performance.now() - renderStart
  
  const totalTime = performance.now() - startTime
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  const memoryDelta = endMemory - startMemory
  
  const testResult = {
    operation: '性能测试(1次)',
    totalDuration: Math.round(totalTime),
    dataUpdateTime: Math.round(dataUpdateTime),
    vueUpdateTime: Math.round(vueUpdateTime),
    renderTime: Math.round(renderTime),
    memoryDelta: Math.round(memoryDelta / 1024),
    timestamp: new Date().toISOString(),
    dataCount: tableData.value.length,
    updateCount: updateCount,
    phases: {
      dataUpdate: Math.round(dataUpdateTime),
      vueUpdate: Math.round(vueUpdateTime),
      render: Math.round(renderTime)
    }
  }
  
  performanceMetrics.value.tableOperations.push(testResult)
  
  console.log('✅ 单次性能测试完成:', testResult)
  console.log(`总耗时: ${Math.round(totalTime)}ms`)
  console.log(`数据更新: ${Math.round(dataUpdateTime)}ms`)
  console.log(`Vue更新: ${Math.round(vueUpdateTime)}ms`)
  console.log(`DOM渲染: ${Math.round(renderTime)}ms`)
  console.log(`内存变化: ${Math.round(memoryDelta / 1024)}KB`)
  
  updateTime()
}

// 运行多次性能测试
const runPerformanceTest = async () => {
  const testCount = 10
  const results = []
  
  console.log(`🧪 开始性能测试，将执行${testCount}次批量更新前10行操作...`)
  
  for (let i = 0; i < testCount; i++) {
    console.log(`\n--- 第${i + 1}次测试 ---`)
    
    // 等待一下让浏览器稳定
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const startTime = performance.now()
    const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
    
    // 第一阶段：数据更新
    const dataUpdateStart = performance.now()
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']
    const statuses = ['活跃', '离线', '忙碌', '离开']
    
    const updateCount = Math.min(10, tableData.value.length)
    for (let j = 0; j < updateCount; j++) {
      const row = tableData.value[j]
      row.age = Math.floor(Math.random() * 50) + 18
      row.city = cities[Math.floor(Math.random() * cities.length)]
      row.status = statuses[Math.floor(Math.random() * statuses.length)]
      row.updateTime = new Date().toLocaleString()
    }
    const dataUpdateTime = performance.now() - dataUpdateStart
    
    // 第二阶段：等待Vue响应式更新
    const vueUpdateStart = performance.now()
    await nextTick()
    const vueUpdateTime = performance.now() - vueUpdateStart
    
    // 第三阶段：等待DOM渲染完成
    const renderStart = performance.now()
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve()
        })
      })
    })
    const renderTime = performance.now() - renderStart
    
    const totalTime = performance.now() - startTime
    const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
    const memoryDelta = endMemory - startMemory
    
    const result = {
      testNumber: i + 1,
      totalDuration: Math.round(totalTime),
      dataUpdateTime: Math.round(dataUpdateTime),
      vueUpdateTime: Math.round(vueUpdateTime),
      renderTime: Math.round(renderTime),
      memoryDelta: Math.round(memoryDelta / 1024)
    }
    
    results.push(result)
    console.log(`✅ 第${i + 1}次测试完成:`, result)
  }
  
  // 计算统计结果
  const avgTotal = results.reduce((sum, r) => sum + r.totalDuration, 0) / results.length
  const avgDataUpdate = results.reduce((sum, r) => sum + r.dataUpdateTime, 0) / results.length
  const avgVueUpdate = results.reduce((sum, r) => sum + r.vueUpdateTime, 0) / results.length
  const avgRender = results.reduce((sum, r) => sum + r.renderTime, 0) / results.length
  const avgMemory = results.reduce((sum, r) => sum + r.memoryDelta, 0) / results.length
  
  const minTotal = Math.min(...results.map(r => r.totalDuration))
  const maxTotal = Math.max(...results.map(r => r.totalDuration))
  
  const testSummary = {
    operation: `性能测试(${testCount}次)`,
    totalDuration: Math.round(avgTotal),
    dataUpdateTime: Math.round(avgDataUpdate),
    vueUpdateTime: Math.round(avgVueUpdate),
    renderTime: Math.round(avgRender),
    memoryDelta: Math.round(avgMemory),
    timestamp: new Date().toISOString(),
    dataCount: tableData.value.length,
    testResults: results,
    statistics: {
      average: Math.round(avgTotal),
      minimum: minTotal,
      maximum: maxTotal,
      range: maxTotal - minTotal
    },
    phases: {
      dataUpdate: Math.round(avgDataUpdate),
      vueUpdate: Math.round(avgVueUpdate),
      render: Math.round(avgRender)
    }
  }
  
  performanceMetrics.value.tableOperations.push(testSummary)
  
  console.log('\n📊 性能测试总结:')
  console.log(`平均总耗时: ${Math.round(avgTotal)}ms`)
  console.log(`平均数据更新: ${Math.round(avgDataUpdate)}ms`)
  console.log(`平均Vue更新: ${Math.round(avgVueUpdate)}ms`)
  console.log(`平均DOM渲染: ${Math.round(avgRender)}ms`)
  console.log(`平均内存变化: ${Math.round(avgMemory)}KB`)
  console.log(`最快耗时: ${minTotal}ms`)
  console.log(`最慢耗时: ${maxTotal}ms`)
  console.log(`耗时范围: ${maxTotal - minTotal}ms`)
  
  updateTime()
}

// 组件挂载时初始化数据
onMounted(() => {
  console.log('VirtualTableDemo 组件已挂载')
  
  // 初始化性能监测
  initWebVitals()
  
  // 初始化表格数据
  measurePerformance('初始化数据', () => {
    tableData.value = generateData(200)
    updateTime()
    console.log('初始数据条数:', tableData.value.length)
  })
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
  gap: 20px;
  flex-wrap: wrap;
}

.control-group {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e9ecef;
  min-width: 300px;
}

.control-group h4 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 8px;
}

.button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-icon {
  margin-right: 4px;
  font-size: 12px;
}

.stats {
  margin: 15px 0;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #e9ecef;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  font-size: 13px;
}

.stat-label {
  color: #6c757d;
  font-weight: 500;
}

.stat-value {
  color: #495057;
  font-weight: 600;
}

.table-container {
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.performance-panel {
  margin: 20px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.performance-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.metric-group {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.metric-group h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.metric-item {
  margin: 5px 0;
  font-size: 13px;
  color: #6c757d;
}

.recent-operations {
  max-height: 150px;
  overflow-y: auto;
}

.operation-item {
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
  font-size: 12px;
}

.operation-item:last-child {
  border-bottom: none;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.operation-name {
  color: #333;
  font-weight: 500;
  flex: 1;
}

.operation-time {
  color: #007bff;
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.operation-details {
  margin: 4px 0;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 11px;
}

.phase-item {
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
}

.phase-label {
  color: #6c757d;
}

.phase-time {
  color: #495057;
  font-weight: 500;
}

.operation-memory {
  color: #28a745;
  font-size: 11px;
  text-align: right;
  margin-top: 2px;
}
</style>
