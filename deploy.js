#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// 部署脚本
class Deployer {
  constructor() {
    this.projectRoot = process.cwd()
    this.distPath = path.join(this.projectRoot, 'dist')
  }

  // 清理构建目录
  clean() {
    console.log('🧹 清理构建目录...')
    if (fs.existsSync(this.distPath)) {
      fs.rmSync(this.distPath, { recursive: true, force: true })
    }
  }

  // 安装依赖
  install() {
    console.log('📦 安装依赖...')
    try {
      execSync('npm install', { stdio: 'inherit' })
    } catch (error) {
      console.error('❌ 依赖安装失败:', error.message)
      process.exit(1)
    }
  }

  // 构建项目
  build() {
    console.log('🔨 构建项目...')
    try {
      execSync('npm run build', { stdio: 'inherit' })
    } catch (error) {
      console.error('❌ 构建失败:', error.message)
      process.exit(1)
    }
  }

  // 生成部署报告
  generateReport() {
    console.log('📊 生成部署报告...')
    
    const buildTime = new Date().toISOString()
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    const report = {
      project: packageJson.name,
      version: packageJson.version,
      buildTime,
      buildInfo: {
        totalSize: this.getDirSize(this.distPath),
        files: this.getFileList(this.distPath)
      }
    }
    
    fs.writeFileSync(
      path.join(this.distPath, 'deploy-report.json'),
      JSON.stringify(report, null, 2)
    )
    
    console.log('✅ 部署报告已生成')
  }

  // 获取目录大小
  getDirSize(dirPath) {
    let totalSize = 0
    const files = fs.readdirSync(dirPath)
    
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isDirectory()) {
        totalSize += this.getDirSize(filePath)
      } else {
        totalSize += stats.size
      }
    }
    
    return totalSize
  }

  // 获取文件列表
  getFileList(dirPath, basePath = '') {
    const files = []
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      const relativePath = path.join(basePath, item)
      const stats = fs.statSync(itemPath)
      
      if (stats.isDirectory()) {
        files.push(...this.getFileList(itemPath, relativePath))
      } else {
        files.push({
          name: relativePath,
          size: stats.size,
          sizeFormatted: this.formatFileSize(stats.size)
        })
      }
    }
    
    return files
  }

  // 格式化文件大小
  formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  // 启动预览服务器
  preview() {
    console.log('🚀 启动预览服务器...')
    console.log('📱 访问地址: http://localhost:4173')
    try {
      execSync('npm run preview', { stdio: 'inherit' })
    } catch (error) {
      console.error('❌ 预览服务器启动失败:', error.message)
    }
  }

  // 执行完整部署流程
  deploy() {
    console.log('🚀 开始部署流程...')
    console.log('=' * 50)
    
    this.clean()
    this.install()
    this.build()
    this.generateReport()
    
    console.log('=' * 50)
    console.log('✅ 部署完成！')
    console.log(`📁 构建输出目录: ${this.distPath}`)
    
    // 询问是否启动预览服务器
    console.log('\n是否启动预览服务器？(y/n)')
    process.stdin.once('data', (data) => {
      const answer = data.toString().trim().toLowerCase()
      if (answer === 'y' || answer === 'yes') {
        this.preview()
      } else {
        console.log('👋 部署流程结束')
        process.exit(0)
      }
    })
  }
}

// 执行部署
const deployer = new Deployer()
deployer.deploy() 