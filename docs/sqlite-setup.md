# SQLite 数据库后端设置指南

## 概述

本项目现在使用真正的 SQLite 数据库存储，通过 Node.js 后端服务器提供 API 接口。

## 安装依赖

```bash
# 安装所有依赖
npm install
```

## 启动方式

### 1. 开发模式（推荐）

同时启动后端服务器和前端开发服务器：

```bash
npm run dev:full
```

这将：
- 在 `http://localhost:3001` 启动后端服务器
- 在 `http://localhost:5173` 启动前端开发服务器
- 自动创建 SQLite 数据库文件 `lowcode_platform.db`

### 2. 分别启动

**启动后端服务器：**
```bash
npm run server
```

**启动前端（另开终端）：**
```bash
npm run dev
```

### 3. 生产模式

```bash
npm run start
```

这将先构建前端，然后启动服务器。

## 数据库文件

- **位置**: `./lowcode_platform.db`
- **格式**: SQLite 数据库文件
- **初始化**: 服务器启动时自动创建表结构和默认数据

## API 端点

后端提供以下 REST API：

### 组件相关
- `GET /api/components` - 获取所有组件
- `GET /api/components/type/:type` - 根据类型获取组件
- `POST /api/components` - 添加自定义组件
- `PUT /api/components/:id` - 更新组件
- `DELETE /api/components/:id` - 删除组件

### 页面相关
- `GET /api/pages` - 获取所有页面
- `GET /api/pages/:id` - 获取页面详情
- `POST /api/pages` - 保存页面
- `PUT /api/pages/:id` - 更新页面
- `DELETE /api/pages/:id` - 删除页面
- `GET /api/pages/search/:keyword` - 搜索页面

### 统计相关
- `POST /api/stats/usage` - 记录组件使用
- `GET /api/stats/components` - 获取组件使用统计

## 技术架构

### 后端技术栈
- **Express.js**: Web 服务器框架
- **better-sqlite3**: SQLite 数据库驱动
- **CORS**: 跨域资源共享
- **Path**: 文件路径处理

### 前端集成
- 前端通过 HTTP API 与后端通信
- 支持开发和生产环境的不同 API 地址
- 异步操作保证界面响应性

## 数据库特性

### 性能优化
- WAL 模式提高并发性能
- 创建索引优化查询速度
- 事务操作确保数据一致性

### 数据完整性
- 外键约束确保关联关系
- 唯一约束防止重复数据
- 级联删除维护数据一致性

### 存储设计
- JSON 格式存储组件配置
- 标签系统支持页面分类
- 使用统计记录组件热度

## 开发注意事项

### 环境变量
- 生产环境：API_BASE_URL 为空（同域）
- 开发环境：API_BASE_URL 为 `http://localhost:3001`

### 错误处理
- 网络错误自动捕获
- 数据库操作错误处理
- 前端友好的错误提示

### 数据迁移
如果之前使用 localStorage 存储数据，需要手动迁移：
1. 导出现有页面配置
2. 通过新的 API 重新导入
3. 删除旧的 localStorage 数据

## 故障排除

### 端口冲突
如果 3001 端口被占用，修改 `server.js` 中的 PORT 变量。

### 数据库权限
确保项目目录有写入权限，用于创建数据库文件。

### CORS 问题
如果遇到跨域问题，检查 `server.js` 中的 CORS 配置。

### 数据库损坏
如果数据库文件损坏，删除 `lowcode_platform.db` 文件，重启服务器会自动重建。

## 备份与恢复

### 数据备份
```bash
# 复制数据库文件
cp lowcode_platform.db backup_$(date +%Y%m%d).db
```

### 数据恢复
```bash
# 恢复数据库文件
cp backup_20240101.db lowcode_platform.db
```

### SQL 导出
```bash
# 使用 sqlite3 命令行工具
sqlite3 lowcode_platform.db .dump > backup.sql
```

## 扩展开发

### 添加新的 API 端点
1. 在 `server.js` 中添加路由处理
2. 在 `src/utils/database.ts` 中添加前端调用方法
3. 在相应的 store 中集成新功能

### 数据库结构修改
1. 在 `server.js` 的 `initDatabase()` 函数中添加 DDL
2. 更新 `docs/database-schema.md` 文档
3. 考虑数据迁移策略

## 相关文档

- [数据库表结构文档](./database-schema.md)
- [API 接口文档](../README.md)
- [前端组件文档](../src/components/README.md) 