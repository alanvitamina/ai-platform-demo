import type { ArchitectureLayer } from './types';

export const architectureLayers: ArchitectureLayer[] = [
  {
    name: '用户接入层',
    nameEn: 'ACCESS LAYER',
    icon: '📡',
    color: '#00b4ff',
    items: [
      { title: '飞书机器人', desc: '群聊 @机器人 / 单聊 / 卡片消息 · 覆盖全员日常使用主入口' },
      { title: '飞书 AI 助手插件', desc: '注册为飞书原生 AI 工具 · 复用飞书 AI 交互体验' },
      { title: 'Web 控制台', desc: 'Agent 搭建 / 工作流编排 / 知识库管理 / 调试预览' },
      { title: 'API / Webhook', desc: '对接 SCADA / IoT 平台 / 第三方业务系统集成' },
    ],
  },
  {
    name: 'Agent 编排层（深度绑定 Dify + MCP 工具解耦）',
    nameEn: 'AGENT ORCHESTRATION · DIFY + MCP DECOUPLING',
    icon: '🧠',
    color: '#a78bfa',
    items: [
      { title: '🔧 Dify 深度绑定', desc: '工作流编排引擎（DAG 画布）· 多Agent协作调度 · 低代码搭建 · 条件分支/并行/循环 · 深度使用 Dify 原生 API' },
      { title: '📐 MCP 工具解耦', desc: '工具层通过 MCP 协议独立封装 · 行业标准工具协议 · 工具与编排引擎解耦 · Dify 已原生支持 MCP · 换引擎时工具层无需重写' },
      { title: '📐 工具调用接口（MCP）', desc: '工具层独立于编排引擎 · 标准协议统一注册与发现' },
      { title: '📐 记忆读写 & 审批回调', desc: '记忆服务独立部署 · 审批服务独立部署 · 生命周期管理（创建/部署/版本/回滚）' },
    ],
  },
  {
    name: '能力支撑层',
    nameEn: 'CAPABILITY LAYER',
    icon: '⚙️',
    color: '#00e5c8',
    items: [
      { title: 'RAG 引擎（含两阶段安全拦截）', desc: '混合检索（向量+关键词）+ Reranker + 引用溯源 · 🔴 检索后二次安全校验：检查检索结果数据级别 → 命中机密→动态熔断 → 切换本地模型/过滤片段/拒绝' },
      { title: '插件 / 工具市场', desc: 'OpenAPI 3.0 + MCP 协议双注册 · MCP 为行业标准工具协议 · 工具层与编排引擎解耦' },
      { title: '记忆管理（三层实现）', desc: '① 会话上下文→Redis ② 用户画像→PostgreSQL ③ 知识事实→向量库+图库' },
      { title: '安全护栏 Guardrails', desc: '输入输出审核 · 敏感词过滤 / 合规检查' },
      { title: '人机协同审批（平台级）', desc: '涉及资金/外部消息/生产数据变更 → 强制人工确认后执行 · 飞书审批流打通 · 超时自动降级' },
      { title: 'AI 可观测性与评估（平台级）', desc: 'Tracing 全链路记录 · Replay 一键回放 · Evaluation 质量自动评分 · Feedback 用户反馈 · Audit 审计追溯 · Drift 漂移检测告警' },
    ],
  },
  {
    name: '模型网关层（轻量脱敏 + 路由 + 成本）',
    nameEn: 'MODEL GATEWAY · LEAN & FAST',
    icon: '🔐',
    color: '#ff8c42',
    items: [
      { title: '🔀 统一路由 & 容错', desc: 'OpenAI 兼容 API · 按 Agent 配置路由 · 自动 Fallback/重试/断路器 · 核心使命：快' },
      { title: '🛡️ 轻量脱敏（同步链路·毫秒级）', desc: '正则规则：手机号/身份证 → 毫秒级 · 词典匹配：业务涉密关键词 → Redis 查询' },
      { title: '🧠 NER Sidecar 服务（独立部署）', desc: 'NER 实体识别拆为独立服务 · 人名/公司名/项目名/地址 · 独立扩缩容 · 不阻塞网关核心通路' },
      { title: '💰 成本追踪与优化（一级模块）', desc: '按人/部门/Agent/模型全维度 · 预算预警 · 模型降级策略 · 管理层 ROI 仪表盘' },
    ],
  },
  {
    name: '基础设施层',
    nameEn: 'INFRASTRUCTURE LAYER',
    icon: '🏗️',
    color: '#34d399',
    items: [
      { title: '身份认证', desc: '飞书 SSO / LDAP / 组织架构同步' },
      { title: '可观测性工具', desc: 'LangFuse（AI 可观测性核心引擎）· Grafana（可视化仪表盘+告警）· Prometheus（基础设施指标采集）' },
      { title: '消息 & 缓存', desc: 'Redis（会话记忆/脱敏映射）· RabbitMQ（异步任务）' },
      { title: '容器编排 & CI/CD', desc: 'Kubernetes + Docker · Helm Charts 一键部署 · CI/CD 自动化测试与发布 · 灰度发布/一键回滚' },
      { title: 'PostgreSQL [Phase 1·Day1]', desc: '业务数据 / 用户画像 / 工单 · 结构化数据库' },
      { title: 'Milvus/pgvector [Phase 1·Day1]', desc: 'RAG 语义检索 / 知识事实记忆 · 向量数据库' },
      { title: 'TDengine [Phase 2·对接设备]', desc: '设备运行 / 发电量 / 能耗曲线 · 时序数据库' },
      { title: 'Neo4j [Phase 3·知识图谱]', desc: '故障因果链 / 知识图谱 · 图数据库' },
    ],
  },
];
