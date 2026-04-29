import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Tag, Typography, Space, message, Row, Col, Tabs, Descriptions } from 'antd';
import { PlusOutlined, DatabaseOutlined, ApiOutlined, CloudServerOutlined, CheckCircleFilled, EyeOutlined } from '@ant-design/icons';
import { getKnowledgeBases, getDocuments, createDocument, deleteDocument, getTools, getDataSources } from '../../services/api';

const { Text, Title } = Typography;
const { TextArea } = Input;

const FALLBACK_KB = [
  { id: 1, name: '能源行业案例库', description: '综合能源服务典型项目案例', doc_count: 2 },
  { id: 2, name: '公司制度文档库', description: '人事、财务、行政管理制度', doc_count: 2 },
  { id: 3, name: '技术标准库', description: '国家标准、行业规范、内部技术标准', doc_count: 1 },
  { id: 4, name: '编码规范库', description: '软件开发编码规范和安全标准', doc_count: 1 },
  { id: 5, name: '客户沟通模板库', description: '沟通记录模板和话术参考', doc_count: 0 },
];

const FALLBACK_DOCS: Record<number, { id: number; title: string; chunk_count: number; content: string }[]> = {
  1: [
    { id: 101, title: '某工业园区光储充一体化项目总结报告', chunk_count: 8, content: '## 某工业园区光储充一体化项目总结报告\n\n### 项目概况\n- 项目地点：西安市高新区\n- 建设规模：光伏装机 5MW / 储能 10MWh / 充电桩 50台\n- 投资总额：4200万元\n- 建设周期：2025年3月 - 2025年12月\n\n### 技术方案\n采用"光伏+储能+充电桩"一体化方案，光伏发电优先满足园区日间用电，余电存储于储能系统供夜间充电桩使用。\n\n### 运营数据\n- 日均光伏发电量：18,500 kWh\n- 储能系统效率：92.3%\n- 充电桩日均服务车次：120次\n- 年节省电费：约380万元\n- 碳减排：约3,200吨/年\n\n### 经验总结\n1. 光伏倾角需根据当地纬度优化，本项目采用26°倾角比原设计15°提升发电量8%\n2. 储能容量配置需考虑峰谷电价差，本项目峰谷套利年收益约45万元\n3. 充电桩选址需靠近员工停车场，实际利用率比路边选址高40%' },
    { id: 102, title: '某钢铁厂余热回收发电项目案例', chunk_count: 6, content: '## 某钢铁厂余热回收发电项目\n\n### 项目概况\n- 项目地点：河北省唐山市\n- 余热来源：高炉渣水、转炉烟气\n- 装机容量：12MW\n- 投资总额：8800万元\n- 投运时间：2025年6月\n\n### 技术路线\n采用有机朗肯循环（ORC）技术回收中低温余热，配合吸收式热泵实现梯级利用。\n\n### 经济效益\n- 年发电量：约7,200万kWh\n- 年收益：约4,300万元\n- 投资回收期：2.1年\n- 年碳减排：约5.8万吨\n\n### 关键经验\n1. 烟气余热回收需先解决积灰问题，本项目采用声波吹灰器+定期人工清理方案\n2. ORC工质选择至关重要，本项目采用R245fa，在实际运行温度范围内效率最优\n3. 余热发电并网需与当地电网公司提前沟通接入方案，避免工期延误' },
  ],
  2: [
    { id: 201, title: '思安新能源员工手册 V4.0', chunk_count: 12, content: '## 思安新能源员工手册 V4.0\n\n### 第一章 公司文化\n**使命**：让能源利用更智慧、更可持续\n**愿景**：成为全球领先的智慧综合能源服务商\n**价值观**：客户至上、技术驱动、协同共赢、持续创新\n\n### 第二章 考勤制度\n- 工作时间：周一至周五 9:00-18:00（弹性1小时）\n- 午休时间：12:00-13:30\n- 年假：入职满1年享5天，每增1年加1天，上限15天\n- 病假：每年6天带薪病假\n\n### 第三章 差旅制度\n- 国内差旅：高铁二等座/飞机经济舱\n- 住宿标准：一线城市600元/晚，其他城市400元/晚\n- 餐补：100元/天\n- 出差申请需提前3个工作日通过飞书审批\n\n### 第四章 培训发展\n- 新人入职培训：1周集中培训 + 3个月导师制\n- 技术培训：每月至少1次技术分享会\n- 外部培训：每人每年5000元培训预算' },
    { id: 202, title: '财务报销管理制度', chunk_count: 5, content: '## 财务报销管理制度\n\n### 一、报销范围\n1. 差旅费：交通、住宿、餐饮补助\n2. 业务招待费：需提前申请并注明招待对象及目的\n3. 办公用品：单次不超过500元\n4. 培训费：需附培训通知或邀请函\n\n### 二、报销流程\n1. 员工在飞书提交报销单并上传发票\n2. 部门负责人审批（1个工作日内）\n3. 财务审核（2个工作日内）\n4. 出纳打款（审核通过后1个工作日）\n\n### 三、发票要求\n- 增值税专用发票优先\n- 发票抬头：思安新能源股份有限公司\n- 税号：91610131MA6XXXXXXX\n- 电子发票可直接上传，纸质发票需拍照上传并保留原件\n\n### 四、报销时限\n- 当月费用次月5日前提交\n- 跨年费用需在12月25日前提交\n- 逾期不予报销' },
  ],
  3: [
    { id: 301, title: 'GB/T 36276-2018 电力储能用锂离子电池标准', chunk_count: 10, content: '## GB/T 36276-2018 电力储能用锂离子电池\n\n### 适用范围\n本标准规定了电力储能用锂离子电池的术语和定义、技术要求、试验方法、检验规则、标志、包装、运输和储存。\n\n### 核心技术要求\n**电性能要求**\n- 额定容量：不低于标称容量的100%\n- 循环寿命：25℃、0.5C充放条件下不低于4000次（容量保持率≥80%）\n- 内阻：出厂内阻偏差不超过±10%\n\n**安全性能要求**\n- 过充电：1C充电至200%SOC，不起火不爆炸\n- 过放电：1C放电至0V，不起火不爆炸\n- 短路：外部短路10min，不起火不爆炸\n- 针刺：φ5mm钢针贯穿，不起火不爆炸\n- 挤压：挤压力达到200kN或变形达30%，不起火不爆炸\n\n### 思安新能源内部执行标准\n1. 所有储能项目选型电池必须通过GB/T 36276-2018全项检测\n2. 供应商需提供CNAS认可实验室出具的检测报告\n3. 到货后按批次抽样复检（抽样比例≥3%）\n4. 运行中每季度进行一次容量标定' },
  ],
  4: [
    { id: 401, title: '思安新能源前端开发编码规范', chunk_count: 7, content: '## 思安新能源前端开发编码规范\n\n### 一、技术栈\n- 框架：React 18+ / Ant Design Pro\n- 语言：TypeScript（启用strict模式）\n- 构建：Vite\n- 包管理：pnpm\n- 代码检查：ESLint + Prettier\n\n### 二、命名规范\n- 组件文件：PascalCase（如 ChatWindow.tsx）\n- 工具函数：camelCase（如 formatDate.ts）\n- 常量：UPPER_SNAKE_CASE（如 MAX_RETRY_COUNT）\n- CSS类名：kebab-case（如 .chat-bubble-user）\n\n### 三、组件规范\n- 每个组件不超过300行\n- 使用函数组件 + Hooks，不使用Class组件\n- Props类型必须显式定义interface\n- 避免使用any，必要时使用unknown\n\n### 四、Git规范\n- 分支命名：feature/xxx、fix/xxx、refactor/xxx\n- 提交信息：type(scope): description\n- 提交前通过 lint-staged + husky 自动检查' },
  ],
};

