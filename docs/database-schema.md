# 数据库表结构设计文档

## 概述

本低代码平台使用 SQLite 数据库进行本地数据持久化存储，主要存储组件库配置和用户创建的页面数据。

## 表结构设计

### 1. 组件库表 (components)

存储所有组件模板的配置信息，包括系统内置组件和用户自定义组件。

```sql
CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 自增主键
  component_id TEXT UNIQUE NOT NULL,           -- 组件唯一标识
  name TEXT NOT NULL,                          -- 组件名称
  type TEXT NOT NULL,                          -- 组件类型 (text-input, button等)
  icon TEXT,                                   -- 组件图标 (emoji)
  description TEXT,                            -- 组件描述
  category TEXT DEFAULT 'custom',              -- 组件分类 (form, action, display等)
  config_json TEXT NOT NULL,                   -- 组件配置JSON (包含默认属性)
  is_system INTEGER DEFAULT 0,                 -- 是否为系统组件 (1:系统, 0:自定义)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);
```

### 2. 页面表 (pages)

存储用户创建的页面配置，包含完整的组件布局信息。

```sql
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 自增主键
  name TEXT NOT NULL,                          -- 页面名称
  description TEXT,                            -- 页面描述
  components_json TEXT NOT NULL,               -- 页面组件配置JSON
  thumbnail TEXT,                              -- 页面缩略图URL
  is_public INTEGER DEFAULT 1,                 -- 是否公开 (1:公开, 0:私有)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 创建时间
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   -- 更新时间
);
```

### 3. 页面标签表 (page_tags)

存储页面的标签信息，支持多对多关系。

```sql
CREATE TABLE IF NOT EXISTS page_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 自增主键
  page_id INTEGER NOT NULL,                    -- 页面ID (外键)
  tag TEXT NOT NULL,                           -- 标签名称
  FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
  UNIQUE(page_id, tag)                         -- 防止重复标签
);
```

### 4. 组件使用统计表 (component_stats)

记录组件的使用频率和最后使用时间，用于优化组件排序。

```sql
CREATE TABLE IF NOT EXISTS component_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,        -- 自增主键
  component_id TEXT NOT NULL,                  -- 组件ID (外键)
  usage_count INTEGER DEFAULT 0,               -- 使用次数
  last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 最后使用时间
  FOREIGN KEY (component_id) REFERENCES components (component_id) ON DELETE CASCADE
);
```

## 建表语句

### 创建所有表的完整脚本

```sql
-- 启用外键约束
PRAGMA foreign_keys = ON;

-- 创建组件库表
CREATE TABLE IF NOT EXISTS components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  category TEXT DEFAULT 'custom',
  config_json TEXT NOT NULL,
  is_system INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建页面表
CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  components_json TEXT NOT NULL,
  thumbnail TEXT,
  is_public INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建页面标签表
CREATE TABLE IF NOT EXISTS page_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id INTEGER NOT NULL,
  tag TEXT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
  UNIQUE(page_id, tag)
);

-- 创建组件使用统计表
CREATE TABLE IF NOT EXISTS component_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (component_id) REFERENCES components (component_id) ON DELETE CASCADE
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_components_type ON components(type);
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at);
CREATE INDEX IF NOT EXISTS idx_page_tags_page_id ON page_tags(page_id);
CREATE INDEX IF NOT EXISTS idx_component_stats_component_id ON component_stats(component_id);
```

## 初始数据插入

### 插入系统默认组件

```sql
-- 文本输入组件
INSERT OR IGNORE INTO components 
(component_id, name, type, icon, description, category, config_json, is_system)
VALUES (
  'text-input-template',
  '文本输入',
  'text-input',
  '📝',
  '单行文本输入框',
  'form',
  '{"type":"text-input","label":"文本输入","placeholder":"请输入文本","required":false,"disabled":false,"defaultValue":"","maxLength":100,"parameterConfig":{"type":"json","fieldName":"text_field"}}',
  1
);

-- 密码输入组件
INSERT OR IGNORE INTO components 
(component_id, name, type, icon, description, category, config_json, is_system)
VALUES (
  'password-input-template',
  '密码输入',
  'password-input',
  '🔒',
  '密码输入框',
  'form',
  '{"type":"password-input","label":"密码","placeholder":"请输入密码","required":true,"disabled":false,"defaultValue":"","maxLength":50,"parameterConfig":{"type":"json","fieldName":"password"}}',
  1
);

-- 按钮组件
INSERT OR IGNORE INTO components 
(component_id, name, type, icon, description, category, config_json, is_system)
VALUES (
  'button-template',
  '按钮',
  'button',
  '🔘',
  '可点击的按钮组件',
  'action',
  '{"type":"button","label":"请求按钮","text":"发送请求","disabled":false,"requestUrl":"","requestMethod":"GET","confirmText":""}',
  1
);

-- 响应展示组件
INSERT OR IGNORE INTO components 
(component_id, name, type, icon, description, category, config_json, is_system)
VALUES (
  'response-display-template',
  '响应展示',
  'response-display',
  '📊',
  '显示API响应数据',
  'display',
  '{"type":"response-display","label":"响应展示","format":"json"}',
  1
);
```

