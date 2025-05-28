import express from 'express'
import cors from 'cors'
import path from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// 初始化数据库
const dbPath = path.join(__dirname, 'lowcode_platform.db')
const db = new sqlite3.Database(dbPath)

// 设置数据库配置
db.exec('PRAGMA foreign_keys = ON') // 启用外键约束

// 创建表结构
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        // 创建组件库表
        db.run(`
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
          )
        `)

        // 创建页面表
        db.run(`
          CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            components_json TEXT NOT NULL,
            thumbnail TEXT,
            is_public INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `)

        // 创建页面标签表
        db.run(`
          CREATE TABLE IF NOT EXISTS page_tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_id INTEGER NOT NULL,
            tag TEXT NOT NULL,
            FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE,
            UNIQUE(page_id, tag)
          )
        `)

        // 创建组件使用统计表
        db.run(`
          CREATE TABLE IF NOT EXISTS component_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            component_id TEXT NOT NULL,
            usage_count INTEGER DEFAULT 0,
            last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (component_id) REFERENCES components (component_id) ON DELETE CASCADE
          )
        `)

        // 创建示例配置表
        db.run(`
          CREATE TABLE IF NOT EXISTS example_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT DEFAULT 'general',
            components_json TEXT NOT NULL,
            icon TEXT,
            is_system INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(name, category)
          )
        `)

        // 创建索引
        db.run(`CREATE INDEX IF NOT EXISTS idx_components_type ON components(type)`)
        db.run(`CREATE INDEX IF NOT EXISTS idx_components_category ON components(category)`)
        db.run(`CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at)`)
        db.run(`CREATE INDEX IF NOT EXISTS idx_page_tags_page_id ON page_tags(page_id)`)
        db.run(`CREATE INDEX IF NOT EXISTS idx_component_stats_component_id ON component_stats(component_id)`)
        db.run(`CREATE INDEX IF NOT EXISTS idx_example_configs_category ON example_configs(category)`)

        console.log('数据库表结构初始化完成')
        
        // 插入默认组件
        insertDefaultComponents()
        
        // 插入示例配置
        insertExampleConfigs()
        
        resolve()
        
      } catch (error) {
        console.error('数据库初始化失败:', error)
        reject(error)
      }
    })
  })
}

