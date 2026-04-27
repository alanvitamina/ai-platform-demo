import type { ArchitectureLayer } from './types';

export const architectureLayers: ArchitectureLayer[] = [
  {
    name: '用户接入层',
    nameEn: 'ACCESS LAYER',
    icon: '📡',
    color: '#00b4ff',
    items: [
      { title: '飞书机器人', desc: '群聊 @机器人 / 单聊 / 卡片交互 · 600人主入口' },
      { title: '飞书 AI 助手', desc: '注册为飞书原生 AI 工具' },
      { title: 'Web 控制台', desc: 'Agent 搭建 / 工作流编排 / 知识库管理' },
      { title: 'API / Webhook', desc: '对接第三方业务系统' },
    ],
  },
  {
    name: 'Agent 编排层',
    nameEn: 'AGENT ORCHESTRATION',
    icon: '🧠',
    color: '#a78bfa',
    items: [
      { title: '标准运行时接口', desc: '输入输出 / 工具调用 / 记忆读写 / 审批回调' },
      { title: '工作流编排引擎', desc: 'DAG 画布 · 分支/并行/循环 (Dify)' },
      { title: '多 Agent 协作', desc: '消息传递 · 任务分解与聚合' },
      { title: '低代码搭建', desc: '可视化配置 · 非技术人员可自建 Agent' },
    ],
  },
  {
    name: '能力支撑层',
    nameEn: 'CAPABILITY LAYER',
    icon: '⚙️',
    color: '#00e5c8',
    items: [
      { title: 'RAG 引擎', desc: '混合检索 + Reranker + 引用溯源' },
      { title: '工具市场', desc: 'OpenAPI 3.0 + MCP 协议双注册' },
      { title: '记忆管理', desc: 'Redis会话/PostgreSQL画像/向量+图库' },
      { title: '人机协同审批', desc: '资金/消息/数据变更 强制确认' },
    ],
  },
  {
    name: '模型网关层',
    nameEn: 'MODEL GATEWAY + SECURITY + COST',
    icon: '🔐',
    color: '#ff8c42',
    items: [
      { title: '统一路由', desc: 'OpenAI兼容 · 智能选模型 · 自动Fallback' },
      { title: '脱敏/反脱敏引擎', desc: '正则+NER+词典 · Redis映射表' },
      { title: '成本追踪', desc: '按人/部门/Agent/模型 · 预算预警' },
    ],
  },
  {
    name: '基础设施层',
    nameEn: 'INFRASTRUCTURE + DATA LAYER',
    icon: '🏗️',
    color: '#34d399',
    items: [
      { title: '身份认证', desc: '飞书SSO / LDAP / 组织架构同步' },
      { title: '可观测性', desc: 'LangFuse + Grafana + Prometheus' },
      { title: '数据存储引擎', desc: 'PostgreSQL · Milvus · TDengine · Neo4j' },
      { title: '容器编排', desc: 'Kubernetes + Docker · Helm Charts' },
    ],
  },
];