## 常用SQL操作示例

### 组件相关操作

```sql
-- 查询所有组件
SELECT * FROM components 
ORDER BY is_system DESC, category ASC, name ASC;

-- 根据类型查询组件
SELECT * FROM components 
WHERE type = 'text-input' 
ORDER BY name ASC;

-- 添加自定义组件
INSERT INTO components 
(component_id, name, type, icon, description, category, config_json, is_system)
VALUES (?, ?, ?, ?, ?, ?, ?, 0);

-- 更新组件信息
UPDATE components 
SET name = ?, description = ?, config_json = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ? AND is_system = 0;

-- 删除自定义组件
DELETE FROM components 
WHERE id = ? AND is_system = 0;
```

### 页面相关操作

```sql
-- 查询所有页面(包含标签)
SELECT p.*, GROUP_CONCAT(pt.tag) as tags
FROM pages p
LEFT JOIN page_tags pt ON p.id = pt.page_id
GROUP BY p.id
ORDER BY p.updated_at DESC;

-- 根据ID查询页面详情
SELECT p.*, GROUP_CONCAT(pt.tag) as tags
FROM pages p
LEFT JOIN page_tags pt ON p.id = pt.page_id
WHERE p.id = ?
GROUP BY p.id;

-- 保存新页面
INSERT INTO pages (name, description, components_json, thumbnail, is_public)
VALUES (?, ?, ?, ?, ?);

-- 为页面添加标签
INSERT INTO page_tags (page_id, tag) VALUES (?, ?);

-- 更新页面信息
UPDATE pages 
SET name = ?, description = ?, components_json = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- 删除页面
DELETE FROM pages WHERE id = ?;

-- 搜索页面
SELECT p.*, GROUP_CONCAT(pt.tag) as tags
FROM pages p
LEFT JOIN page_tags pt ON p.id = pt.page_id
WHERE p.name LIKE ? OR p.description LIKE ?
GROUP BY p.id
ORDER BY p.updated_at DESC;
```

### 统计相关操作

```sql
-- 记录组件使用(增加使用次数)
INSERT OR REPLACE INTO component_stats (component_id, usage_count, last_used_at)
VALUES (?, COALESCE((SELECT usage_count FROM component_stats WHERE component_id = ?), 0) + 1, CURRENT_TIMESTAMP);

-- 获取组件使用统计
SELECT cs.*, c.name, c.type, c.icon
FROM component_stats cs
JOIN components c ON cs.component_id = c.component_id
ORDER BY cs.usage_count DESC, cs.last_used_at DESC;

-- 获取最常用的组件
SELECT c.*, cs.usage_count
FROM components c
JOIN component_stats cs ON c.component_id = cs.component_id
ORDER BY cs.usage_count DESC
LIMIT 10;
```

## 数据完整性约束

1. **组件ID唯一性**: `component_id` 必须全局唯一
2. **外键约束**: 启用外键约束确保数据完整性
3. **级联删除**: 删除页面时自动删除相关标签
4. **唯一标签**: 同一页面不能有重复标签
5. **必填字段**: 组件名称、类型和配置为必填项

## 性能优化建议

1. **索引**: 为常查询字段创建索引
2. **分页**: 大量数据时使用 LIMIT 和 OFFSET 分页
3. **JSON查询**: 使用 SQLite 的 JSON 函数进行复杂查询
4. **事务**: 批量操作使用事务提高性能

## 备份与恢复

```sql
-- 导出数据到SQL文件
.output backup.sql
.dump

-- 从SQL文件恢复数据
.read backup.sql
```

## 注意事项

1. 数据库文件位置: `./lowcode_platform.db`
2. 使用 WAL 模式提高并发性能
3. 组件配置以 JSON 格式存储，保持灵活性
4. 系统组件不可删除，只能禁用
5. 页面数据支持标签分类和搜索 