// 插入默认组件
function insertDefaultComponents() {
  const defaultComponents = [
    {
      component_id: 'text-input-template',
      name: '文本输入',
      type: 'text-input',
      icon: '📝',
      description: '单行文本输入框',
      category: 'form',
      config_json: JSON.stringify({
        type: 'text-input',
        label: '文本输入',
        placeholder: '请输入文本',
        required: false,
        disabled: false,
        defaultValue: '',
        maxLength: 100,
        parameterConfig: {
          type: 'json',
          fieldName: 'text_field'
        }
      }),
      is_system: 1
    },
    {
      component_id: 'password-input-template',
      name: '密码输入',
      type: 'password-input',
      icon: '🔒',
      description: '密码输入框',
      category: 'form',
      config_json: JSON.stringify({
        type: 'password-input',
        label: '密码',
        placeholder: '请输入密码',
        required: true,
        disabled: false,
        defaultValue: '',
        maxLength: 50,
        parameterConfig: {
          type: 'json',
          fieldName: 'password'
        }
      }),
      is_system: 1
    },
    {
      component_id: 'textarea-template',
      name: '多行文本',
      type: 'textarea',
      icon: '📄',
      description: '多行文本输入框',
      category: 'form',
      config_json: JSON.stringify({
        type: 'textarea',
        label: '多行文本',
        placeholder: '请输入多行文本',
        required: false,
        disabled: false,
        defaultValue: '',
        rows: 4,
        parameterConfig: {
          type: 'json',
          fieldName: 'content'
        }
      }),
      is_system: 1
    },
    {
      component_id: 'boolean-select-template',
      name: '是否选择器',
      type: 'boolean-select',
      icon: '☑️',
      description: '布尔值选择组件',
      category: 'form',
      config_json: JSON.stringify({
        type: 'boolean-select',
        label: '是否选择器',
        required: false,
        disabled: false,
        defaultValue: null,
        trueLabel: '是',
        falseLabel: '否',
        nullLabel: '未选择',
        allowNull: true,
        parameterConfig: {
          type: 'json',
          fieldName: 'enabled'
        }
      }),
      is_system: 1
    },
    {
      component_id: 'multiline-text-template',
      name: '多行文本输入',
      type: 'multiline-text',
      icon: '📝',
      description: '支持数组输入的多行文本框',
      category: 'form',
      config_json: JSON.stringify({
        type: 'multiline-text',
        label: '多行文本输入',
        placeholder: '每行输入一个值',
        required: false,
        disabled: false,
        defaultValue: '',
        parameterConfig: {
          type: 'json',
          fieldName: 'array_field'
        }
      }),
      is_system: 1
    },
    {
      component_id: 'button-template',
      name: '按钮',
      type: 'button',
      icon: '🔘',
      description: '可点击的按钮组件',
      category: 'action',
      config_json: JSON.stringify({
        type: 'button',
        label: '请求按钮',
        text: '发送请求',
        disabled: false,
        requestUrl: '',
        requestMethod: 'GET',
        confirmText: ''
      }),
      is_system: 1
    },
    {
      component_id: 'data-list-template',
      name: '数据列表',
      type: 'data-list',
      icon: '📋',
      description: '显示数据列表',
      category: 'display',
      config_json: JSON.stringify({
        type: 'data-list',
        label: '数据列表',
        apiUrl: '',
        columns: [
          { key: 'id', title: 'ID', sortable: true },
          { key: 'name', title: '名称', sortable: true }
        ],
        pageSize: 10
      }),
      is_system: 1
    },
    {
      component_id: 'response-display-template',
      name: '响应展示',
      type: 'response-display',
      icon: '📊',
      description: '显示API响应数据',
      category: 'display',
      config_json: JSON.stringify({
        type: 'response-display',
        label: '响应展示',
        format: 'json'
      }),
      is_system: 1
    },
    {
      component_id: 'paginated-table-template',
      name: '分页表格',
      type: 'paginated-table',
      icon: '📋',
      description: '带分页功能的数据表格',
      category: 'display',
      config_json: JSON.stringify({
        type: 'paginated-table',
        label: '分页表格',
        apiUrl: '/api/data',
        columns: [
          { key: 'id', title: 'ID', sortable: true },
          { key: 'name', title: '名称', sortable: true },
          { key: 'status', title: '状态', sortable: false }
        ],
        pageSize: 10,
        searchFields: ['name'],
        sortableFields: ['id', 'name']
      }),
      is_system: 1
    }
  ]

  // 使用普通的 db.run 而不是 prepare
  defaultComponents.forEach(comp => {
    db.run(`
      INSERT OR IGNORE INTO components 
      (component_id, name, type, icon, description, category, config_json, is_system)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      comp.component_id,
      comp.name,
      comp.type,
      comp.icon,
      comp.description,
      comp.category,
      comp.config_json,
      comp.is_system
    ], function(err) {
      if (err && !err.message.includes('UNIQUE constraint failed')) {
        console.error('插入组件失败:', err)
      }
    })
  })

  console.log('默认组件插入完成')
}

// 插入示例配置
function insertExampleConfigs() {
  const exampleConfigs = [
    {
      name: '基础表单示例',
      description: '包含文本输入、密码输入、布尔选择器和提交按钮的基础表单',
      category: 'form',
      icon: '📝',
      components_json: JSON.stringify([
        {
          id: 'text-input-1',
          config: {
            type: 'text-input',
            label: '用户名',
            placeholder: '请输入用户名',
            required: true,
            disabled: false,
            defaultValue: '',
            parameterConfig: {
              type: 'json',
              fieldName: 'username'
            }
          },
          order: 0
        },
        {
          id: 'password-input-1',
          config: {
            type: 'password-input',
            label: '密码',
            placeholder: '请输入密码',
            required: true,
            disabled: false,
            defaultValue: '',
            parameterConfig: {
              type: 'json',
              fieldName: 'password'
            }
          },
          order: 1
        },
        {
          id: 'boolean-select-1',
          config: {
            type: 'boolean-select',
            label: '记住我',
            required: false,
            disabled: false,
            defaultValue: false,
            trueLabel: '是',
            falseLabel: '否',
            nullLabel: '未选择',
            allowNull: false,
            parameterConfig: {
              type: 'json',
              fieldName: 'remember'
            }
          },
          order: 2
        },
        {
          id: 'button-1',
          config: {
            type: 'button',
            label: '登录按钮',
            text: '登录',
            disabled: false,
            requestUrl: '/api/login',
            requestMethod: 'POST',
            confirmText: '确定要登录吗？'
          },
          order: 3
        }
      ]),
      is_system: 1
    },
    {
      name: '分页表格示例',
      description: '演示如何使用分页表格组件进行数据展示，包含授权令牌、搜索条件和完整的表格配置',
      category: 'data',
      icon: '📊',
      components_json: JSON.stringify([
        {
          id: 'text-input-auth-token',
          config: {
            type: 'text-input',
            label: 'Authorization Token',
            placeholder: '请输入Bearer token（如：Bearer eyJhbGciOiJIUzI1NiIs...）',
            required: false,
            disabled: false,
            defaultValue: '',
            parameterConfig: {
              type: 'header',
              fieldName: 'authorization'
            }
          },
          order: 0
        },
        {
          id: 'text-input-search',
          config: {
            type: 'text-input',
            label: '编号或名称搜索',
            placeholder: '请输入配方编号或名称',
            required: false,
            disabled: false,
            defaultValue: '',
            parameterConfig: {
              type: 'json',
              fieldName: 'search.numberOrName'
            }
          },
          order: 1
        },
        {
          id: 'multiline-text-materials',
          config: {
            type: 'multiline-text',
            label: '物料编号列表',
            placeholder: '每行输入一个物料编号',
            required: false,
            disabled: false,
            parameterConfig: {
              type: 'json',
              fieldName: 'search.materialNumbers'
            }
          },
          order: 2
        },
        {
          id: 'boolean-select-enabled',
          config: {
            type: 'boolean-select',
            label: '是否启用',
            required: false,
            disabled: false,
            defaultValue: null,
            trueLabel: '启用',
            falseLabel: '禁用',
            nullLabel: '全部',
            allowNull: true,
            parameterConfig: {
              type: 'json',
              fieldName: 'search.enabled'
            }
          },
          order: 3
        },
        {
          id: 'paginated-table-1',
          config: {
            type: 'paginated-table',
            label: '茶配方管理表格',
            apiUrl: '/api/data/recipes',
            columns: [
              { key: 'id', title: 'ID', sortable: false },
              { key: 'number', title: '配方编号', sortable: false },
              { key: 'name', title: '配方名称', sortable: false },
              { key: 'materialNumber', title: '物料编号', sortable: false },
              { key: 'materialName', title: '物料名称', sortable: false },
              { key: 'theoryOutputMl', title: '理论产量(ml)', sortable: true },
              { key: 'teaBagCount', title: '茶包数量', sortable: true },
              { key: 'waterMl', title: '水量(ml)', sortable: true },
              { key: 'steepTimeSec', title: '浸泡时间(秒)', sortable: false },
              { key: 'temperature', title: '温度(°C)', sortable: false },
              { key: 'iceWaterMl', title: '冰水量(ml)', sortable: false },
              { key: 'enabled', title: '启用状态', sortable: false },
              { key: 'createTime', title: '创建时间', sortable: false },
              { key: 'remark', title: '备注', sortable: false }
            ],
            pageSize: 10,
            searchFields: ['number', 'name', 'materialNumber', 'materialName'],
            sortableFields: ['theoryOutputMl', 'teaBagCount', 'waterMl']
          },
          order: 4
        },
        {
          id: 'response-display-1',
          config: {
            type: 'response-display',
            label: '搜索结果',
            format: 'json'
          },
          order: 5
        }
      ]),
      is_system: 1
    }
  ]

  // 插入示例配置
  exampleConfigs.forEach(config => {
    db.run(`
      INSERT OR IGNORE INTO example_configs 
      (name, description, category, components_json, icon, is_system)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      config.name,
      config.description,
      config.category,
      config.components_json,
      config.icon,
      config.is_system
    ], function(err) {
      if (err && !err.message.includes('UNIQUE constraint failed')) {
        console.error('插入示例配置失败:', err)
      }
    })
  })

  console.log('示例配置插入完成')
}

