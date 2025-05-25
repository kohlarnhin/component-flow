# ComponentFlow

<div align="center">

![ComponentFlow Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=ComponentFlow)

**ComponentFlow** - A Modern Visual Low-Code Platform | 新一代可视化低代码平台

[![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Language**: [English](#english) | [中文](#中文)

[🌐 Live Demo](https://kohlarnhin.github.io/component-flow) • [📖 Documentation](https://github.com/kohlarnhin/component-flow/wiki) • [🐛 Issues](https://github.com/kohlarnhin/component-flow/issues)

</div>

---

## English

### ✨ Overview

ComponentFlow is a modern visual low-code platform built with Vue 3, TypeScript, and TailwindCSS. It enables both developers and non-technical users to rapidly build feature-rich web applications through intuitive drag-and-drop operations and visual configuration.

### 🎯 Key Features

- 🎨 **Drag & Drop Builder** - Intuitive component dragging and layout design
- 🔧 **Visual Configuration** - No-code property configuration panel
- 🚀 **Real-time Preview** - Instant application preview and API interaction
- 📱 **Responsive Design** - Adaptive to various screen sizes
- 🔗 **API Integration** - Complete HTTP request configuration and parameter binding
- 💾 **Page Management** - Save, load, and share page configurations
- 📦 **Rich Components** - 8+ basic components with continuous expansion

### 🚀 Quick Start

#### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0

#### Installation

```bash
# Clone the repository
git clone https://github.com/kohlarnhin/component-flow.git
cd component-flow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit [http://localhost:5173](http://localhost:5173) to start using ComponentFlow!

### 📦 Component Library

| Component | Description | Parameter Binding |
|-----------|-------------|-------------------|
| 📝 Text Input | Single-line text input | ✅ |
| 🔒 Password Input | Password input field | ✅ |
| 📄 Multiline Text | Textarea with array support | ✅ |
| 🔘 Boolean Select | Three-state boolean selector | ✅ |
| 🎯 Button | API request trigger | ✅ |
| 📊 Data List | Data display component | ❌ |
| 📋 Paginated Table | Sortable data table | ❌ |
| 💬 Response Display | API response recorder | ❌ |

### 🛠️ Tech Stack

- **Framework**: Vue 3.4+ (Composition API)
- **Type System**: TypeScript 5.0+
- **State Management**: Pinia
- **Styling**: TailwindCSS 3.0+
- **Build Tool**: Vite 5.0+
- **Routing**: Vue Router 4

### 🤝 Contributing

We welcome all forms of contributions!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 中文

### ✨ 项目简介

ComponentFlow 是一个基于 Vue 3、TypeScript 和 TailwindCSS 构建的现代化可视化低代码平台。通过直观的拖拽操作和可视化配置，让开发者和非技术人员都能快速构建功能丰富的Web应用。

### 🎯 核心特性

- 🎨 **拖拽式构建** - 直观的组件拖拽和布局设计
- 🔧 **可视化配置** - 无需编程的属性配置面板  
- 🚀 **实时预览** - 即时查看应用效果和API交互
- 📱 **响应式设计** - 自适应各种屏幕尺寸
- 🔗 **API集成** - 完整的HTTP请求配置和参数绑定
- 💾 **页面管理** - 保存、加载、分享页面配置
- 📦 **组件丰富** - 8+种基础组件，持续扩展

### 🚀 快速开始

#### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

#### 安装运行

```bash
# 克隆项目
git clone https://github.com/kohlarnhin/component-flow.git
cd component-flow

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

打开浏览器访问 [http://localhost:5173](http://localhost:5173) 开始使用！

### 📦 核心组件

| 组件类型 | 描述 | 参数绑定 |
|---------|------|---------|
| 📝 文本输入 | 单行文本输入框 | ✅ |
| 🔒 密码输入 | 密码输入框 | ✅ |
| 📄 多行文本 | 支持数组的文本域 | ✅ |
| 🔘 是否选择 | 三态布尔选择器 | ✅ |
| 🎯 按钮 | API请求触发器 | ✅ |
| 📊 数据列表 | 数据展示组件 | ❌ |
| 📋 分页表格 | 支持排序的数据表格 | ❌ |
| 💬 响应展示 | API响应记录展示 | ❌ |

### 🛠️ 技术架构

#### 技术栈

- **前端框架**: Vue 3.4+ (Composition API)
- **类型系统**: TypeScript 5.0+
- **状态管理**: Pinia
- **样式框架**: TailwindCSS 3.0+
- **构建工具**: Vite 5.0+
- **路由管理**: Vue Router 4

#### 项目结构

```
src/
├── components/           # 通用组件
│   └── userComponents/   # 用户组件模板
├── features/            # 功能模块
│   ├── canvas/          # 拖拽画布
│   ├── componentLibrary/ # 组件库
│   ├── configManager/   # 配置管理
│   ├── pageManager/     # 页面管理
│   ├── previewEngine/   # 预览引擎
│   └── propertiesPanel/ # 属性面板
├── stores/              # Pinia状态管理
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

### 📖 使用指南

#### 1. 创建应用

1. 从左侧组件库拖拽组件到画布
2. 选择组件，在右侧属性面板配置属性
3. 设置API请求参数绑定
4. 点击预览按钮测试应用

#### 2. 参数绑定

ComponentFlow 支持多种参数绑定类型：

```typescript
// 支持的参数类型
type ParameterType = 
  | 'query'      // URL查询参数
  | 'json'       // JSON请求体
  | 'form'       // 表单数据
  | 'path'       // 路径参数
  | 'header'     // 请求头
  | 'urlencoded' // URL编码请求体
  | 'basic-auth' // Basic认证
```

#### 3. 页面管理

- **保存页面**: 在预览界面点击保存按钮
- **加载页面**: 从页面管理器选择已保存页面
- **独立访问**: 通过 `/page/:pageId` 路径访问保存的页面

### 🎨 示例应用

#### OAuth2 登录示例

快速体验完整的OAuth2密码模式登录流程：

1. 用户名/密码输入
2. Grant Type/Scope配置  
3. Basic认证头生成
4. API请求发送
5. 响应结果展示

#### 分页表格示例

展示数据表格的高级功能：

1. 动态数据加载
2. 列排序交互
3. 分页导航
4. 搜索过滤

### 🤝 贡献指南

我们欢迎所有形式的贡献！

#### 开发贡献

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

#### 问题反馈

如果您发现了bug或有功能建议，请通过 [Issues](https://github.com/kohlarnhin/component-flow/issues) 告知我们。

#### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

### 📋 开发计划

#### 当前版本 (v0.0.1)

- ✅ 核心拖拽功能
- ✅ 基础组件库
- ✅ 参数绑定系统
- ✅ 预览引擎
- ✅ 页面管理

#### 下个版本 (v0.1.0)

- [ ] 更多组件类型
- [ ] 主题切换功能
- [ ] 组件市场
- [ ] 模板系统
- [ ] 移动端适配

#### 未来计划

- [ ] 数据库集成
- [ ] 用户权限系统
- [ ] 团队协作功能
- [ ] 插件系统
- [ ] 企业版功能

### 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

### 🙏 致谢

感谢以下优秀的开源项目：

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Pinia](https://pinia.vuejs.org/) - Vue状态管理库

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

Made with ❤️ by [kohlarnhin](https://github.com/kohlarnhin)

</div>