const FALLBACK_TOOLS = [
  {
    id: 1, name: '向量知识库检索', tool_type: 'mcp', is_active: 1,
    description: '基于Milvus的语义检索工具，支持混合检索+Reranker重排',
    endpoint: 'mcp://milvus-vector-search/v1/search',
    params: [
      { name: 'collection', type: 'string', required: true, desc: '目标集合名称' },
      { name: 'query', type: 'string', required: true, desc: '查询文本' },
      { name: 'top_k', type: 'int', required: false, desc: '返回结果数量，默认10' },
      { name: 'rerank', type: 'boolean', required: false, desc: '是否启用Reranker重排序' },
    ],
    usage: '当Agent需要从知识库中检索相关文档或信息时调用。支持语义检索和关键词检索混合模式，配合BGE-Reranker对召回结果进行重排序，确保返回最相关的内容片段。',
  },
  {
    id: 2, name: '飞书文档API', tool_type: 'feishu', is_active: 1,
    description: '飞书开放平台文档读写接口，支持文档创建/读取/更新',
    endpoint: 'https://open.feishu.cn/open-apis/docx/v1/documents',
    params: [
      { name: 'document_id', type: 'string', required: true, desc: '飞书文档ID' },
      { name: 'action', type: 'enum', required: true, desc: '操作类型：read/write/update' },
      { name: 'content', type: 'string', required: false, desc: '写入或更新的内容（Markdown格式）' },
    ],
    usage: '用于Agent读取公司内部飞书文档、自动生成项目报告并写入飞书、或更新现有文档内容。典型场景：生成项目周报自动写入飞书文档库。',
  },
  {
    id: 3, name: '天气数据API', tool_type: 'api', is_active: 1,
    description: '获取实时天气和预报数据，用于能源调度预测',
    endpoint: 'https://api.weather.com/v3/forecast',
    params: [
      { name: 'location', type: 'string', required: true, desc: '地点编码或经纬度' },
      { name: 'days', type: 'int', required: false, desc: '预报天数，默认7天' },
      { name: 'fields', type: 'array', required: false, desc: '需要的数据字段：temp/wind/irradiance/humidity' },
    ],
    usage: '用于光伏发电预测、储能调度优化、制冷供暖负荷预测等场景。Agent在制定能源调度方案时调用此工具获取气象数据，结合历史发电数据进行功率预测。',
  },
  {
    id: 4, name: '设备时序数据查询', tool_type: 'database', is_active: 1,
    description: '查询TDengine中设备运行数据，支持时间范围和聚合',
    endpoint: 'tdengine://query/v2/sql',
    params: [
      { name: 'device_id', type: 'string', required: true, desc: '设备ID或设备组ID' },
      { name: 'metric', type: 'enum', required: true, desc: '查询指标：power/energy/temp/pressure/flow' },
      { name: 'start_time', type: 'datetime', required: true, desc: '起始时间' },
      { name: 'end_time', type: 'datetime', required: false, desc: '结束时间，默认当前时间' },
      { name: 'aggregation', type: 'enum', required: false, desc: '聚合方式：avg/max/min/sum/raw' },
    ],
    usage: '用于设备故障诊断Agent查询历史运行数据、能耗分析Agent获取能耗曲线、预测性维护Agent分析设备趋势数据。',
  },
  {
    id: 5, name: 'Git代码仓库API', tool_type: 'api', is_active: 1,
    description: '访问Git代码仓库，获取diff/commit/分支信息',
    endpoint: 'https://git.internal/api/v4',
    params: [
      { name: 'repo', type: 'string', required: true, desc: '仓库路径' },
      { name: 'action', type: 'enum', required: true, desc: '操作：diff/commit/branch/merge_request' },
      { name: 'ref', type: 'string', required: false, desc: '分支名或commit SHA' },
    ],
    usage: '代码审查Agent调用此工具获取代码变更内容、提交历史。支持查看MR diff、分支对比、历史commit详情。',
  },
  {
    id: 6, name: '碳排放计算工具', tool_type: 'mcp', is_active: 1,
    description: '根据能源消耗计算碳排放量，支持多种能源类型',
    endpoint: 'mcp://carbon-calculator/v1/calculate',
    params: [
      { name: 'energy_type', type: 'enum', required: true, desc: '能源类型：electricity/coal/natural_gas/oil' },
      { name: 'amount', type: 'float', required: true, desc: '消耗量（kWh/吨/立方米/升）' },
      { name: 'region', type: 'string', required: false, desc: '区域电网编码，默认西北电网' },
    ],
    usage: '碳资产管理Agent核心工具，用于计算企业碳排放量、生成碳排放报告、评估减排措施效果。支持国家电网六大区域碳排放因子自动匹配。',
  },
];