// === 组件相关API ===

// 获取所有组件
app.get('/api/components', (req, res) => {
  db.all(`
    SELECT * FROM components 
    ORDER BY is_system DESC, category ASC, name ASC
  `, (err, rows) => {
    if (err) {
      console.error('获取组件失败:', err)
      res.status(500).json({ error: '获取组件失败' })
      return
    }

    const result = rows.map(comp => ({
      ...comp,
      config: JSON.parse(comp.config_json),
      is_system: !!comp.is_system
    }))

    res.json(result)
  })
})

// 根据类型获取组件
app.get('/api/components/type/:type', (req, res) => {
  const { type } = req.params
  
  db.all(`
    SELECT * FROM components 
    WHERE type = ? 
    ORDER BY name ASC
  `, [type], (err, rows) => {
    if (err) {
      console.error('获取组件失败:', err)
      res.status(500).json({ error: '获取组件失败' })
      return
    }

    const result = rows.map(comp => ({
      ...comp,
      config: JSON.parse(comp.config_json),
      is_system: !!comp.is_system
    }))

    res.json(result)
  })
})

// 获取组件详细信息（用于文档）
app.get('/api/components/:id/info', (req, res) => {
  const { id } = req.params
  
  db.get(`
    SELECT c.*, cs.usage_count, cs.last_used_at
    FROM components c
    LEFT JOIN component_stats cs ON c.component_id = cs.component_id
    WHERE c.id = ? OR c.component_id = ?
  `, [id, id], (err, row) => {
    if (err) {
      console.error('获取组件信息失败:', err)
      res.status(500).json({ error: '获取组件信息失败' })
      return
    }

    if (!row) {
      res.status(404).json({ error: '组件不存在' })
      return
    }

    const componentInfo = {
      id: row.id,
      component_id: row.component_id,
      name: row.name,
      type: row.type,
      icon: row.icon,
      description: row.description,
      category: row.category,
      config: JSON.parse(row.config_json),
      is_system: !!row.is_system,
      created_at: row.created_at,
      updated_at: row.updated_at,
      usage_count: row.usage_count || 0,
      last_used_at: row.last_used_at,
      // 添加组件说明文档
      documentation: generateComponentDocumentation(row.type, JSON.parse(row.config_json))
    }

    res.json(componentInfo)
  })
})

