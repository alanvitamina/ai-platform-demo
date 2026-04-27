import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Tag, Typography, Space, message, Row, Col, Tabs } from 'antd';
import { PlusOutlined, DatabaseOutlined, ApiOutlined, CloudServerOutlined, CheckCircleFilled } from '@ant-design/icons';
import { getKnowledgeBases, getDocuments, createDocument, deleteDocument, getTools, getDataSources } from '../../services/api';

const { Text, Title } = Typography;
const { TextArea } = Input;

// Fallback demo data when backend not running
const FALLBACK_KB = [
  { id: 1, name: '能源行业案例库', description: '综合能源服务典型项目案例', doc_count: 2 },
  { id: 2, name: '公司制度文档库', description: '人事、财务、行政管理制度', doc_count: 2 },
  { id: 3, name: '技术标准库', description: '国家标准、行业规范、内部技术标准', doc_count: 1 },
  { id: 4, name: '编码规范库', description: '软件开发编码规范和安全标准', doc_count: 1 },
  { id: 5, name: '客户沟通模板库', description: '沟通记录模板和话术参考', doc_count: 0 },
];

const FALLBACK_TOOLS = [
  { id: 1, name: '向量知识库检索', description: '基于Milvus的语义检索工具，支持混合检索+Reranker重排', tool_type: 'mcp', is_active: 1 },
  { id: 2, name: '飞书文档API', description: '飞书开放平台文档读写接口，支持文档创建/读取/更新', tool_type: 'feishu', is_active: 1 },
  { id: 3, name: '天气数据API', description: '获取实时天气和预报数据，用于能源调度预测', tool_type: 'api', is_active: 1 },
  { id: 4, name: '设备时序数据查询', description: '查询TDengine中设备运行数据，支持时间范围和聚合', tool_type: 'database', is_active: 1 },
  { id: 5, name: 'Git代码仓库API', description: '访问Git代码仓库，获取diff/commit/分支信息', tool_type: 'api', is_active: 1 },
  { id: 6, name: '碳排放计算工具', description: '根据能源消耗计算碳排放量，支持多种能源类型', tool_type: 'mcp', is_active: 1 },
];

const FALLBACK_DBS = [
  { id: 1, name: '业务数据库', db_type: 'postgresql', description: 'Agent配置、用户权限、工单记录等业务数据', host: 'pg-master.internal:5432', status: 'connected' },
  { id: 2, name: '向量数据库', db_type: 'milvus', description: 'RAG知识库语义检索引擎，文档向量嵌入存储', host: 'milvus.internal:19530', status: 'connected' },
  { id: 3, name: '时序数据库', db_type: 'tdengine', description: '设备运行数据、发电量、能耗曲线等时序数据', host: 'tdengine.internal:6030', status: 'connected' },
  { id: 4, name: '图数据库', db_type: 'neo4j', description: '设备关联关系、故障因果链和知识图谱', host: 'neo4j.internal:7687', status: 'connected' },
];

export default function KnowledgeBasePage() {
  const [kbs, setKbs] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedKb, setSelectedKb] = useState<number | null>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [dbs, setDbs] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    try {
      const [k, t, d] = await Promise.all([getKnowledgeBases(), getTools(), getDataSources()]);
      setKbs(k && k.length ? k : FALLBACK_KB);
      setTools(t && t.length ? t : FALLBACK_TOOLS);
      setDbs(d && d.length ? d : FALLBACK_DBS);
      if (k && k.length > 0 && !selectedKb) setSelectedKb(k[0].id);
    } catch {
      // Backend not running — use fallback demo data
      setKbs(FALLBACK_KB);
      setTools(FALLBACK_TOOLS);
      setDbs(FALLBACK_DBS);
    }
  };

  const loadDocs = async (kbId: number) => {
    setSelectedKb(kbId);
    try {
      const d = await getDocuments(kbId);
      setDocs(d);
    } catch {}
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
              <Row gutter={16}>
                <Col span={8}>
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
                <Col span={16}>
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
                        { title: '文档标题', dataIndex: 'title', key: 'title', render: (v: string) => <Text style={{ color: '#e8edf5' }}>{v}</Text> },
                        { title: '切片数', dataIndex: 'chunk_count', key: 'chunks', width: 80 },
                        { title: '操作', key: 'action', width: 80, render: (_: any, record: any) => <Button type="text" danger size="small" onClick={() => handleDeleteDoc(record.id)}>删除</Button> },
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
                    <Card style={{ background: '#0a1628', border: '1px solid #1a3055' }} bodyStyle={{ padding: '20px 22px' }}>
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
                    <Card style={{ background: '#0a1628', border: '1px solid #1a3055', textAlign: 'center' }} bodyStyle={{ padding: '24px 20px' }}>
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
    </div>
  );
}