const FALLBACK_DBS = [
  {
    id: 1, name: '业务数据库', db_type: 'postgresql',
    description: 'Agent配置、用户权限、工单记录等业务数据',
    host: 'pg-master.internal:5432', status: 'connected',
    tables: [
      { name: 'agents', rows: '48', desc: 'Agent配置表：名称/模型/系统提示词/工具绑定' },
      { name: 'users', rows: '586', desc: '平台用户表：账号/部门/角色/权限' },
      { name: 'workflows', rows: '127', desc: '工作流定义表：DAG节点/边/条件分支' },
      { name: 'audit_logs', rows: '1,250,000', desc: '审计日志表：操作人/时间/动作/结果' },
      { name: 'api_keys', rows: '32', desc: 'API密钥表：密钥哈希/过期时间/调用限额' },
    ],
  },
  {
    id: 2, name: '向量数据库', db_type: 'milvus',
    description: 'RAG知识库语义检索引擎，文档向量嵌入存储',
    host: 'milvus.internal:19530', status: 'connected',
    tables: [
      { name: 'knowledge_chunks', rows: '86,500', desc: '文档切片向量索引：1024维BGE-M3嵌入' },
      { name: 'case_embeddings', rows: '12,400', desc: '项目案例向量库：案例摘要+技术方案嵌入' },
      { name: 'standard_clauses', rows: '3,200', desc: '标准条款向量库：合同条款/技术标准片段' },
    ],
  },
  {
    id: 3, name: '时序数据库', db_type: 'tdengine',
    description: '设备运行数据、发电量、能耗曲线等时序数据',
    host: 'tdengine.internal:6030', status: 'connected',
    tables: [
      { name: 'device_metrics', rows: '5.2亿', desc: '设备运行指标：功率/温度/压力/流量（每秒采集）' },
      { name: 'energy_output', rows: '3800万', desc: '发电量记录：光伏/储能/余热发电（每5分钟采集）' },
      { name: 'weather_history', rows: '1200万', desc: '气象历史数据：辐照度/风速/温度/湿度（每小时采集）' },
      { name: 'carbon_records', rows: '850万', desc: '碳排放记录：按设备/部门/时间维度的碳排放数据' },
    ],
  },
  {
    id: 4, name: '图数据库', db_type: 'neo4j',
    description: '设备关联关系、故障因果链和知识图谱',
    host: 'neo4j.internal:7687', status: 'connected',
    tables: [
      { name: 'Device（节点）', rows: '3,200', desc: '设备节点：类型/型号/安装位置/所属系统' },
      { name: 'DEPENDS_ON（关系）', rows: '8,500', desc: '依赖关系边：设备间能源流/数据流依赖' },
      { name: 'CAUSES（关系）', rows: '1,200', desc: '故障因果边：故障模式→症状→根因的因果链' },
      { name: 'Project（节点）', rows: '156', desc: '项目节点：项目信息/技术方案/关联设备' },
    ],
  },
];