// 生成组件文档
function generateComponentDocumentation(type, config) {
  const docs = {
    'text-input': {
      title: '文本输入组件',
      description: '单行文本输入框，支持各种文本输入验证和格式化',
      properties: [
        { name: 'label', type: 'string', description: '输入框标签' },
        { name: 'placeholder', type: 'string', description: '占位符文本' },
        { name: 'required', type: 'boolean', description: '是否必填' },
        { name: 'disabled', type: 'boolean', description: '是否禁用' },
        { name: 'defaultValue', type: 'string', description: '默认值' },
        { name: 'maxLength', type: 'number', description: '最大字符长度' }
      ],
      usage: '用于收集用户的文本输入，如姓名、标题等单行文本信息',
      examples: [
        { name: '用户名输入', config: { label: '用户名', placeholder: '请输入用户名', required: true } },
        { name: '邮箱输入', config: { label: '邮箱', placeholder: '请输入邮箱地址', required: true, maxLength: 100 } }
      ]
    },
    'password-input': {
      title: '密码输入组件',
      description: '密码输入框，自动隐藏输入内容',
      properties: [
        { name: 'label', type: 'string', description: '输入框标签' },
        { name: 'placeholder', type: 'string', description: '占位符文本' },
        { name: 'required', type: 'boolean', description: '是否必填' },
        { name: 'disabled', type: 'boolean', description: '是否禁用' },
        { name: 'maxLength', type: 'number', description: '最大字符长度' }
      ],
      usage: '用于收集密码、PIN码等敏感信息的输入',
      examples: [
        { name: '登录密码', config: { label: '密码', placeholder: '请输入密码', required: true } },
        { name: '确认密码', config: { label: '确认密码', placeholder: '请再次输入密码', required: true } }
      ]
    },
    'textarea': {
      title: '多行文本组件',
      description: '多行文本输入框，适用于较长的文本内容',
      properties: [
        { name: 'label', type: 'string', description: '输入框标签' },
        { name: 'placeholder', type: 'string', description: '占位符文本' },
        { name: 'required', type: 'boolean', description: '是否必填' },
        { name: 'disabled', type: 'boolean', description: '是否禁用' },
        { name: 'defaultValue', type: 'string', description: '默认值' },
        { name: 'rows', type: 'number', description: '显示行数' }
      ],
      usage: '用于收集较长的文本内容，如描述、评论、备注等',
      examples: [
        { name: '商品描述', config: { label: '商品描述', placeholder: '请输入商品详细描述', rows: 5 } },
        { name: '用户评论', config: { label: '评论内容', placeholder: '请输入您的评论', required: false } }
      ]
    },
    'multiline-text': {
      title: '多行文本输入组件',
      description: '支持数组输入的多行文本框，每行作为数组的一个元素',
      properties: [
        { name: 'label', type: 'string', description: '输入框标签' },
        { name: 'placeholder', type: 'string', description: '占位符文本' },
        { name: 'required', type: 'boolean', description: '是否必填' },
        { name: 'disabled', type: 'boolean', description: '是否禁用' },
        { name: 'defaultValue', type: 'string', description: '默认值' }
      ],
      usage: '用于收集多个相关项目的输入，如标签列表、物料编号列表等，每行输入一个值',
      examples: [
        { name: '物料编号列表', config: { label: '物料编号列表', placeholder: '每行输入一个物料编号' } },
        { name: '标签列表', config: { label: '标签', placeholder: '每行输入一个标签' } }
      ]
    },
    'boolean-select': {
      title: '布尔选择组件',
      description: '三状态选择器，支持真/假/空值选择',
      properties: [
        { name: 'label', type: 'string', description: '选择器标签' },
        { name: 'trueLabel', type: 'string', description: '真值显示文本' },
        { name: 'falseLabel', type: 'string', description: '假值显示文本' },
        { name: 'nullLabel', type: 'string', description: '空值显示文本' },
        { name: 'allowNull', type: 'boolean', description: '是否允许空值' },
        { name: 'defaultValue', type: 'boolean|null', description: '默认值' }
      ],
      usage: '用于收集是/否/未知类型的选择，如开关状态、确认选项等',
      examples: [
        { name: '记住我', config: { label: '记住我', trueLabel: '是', falseLabel: '否', allowNull: false } },
        { name: '启用状态', config: { label: '是否启用', trueLabel: '启用', falseLabel: '禁用', nullLabel: '未设置', allowNull: true } }
      ]
    },
    'button': {
      title: '按钮组件',
      description: '可点击的操作按钮，支持API请求',
      properties: [
        { name: 'text', type: 'string', description: '按钮文本' },
        { name: 'requestUrl', type: 'string', description: '请求URL' },
        { name: 'requestMethod', type: 'string', description: '请求方法(GET/POST/PUT/DELETE)' },
        { name: 'confirmText', type: 'string', description: '确认提示文本' },
        { name: 'disabled', type: 'boolean', description: '是否禁用' }
      ],
      usage: '用于触发操作，如提交表单、发送请求、执行命令等',
      examples: [
        { name: '提交按钮', config: { text: '提交', requestUrl: '/api/submit', requestMethod: 'POST' } },
        { name: '删除按钮', config: { text: '删除', requestUrl: '/api/delete', requestMethod: 'DELETE', confirmText: '确定要删除吗？' } }
      ]
    },
    'data-list': {
      title: '数据列表组件',
      description: '简单的数据展示列表，支持基本的分页功能',
      properties: [
        { name: 'label', type: 'string', description: '列表标签' },
        { name: 'apiUrl', type: 'string', description: '数据接口URL' },
        { name: 'columns', type: 'array', description: '列表列配置' },
        { name: 'pageSize', type: 'number', description: '每页显示数量' }
      ],
      usage: '用于展示简单的数据列表，适合数据量较少的场景',
      examples: [
        { 
          name: '用户列表', 
          config: { 
            label: '用户列表',
            apiUrl: '/api/users',
            columns: [
              { key: 'id', title: 'ID', sortable: true },
              { key: 'name', title: '姓名', sortable: true }
            ],
            pageSize: 10
          } 
        }
      ]
    },
    'response-display': {
      title: '响应展示组件',
      description: '显示API响应数据，支持多种格式',
      properties: [
        { name: 'label', type: 'string', description: '展示区域标签' },
        { name: 'format', type: 'string', description: '展示格式(json/text/table)' }
      ],
      usage: '用于展示API返回的数据，调试接口响应等',
      examples: [
        { name: 'JSON响应', config: { label: 'API响应', format: 'json' } },
        { name: '表格数据', config: { label: '查询结果', format: 'table' } }
      ]
    },
    'paginated-table': {
      title: '分页表格组件',
      description: '带分页、搜索、排序功能的数据表格',
      properties: [
        { name: 'label', type: 'string', description: '表格标签' },
        { name: 'apiUrl', type: 'string', description: '数据接口URL' },
        { name: 'columns', type: 'array', description: '表格列配置' },
        { name: 'pageSize', type: 'number', description: '每页显示数量' },
        { name: 'searchFields', type: 'array', description: '可搜索字段' },
        { name: 'sortableFields', type: 'array', description: '可排序字段' }
      ],
      usage: '用于展示大量结构化数据，支持分页浏览、搜索过滤、排序等功能',
      examples: [
        { 
          name: '用户列表', 
          config: { 
            label: '用户管理', 
            apiUrl: '/api/users',
            columns: [
              { key: 'id', title: 'ID', sortable: true },
              { key: 'name', title: '姓名', sortable: true },
              { key: 'email', title: '邮箱', sortable: false }
            ],
            pageSize: 10
          } 
        }
      ]
    }
  }

  const componentDoc = docs[type] || {
    title: '未知组件',
    description: '暂无文档',
    properties: [],
    usage: '暂无说明',
    examples: []
  }

  return {
    ...componentDoc,
    currentConfig: config
  }
}

