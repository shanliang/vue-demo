# Vue 3 演示项目

一个综合的 Vue 3 演示项目，包含 nextTick vs onUpdated 对比、VXE Table 4.x 使用示例和虚拟列表实现。

## 🚀 项目特性

- **Vue 3 Composition API**：使用最新的 Vue 3 语法
- **VXE Table 4.x**：高性能表格组件演示
- **虚拟滚动**：大数据量表格性能优化
- **性能监控**：启用 Vue 性能监控
- **响应式设计**：现代化的 UI 界面

## 📦 技术栈

- **Vue 3.5.13** - 渐进式 JavaScript 框架
- **Vite 4.5.14** - 下一代前端构建工具
- **VXE Table 4.15.6** - 基于 Vue 的 PC 端表格组件
- **XE Utils 3.7.8** - 工具函数库
- **Day.js 1.11.13** - 轻量级日期处理库

## 🎯 功能模块

### 1. nextTick vs onUpdated 对比演示

**核心区别：**

- **nextTick**：手动调用，确保在 DOM 更新后执行特定代码
- **onUpdated**：自动触发，每次组件更新都会执行

**执行顺序：**
```
用户操作 → 数据变化 → DOM 更新 → nextTick 回调 → onUpdated 钩子
```

**实际应用场景：**
- **nextTick**：DOM 操作、第三方库集成、精确控制
- **onUpdated**：调试监控、全局副作用、性能监控

### 2. VXE Table 4.x 基础演示

**功能特性：**
- ✅ 表格数据展示（5条初始数据）
- ✅ 行选择
- ✅ 排序功能
- ✅ 分页支持
- ✅ 搜索过滤
- ✅ 列宽调整
- ✅ 导出功能

**操作功能：**
- 添加行：动态添加新数据
- 刷新数据：重新生成15条数据
- 清空数据：一键清空所有数据

### 3. 虚拟列表行更新演示

**性能优化：**
- **300条数据**：虚拟滚动展示
- **批量更新**：支持随机行和前10行批量更新
- **实时搜索**：按姓名或邮箱搜索
- **行编辑**：模态框编辑单行数据
- **状态管理**：不同状态的颜色标识

**操作功能：**
- 添加随机数据：每次添加10条
- 批量更新随机行：随机选择10行更新
- 批量更新前10行：固定更新前10行
- 生成300条数据：重新生成完整数据集
- 单行编辑/删除：精确的行操作

## 🛠️ 安装和运行

### 环境要求
- Node.js >= 16.20.2
- Yarn 或 npm

### 安装依赖
```bash
# 使用 yarn
yarn install

# 或使用 npm
npm install
```

### 启动开发服务器
```bash
# 使用 yarn
yarn dev

# 或使用 npm
npm run dev
```

### 构建生产版本
```bash
# 使用 yarn
yarn build

# 或使用 npm
npm run build
```

## 📁 项目结构

```
vue-demo/
├── src/
│   ├── components/
│   │   ├── VxeTableDemo.vue      # VXE Table 基础演示
│   │   └── VirtualTableDemo.vue  # 虚拟列表演示
│   ├── App.vue                   # 主应用组件
│   ├── main.js                   # 应用入口
│   └── assets/                   # 静态资源
├── public/                       # 公共资源
├── package.json                  # 项目配置
└── README.md                     # 项目说明
```

## 🎨 界面预览

### 导航界面
- 三个主要演示模块的切换按钮
- 响应式设计，支持不同屏幕尺寸

### nextTick vs onUpdated 演示
- 交互式按钮演示数据更新
- 实时日志显示执行顺序
- 详细的执行流程说明

### VXE Table 演示
- 简洁的表格展示
- 调试信息显示数据状态
- 基础操作按钮

### 虚拟列表演示
- 高性能大数据量表格
- 丰富的操作功能
- 状态标签和操作按钮

## 🔧 配置说明

### VXE Table 配置
```javascript
// main.js
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'

const app = createApp(App)
app.use(VXETable)
```

### 性能监控
```javascript
// main.js
app.config.performance = true
```

## 📊 性能特性

- **虚拟滚动**：只渲染可视区域的行，提升大数据量性能
- **响应式更新**：Vue 3 的响应式系统确保高效更新
- **组件懒加载**：按需加载不同演示模块
- **性能监控**：开发模式下启用性能监控

## 🐛 调试功能

- **控制台日志**：详细的操作日志
- **调试信息**：实时显示数据状态
- **Vue DevTools**：支持 Vue DevTools 调试
- **性能面板**：监控组件渲染性能

## 📝 最佳实践

### nextTick 使用
```javascript
async function updateData() {
  data.value = newData
  await nextTick()
  // DOM 已更新，可以安全操作
}
```

### onUpdated 使用
```javascript
onUpdated(() => {
  // 只用于观察，不要修改响应式数据
  console.log('组件已更新')
})
```

### VXE Table 使用
```vue
<vxe-table :data="tableData" height="400" border stripe>
  <vxe-column field="id" title="ID" width="80"></vxe-column>
  <vxe-column field="name" title="姓名" width="120"></vxe-column>
</vxe-table>
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [VXE Table](https://vxetable.cn/) - 基于 Vue 的 PC 端表格组件
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