export default function KnowledgeBasePage() {
  const [kbs, setKbs] = useState<any[]>(FALLBACK_KB);
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedKb, setSelectedKb] = useState<number | null>(null);
  const [tools, setTools] = useState<any[]>(FALLBACK_TOOLS);
  const [dbs, setDbs] = useState<any[]>(FALLBACK_DBS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Detail modals
  const [docModal, setDocModal] = useState<{ open: boolean; title: string; content: string }>({ open: false, title: '', content: '' });
  const [toolModal, setToolModal] = useState<{ open: boolean; tool: any }>({ open: false, tool: null });
  const [dbModal, setDbModal] = useState<{ open: boolean; db: any }>({ open: false, db: null });

  const load = async () => {
    try {
      const [k, t, d] = await Promise.all([getKnowledgeBases(), getTools(), getDataSources()]);
      setKbs(k && k.length ? k : FALLBACK_KB);
      setTools(t && t.length ? t : FALLBACK_TOOLS);
      setDbs(d && d.length ? d : FALLBACK_DBS);
      if (k && k.length > 0 && !selectedKb) setSelectedKb(k[0].id);
    } catch {
      setKbs(FALLBACK_KB);
      setTools(FALLBACK_TOOLS);
      setDbs(FALLBACK_DBS);
      if (!selectedKb) setSelectedKb(FALLBACK_KB[0].id);
    }
  };

  const loadDocs = async (kbId: number) => {
    setSelectedKb(kbId);
    try {
      const d = await getDocuments(kbId);
      setDocs(d && d.length ? d : (FALLBACK_DOCS[kbId] || []));
    } catch {
      setDocs(FALLBACK_DOCS[kbId] || []);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddDoc = async () => {
    if (!selectedKb) return;
    try {
      const values = await form.validateFields();
      await createDocument({ ...values, kb_id: selectedKb });
      message.success('文档已添加');
      setModalOpen(false);
      form.resetFields();
      loadDocs(selectedKb);
      load();
    } catch {}
  };

  const handleDeleteDoc = async (id: number) => {
    try {
      await deleteDocument(id);
      message.success('已删除');
      if (selectedKb) loadDocs(selectedKb);
      load();
    } catch {}
  };

  const openDocDetail = (doc: any) => {
    setDocModal({ open: true, title: doc.title, content: doc.content || '暂无内容' });
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <Title level={3} style={{ color: '#e8edf5', marginBottom: 4 }}>能力管理</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>知识库 · 工具/插件 · 数据源</Text>

      <Tabs
        defaultActiveKey="kb"
        items={[
          {
            key: 'kb',
            label: <Space><DatabaseOutlined />知识库</Space>,
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card title="知识库列表" style={{ background: '#0a1628', border: '1px solid #1a3055' }}
                    extra={<Button size="small" type="primary" ghost icon={<PlusOutlined />} disabled>新建</Button>}
                  >
                    {kbs.map((kb) => (
                      <div
                        key={kb.id}
                        onClick={() => loadDocs(kb.id)}
                        style={{
                          padding: '12px 14px', borderRadius: 8, cursor: 'pointer', marginBottom: 8,
                          background: selectedKb === kb.id ? 'rgba(0,180,255,0.08)' : 'rgba(255,255,255,0.02)',
                          border: selectedKb === kb.id ? '1px solid rgba(0,180,255,0.2)' : '1px solid transparent',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Text strong style={{ color: '#e8edf5' }}>{kb.name}</Text>
                        <div style={{ fontSize: 11, color: '#4a5f80', marginTop: 4 }}>{kb.description}</div>
                        <Tag style={{ marginTop: 4 }}>{kb.doc_count} 篇文档</Tag>
                      </div>
                    ))}
                  </Card>
                </Col>
                <Col xs={24} md={16}>
                  <Card
                    title={selectedKb ? `文档列表 — ${kbs.find((k) => k.id === selectedKb)?.name}` : '选择知识库'}
                    extra={<Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} disabled={!selectedKb}>添加文档</Button>}
                    style={{ background: '#0a1628', border: '1px solid #1a3055' }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <Table
                      dataSource={docs}
                      rowKey="id"
                      size="small"
                      pagination={false}
                      locale={{ emptyText: '暂无文档，点击"添加文档"上传' }}
                      columns={[
                        { title: '文档标题', dataIndex: 'title', key: 'title', render: (v: string, record: any) => (
                          <a onClick={() => openDocDetail(record)} style={{ color: '#00b4ff', cursor: 'pointer' }}>{v}</a>
                        )},
                        { title: '切片数', dataIndex: 'chunk_count', key: 'chunks', width: 80 },
                        { title: '操作', key: 'action', width: 100, render: (_: any, record: any) => (
                          <Space>
                            <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: '#00b4ff' }} onClick={() => openDocDetail(record)}>查看</Button>
                            <Button type="text" danger size="small" onClick={() => handleDeleteDoc(record.id)}>删除</Button>
                          </Space>
                        )},
                      ]}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'tools',
            label: <Space><ApiOutlined />工具/插件</Space>,
            children: (
              <Row gutter={[16, 16]}>
                {tools.map((t) => (
                  <Col key={t.id} xs={24} sm={12} lg={8}>
                    <Card
                      style={{ background: '#0a1628', border: '1px solid #1a3055', cursor: 'pointer', transition: 'all 0.2s' }}
                      bodyStyle={{ padding: '20px 22px' }}
                      onClick={() => setToolModal({ open: true, tool: t })}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,180,255,0.3)'; e.currentTarget.style.background = 'rgba(0,180,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3055'; e.currentTarget.style.background = '#0a1628'; }}
                    >
                      <Text strong style={{ color: '#e8edf5', fontSize: 14 }}>{t.name}</Text>
                      <div style={{ fontSize: 12, color: '#4a5f80', margin: '8px 0' }}>{t.description}</div>
                      <Space>
                        <Tag color={t.tool_type === 'mcp' ? 'cyan' : t.tool_type === 'api' ? 'blue' : t.tool_type === 'feishu' ? 'purple' : 'gold'}>
                          {t.tool_type.toUpperCase()}
                        </Tag>
                        {t.is_active ? <Tag color="green">已启用</Tag> : <Tag color="red">已停用</Tag>}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
          {
            key: 'datasources',
            label: <Space><CloudServerOutlined />数据源</Space>,
            children: (
              <Row gutter={[16, 16]}>
                {dbs.map((db) => (
                  <Col key={db.id} xs={24} sm={12} lg={6}>
                    <Card
                      style={{ background: '#0a1628', border: '1px solid #1a3055', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                      bodyStyle={{ padding: '24px 20px' }}
                      onClick={() => setDbModal({ open: true, db })}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,180,255,0.3)'; e.currentTarget.style.background = 'rgba(0,180,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3055'; e.currentTarget.style.background = '#0a1628'; }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>
                        {db.db_type === 'postgresql' ? '🐘' : db.db_type === 'milvus' ? '🔍' : db.db_type === 'tdengine' ? '⏱️' : '🕸️'}
                      </div>
                      <Text strong style={{ color: '#e8edf5', fontSize: 14 }}>{db.name}</Text>
                      <div style={{ fontSize: 11, color: '#4a5f80', marginTop: 4 }}>
                        {db.db_type.toUpperCase()} · {db.host}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <Tag color="green" icon={<CheckCircleFilled />}>已连接</Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ),
          },
        ]}
      />

      {/* Add document modal */}
      <Modal
        title="添加文档到知识库"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleAddDoc}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="文档标题" rules={[{ required: true }]}>
            <Input placeholder="输入文档标题" />
          </Form.Item>
          <Form.Item name="content" label="文档内容" rules={[{ required: true }]}>
            <TextArea rows={6} placeholder="输入文档正文内容..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Document detail modal */}
      <Modal
        title={docModal.title}
        open={docModal.open}
        onCancel={() => setDocModal({ open: false, title: '', content: '' })}
        footer={null}
        width={800}
        styles={{ body: { maxHeight: '60vh', overflow: 'auto' } }}
      >
        <div style={{
          background: '#0d1117', border: '1px solid #30363d', borderRadius: 8, padding: 20,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", sans-serif',
          fontSize: 14, lineHeight: 1.9, color: '#c9d1d9', whiteSpace: 'pre-wrap',
        }}>
          {docModal.content}
        </div>
      </Modal>

      {/* Tool detail modal */}
      <Modal
        title={toolModal.tool?.name}
        open={toolModal.open}
        onCancel={() => setToolModal({ open: false, tool: null })}
        footer={null}
        width={750}
      >
        {toolModal.tool && (
          <div style={{ color: '#c9d1d9' }}>
            <Descriptions column={2} size="small" bordered
              labelStyle={{ color: '#8899b4', background: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.01)' }}
            >
              <Descriptions.Item label="工具名称">{toolModal.tool.name}</Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color={toolModal.tool.tool_type === 'mcp' ? 'cyan' : toolModal.tool.tool_type === 'api' ? 'blue' : toolModal.tool.tool_type === 'feishu' ? 'purple' : 'gold'}>
                  {toolModal.tool.tool_type.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                {toolModal.tool.is_active ? <Tag color="green">已启用</Tag> : <Tag color="red">已停用</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="接口地址" span={2}>
                <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{toolModal.tool.endpoint}</code>
              </Descriptions.Item>
              <Descriptions.Item label="功能描述" span={2}>{toolModal.tool.description}</Descriptions.Item>
              <Descriptions.Item label="使用说明" span={2}>{toolModal.tool.usage}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ color: '#e8edf5', marginTop: 20, marginBottom: 12 }}>参数列表</Title>
            <Table
              dataSource={toolModal.tool.params}
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '参数名', dataIndex: 'name', key: 'name', width: 160, render: (v: string) => <code style={{ color: '#ff8c42', fontSize: 12 }}>{v}</code> },
                { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (v: string) => <Tag>{v}</Tag> },
                { title: '必填', dataIndex: 'required', key: 'required', width: 60, render: (v: boolean) => v ? <Tag color="red">是</Tag> : <Tag>否</Tag> },
                { title: '说明', dataIndex: 'desc', key: 'desc' },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Database detail modal */}
      <Modal
        title={dbModal.db?.name}
        open={dbModal.open}
        onCancel={() => setDbModal({ open: false, db: null })}
        footer={null}
        width={800}
      >
        {dbModal.db && (
          <div style={{ color: '#c9d1d9' }}>
            <Descriptions column={2} size="small" bordered
              labelStyle={{ color: '#8899b4', background: 'rgba(255,255,255,0.02)' }}
              contentStyle={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.01)' }}
            >
              <Descriptions.Item label="数据库名称">{dbModal.db.name}</Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color={dbModal.db.db_type === 'postgresql' ? 'blue' : dbModal.db.db_type === 'milvus' ? 'cyan' : dbModal.db.db_type === 'tdengine' ? 'orange' : 'purple'}>
                  {dbModal.db.db_type.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="连接地址" span={2}>
                <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{dbModal.db.host}</code>
              </Descriptions.Item>
              <Descriptions.Item label="状态" span={2}>
                <Tag color="green" icon={<CheckCircleFilled />}>已连接</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="说明" span={2}>{dbModal.db.description}</Descriptions.Item>
            </Descriptions>

            <Title level={5} style={{ color: '#e8edf5', marginTop: 20, marginBottom: 12 }}>数据表结构</Title>
            <Table
              dataSource={dbModal.db.tables}
              rowKey="name"
              size="small"
              pagination={false}
              columns={[
                { title: '表名', dataIndex: 'name', key: 'name', width: 200, render: (v: string) => <code style={{ color: '#00e5c8', fontSize: 12 }}>{v}</code> },
                { title: '行数', dataIndex: 'rows', key: 'rows', width: 100, render: (v: string) => <Text style={{ color: '#8899b4' }}>{v}</Text> },
                { title: '说明', dataIndex: 'desc', key: 'desc' },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