// 添加自定义组件
app.post('/api/components', (req, res) => {
  const { component_id, name, type, icon, description, category, config } = req.body

  db.run(`
    INSERT INTO components 
    (component_id, name, type, icon, description, category, config_json, is_system)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `, [
    component_id,
    name,
    type,
    icon || '🔧',
    description || '',
    category || 'custom',
    JSON.stringify(config)
  ], function(err) {
    if (err) {
      console.error('添加组件失败:', err)
      res.status(500).json({ error: '添加组件失败' })
      return
    }

    res.json({ id: this.lastID })
  })
})

// 更新组件
app.put('/api/components/:id', (req, res) => {
  const { id } = req.params
  const { name, icon, description, category, config } = req.body

  db.run(`
    UPDATE components 
    SET name = ?, icon = ?, description = ?, category = ?, config_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND is_system = 0
  `, [
    name,
    icon,
    description,
    category,
    JSON.stringify(config),
    id
  ], function(err) {
    if (err) {
      console.error('更新组件失败:', err)
      res.status(500).json({ error: '更新组件失败' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: '组件不存在或无法修改系统组件' })
      return
    }

    res.json({ success: true })
  })
})

// 删除自定义组件
app.delete('/api/components/:id', (req, res) => {
  const { id } = req.params

  db.run(`
    DELETE FROM components 
    WHERE id = ? AND is_system = 0
  `, [id], function(err) {
    if (err) {
      console.error('删除组件失败:', err)
      res.status(500).json({ error: '删除组件失败' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: '组件不存在或无法删除系统组件' })
      return
    }

    res.json({ success: true })
  })
})

