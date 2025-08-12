# 项目部署指南

## 📋 项目信息

- **项目名称**: vue-project
- **技术栈**: Vue 3 + Vite + VXE-Table
- **构建工具**: Vite 4.5.14
- **Node.js 版本**: 22.18.0

## 🚀 快速部署

### 方法一：使用部署脚本（推荐）

```bash
# 完整部署流程（包含清理、安装、构建、报告生成）
npm run deploy
```

### 方法二：手动部署

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 预览构建结果
npm run preview
```

### 方法三：一键构建并预览

```bash
npm run deploy:build
```

## 📁 构建输出

构建完成后，所有文件将输出到 `dist/` 目录：

```
dist/
├── index.html              # 主页面
├── favicon.ico            # 网站图标
├── deploy-report.json     # 部署报告
└── assets/                # 静态资源
    ├── index-*.css        # 样式文件
    ├── vue-*.js           # Vue 核心库
    ├── vxe-*.js           # VXE-Table 库
    ├── utils-*.js         # 工具库
    └── iconfont-*.woff    # 字体文件
```

## 🔧 构建优化

### 代码分块策略

- **vue**: Vue 核心库单独打包
- **vxe**: VXE-Table 相关库单独打包
- **utils**: 工具库单独打包
- **index**: 应用主代码

### 性能优化

- ✅ 启用 Terser 压缩
- ✅ 代码分块优化
- ✅ 静态资源优化
- ✅ 字体文件优化

## 🌐 部署到服务器

### 静态文件服务器

将 `dist/` 目录中的所有文件上传到你的 Web 服务器即可。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache 配置示例

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # 静态资源缓存
    <LocationMatch "^/assets/.*\.(css|js|woff|ttf)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
</VirtualHost>
```

## 📊 部署报告

每次构建后会自动生成 `deploy-report.json` 文件，包含：

- 项目信息
- 构建时间
- 文件大小统计
- 文件列表

## 🔍 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **依赖版本冲突**
   ```bash
   # 检查依赖版本
   npm ls
   # 更新依赖
   npm update
   ```

3. **端口占用**
   ```bash
   # 查看端口占用
   netstat -ano | findstr :4173
   # 杀死进程
   taskkill /PID <进程ID> /F
   ```

## 📞 技术支持

如有问题，请检查：

1. Node.js 版本是否符合要求
2. 依赖是否正确安装
3. 构建日志中的错误信息
4. 浏览器控制台的错误信息

## 📝 更新日志

- **v0.0.0**: 初始版本
  - Vue 3 + Vite 基础配置
  - VXE-Table 集成
  - 虚拟列表示例
  - 部署脚本和文档 