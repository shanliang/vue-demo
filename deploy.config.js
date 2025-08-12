// 部署配置文件
export default {
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    // 资源基础路径
    base: './',
    // 是否生成 sourcemap
    sourcemap: false,
    // 压缩配置
    minify: 'terser',
    // 分块配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库单独打包
          vue: ['vue'],
          // 将 vxe-table 相关库单独打包
          vxe: ['vxe-table', 'vxe-table-plugin-element', 'xe-utils'],
          // 将 dayjs 单独打包
          utils: ['dayjs']
        }
      }
    }
  },
  
  // 服务器配置
  server: {
    // 预览端口
    port: 4173,
    // 是否自动打开浏览器
    open: true
  },
  
  // 部署信息
  deploy: {
    // 项目名称
    name: 'vue-project',
    // 版本号
    version: '0.0.0',
    // 构建时间
    buildTime: new Date().toISOString(),
    // 部署说明
    description: 'Vue 3 + Vite + VXE-Table 项目'
  }
} 