// === 页面相关API ===

// 获取所有页面
app.get('/api/pages', (req, res) => {
  db.all(`
    SELECT p.*, GROUP_CONCAT(pt.tag) as tags
    FROM pages p
    LEFT JOIN page_tags pt ON p.id = pt.page_id
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('获取页面失败:', err)
      res.status(500).json({ error: '获取页面失败' })
      return
    }

    const result = rows.map(page => ({
      ...page,
      components: JSON.parse(page.components_json),
      tags: page.tags ? page.tags.split(',') : [],
      is_public: !!page.is_public
    }))

    res.json(result)
  })
})

// 根据ID获取页面详情
app.get('/api/pages/:id', (req, res) => {
  const { id } = req.params
  
  db.get(`
    SELECT p.*, GROUP_CONCAT(pt.tag) as tags
    FROM pages p
    LEFT JOIN page_tags pt ON p.id = pt.page_id
    WHERE p.id = ?
    GROUP BY p.id
  `, [id], (err, row) => {
    if (err) {
      console.error('获取页面失败:', err)
      res.status(500).json({ error: '获取页面失败' })
      return
    }

    if (!row) {
      res.status(404).json({ error: '页面不存在' })
      return
    }

    const result = {
      ...row,
      components: JSON.parse(row.components_json),
      tags: row.tags ? row.tags.split(',') : [],
      is_public: !!row.is_public
    }

    res.json(result)
  })
})

// 保存页面
app.post('/api/pages', (req, res) => {
  const { name, description, components, thumbnail, is_public, tags } = req.body

  // 先插入页面
  db.run(`
    INSERT INTO pages (name, description, components_json, thumbnail, is_public)
    VALUES (?, ?, ?, ?, ?)
  `, [
    name,
    description || '',
    JSON.stringify(components),
    thumbnail || '',
    is_public !== false ? 1 : 0
  ], function(err) {
    if (err) {
      console.error('保存页面失败:', err)
      res.status(500).json({ error: '保存页面失败' })
      return
    }

    const pageId = this.lastID

    // 插入标签（如果有）
    if (tags && tags.length > 0) {
      let completed = 0
      let hasError = false

      tags.forEach(tag => {
        db.run(`
          INSERT INTO page_tags (page_id, tag) VALUES (?, ?)
        `, [pageId, tag], function(tagErr) {
          completed++
          if (tagErr && !tagErr.message.includes('UNIQUE constraint failed')) {
            hasError = true
            console.error('插入标签失败:', tagErr)
          }
          
          // 所有标签处理完成
          if (completed === tags.length) {
            res.json({ id: pageId })
          }
        })
      })
    } else {
      res.json({ id: pageId })
    }
  })
})

// 更新页面
app.put('/api/pages/:id', (req, res) => {
  const { id } = req.params
  const { name, description, components, thumbnail, is_public, tags } = req.body

  db.serialize(() => {
    db.run('BEGIN TRANSACTION')

    // 更新页面
    db.run(`
      UPDATE pages 
      SET name = ?, description = ?, components_json = ?, thumbnail = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name,
      description,
      JSON.stringify(components),
      thumbnail,
      is_public !== false ? 1 : 0,
      id
    ], function(err) {
      if (err) {
        console.error('更新页面失败:', err)
        db.run('ROLLBACK')
        res.status(500).json({ error: '更新页面失败' })
        return
      }

      if (this.changes === 0) {
        db.run('ROLLBACK')
        res.status(404).json({ error: '页面不存在' })
        return
      }

      // 删除旧标签
      db.run(`DELETE FROM page_tags WHERE page_id = ?`, [id], (err) => {
        if (err) {
          console.error('删除标签失败:', err)
          db.run('ROLLBACK')
          res.status(500).json({ error: '更新页面失败' })
          return
        }

        // 插入新标签
        if (tags && tags.length > 0) {
          const insertTagStmt = db.prepare(`
            INSERT INTO page_tags (page_id, tag) VALUES (?, ?)
          `)

          tags.forEach(tag => {
            insertTagStmt.run(id, tag)
          })

          insertTagStmt.finalize()
        }

        db.run('COMMIT')
        res.json({ success: true })
      })
    })
  })
})

// 删除页面
app.delete('/api/pages/:id', (req, res) => {
  const { id } = req.params

  db.run(`DELETE FROM pages WHERE id = ?`, [id], function(err) {
    if (err) {
      console.error('删除页面失败:', err)
      res.status(500).json({ error: '删除页面失败' })
      return
    }

    if (this.changes === 0) {
      res.status(404).json({ error: '页面不存在' })
      return
    }

    res.json({ success: true })
  })
})

// 搜索页面
app.get('/api/pages/search/:keyword', (req, res) => {
  const { keyword } = req.params
  const searchPattern = `%${keyword}%`

  db.all(`
    SELECT p.*, GROUP_CONCAT(pt.tag) as tags
    FROM pages p
    LEFT JOIN page_tags pt ON p.id = pt.page_id
    WHERE p.name LIKE ? OR p.description LIKE ?
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `, [searchPattern, searchPattern], (err, rows) => {
    if (err) {
      console.error('搜索页面失败:', err)
      res.status(500).json({ error: '搜索页面失败' })
      return
    }

    const result = rows.map(page => ({
      ...page,
      components: JSON.parse(page.components_json),
      tags: page.tags ? page.tags.split(',') : [],
      is_public: !!page.is_public
    }))

    res.json(result)
  })
})

// === 统计相关API ===

// 记录组件使用
app.post('/api/stats/usage', (req, res) => {
  const { component_id } = req.body

  // 先查询是否存在
  db.get(`SELECT * FROM component_stats WHERE component_id = ?`, [component_id], (err, row) => {
    if (err) {
      console.error('记录组件使用失败:', err)
      res.status(500).json({ error: '记录组件使用失败' })
      return
    }

    if (row) {
      // 更新使用次数
      db.run(`
        UPDATE component_stats 
        SET usage_count = usage_count + 1, last_used_at = CURRENT_TIMESTAMP 
        WHERE component_id = ?
      `, [component_id], (err) => {
        if (err) {
          console.error('更新组件使用失败:', err)
          res.status(500).json({ error: '记录组件使用失败' })
          return
        }
        res.json({ success: true })
      })
    } else {
      // 插入新记录
      db.run(`
        INSERT INTO component_stats (component_id, usage_count, last_used_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
      `, [component_id], (err) => {
        if (err) {
          console.error('插入组件使用失败:', err)
          res.status(500).json({ error: '记录组件使用失败' })
          return
        }
        res.json({ success: true })
      })
    }
  })
})

// 获取组件使用统计
app.get('/api/stats/components', (req, res) => {
  db.all(`
    SELECT cs.*, c.name, c.type, c.icon
    FROM component_stats cs
    JOIN components c ON cs.component_id = c.component_id
    ORDER BY cs.usage_count DESC, cs.last_used_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('获取组件统计失败:', err)
      res.status(500).json({ error: '获取组件统计失败' })
      return
    }

    res.json(rows)
  })
})

// === 示例配置相关API ===

// 获取所有示例配置
app.get('/api/examples', (req, res) => {
  db.all(`
    SELECT id, name, description, category, components_json, icon, is_system, created_at
    FROM example_configs
    ORDER BY is_system DESC, created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('获取示例配置失败:', err)
      res.status(500).json({ error: '获取示例配置失败' })
      return
    }

    const result = rows.map(example => ({
      id: example.id,
      name: example.name,
      description: example.description,
      category: example.category,
      components: JSON.parse(example.components_json || '[]'),
      icon: example.icon,
      isSystem: example.is_system === 1,
      createdAt: example.created_at
    }))

    res.json(result)
  })
})

// 根据分类获取示例配置
app.get('/api/examples/category/:category', (req, res) => {
  const { category } = req.params
  
  db.all(`
    SELECT id, name, description, category, components_json, icon, is_system, created_at
    FROM example_configs
    WHERE category = ?
    ORDER BY is_system DESC, created_at DESC
  `, [category], (err, rows) => {
    if (err) {
      console.error('获取分类示例配置失败:', err)
      res.status(500).json({ error: '获取分类示例配置失败' })
      return
    }

    const result = rows.map(example => ({
      id: example.id,
      name: example.name,
      description: example.description,
      category: example.category,
      components: JSON.parse(example.components_json),
      icon: example.icon,
      isSystem: example.is_system === 1,
      createdAt: example.created_at
    }))

    res.json(result)
  })
})

// 获取单个示例配置
app.get('/api/examples/:id', (req, res) => {
  const { id } = req.params
  
  db.get(`
    SELECT id, name, description, category, components_json, icon, is_system, created_at
    FROM example_configs
    WHERE id = ?
  `, [id], (err, row) => {
    if (err) {
      console.error('获取示例配置失败:', err)
      res.status(500).json({ error: '获取示例配置失败' })
      return
    }

    if (!row) {
      res.status(404).json({ error: '示例配置不存在' })
      return
    }

    const result = {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      components: JSON.parse(row.components_json || '[]'),
      icon: row.icon,
      isSystem: row.is_system === 1,
      createdAt: row.created_at
    }

    res.json(result)
  })
})

// 处理SPA路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// 初始化数据库并启动服务器
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Vue3低代码平台服务器运行在 http://localhost:${PORT}`)
    console.log('📁 数据库文件：./lowcode_platform.db')
    console.log('🎯 访问应用：http://localhost:' + PORT)
    console.log('📊 API接口：http://localhost:' + PORT + '/api')
  })
}).catch(error => {
  console.error('❌ 服务器启动失败:', error)
  process.exit(1)
})