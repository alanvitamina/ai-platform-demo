import { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Tag, Typography, Space, Modal, message, Row, Col, List, Popconfirm } from 'antd';
import { PlusOutlined, RobotOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { getAgents, createAgent, deleteAgent, getTools, getKnowledgeBases } from '../../services/api';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

const categories = [
  { value: 'energy', label: '⚡ 智慧综合能源服务' },
  { value: 'rd', label: '🔬 研发场景' },
  { value: 'marketing', label: '📣 营销场景' },
  { value: 'project', label: '🏗️ 工程项目交付' },
  { value: 'admin', label: '🏢 职能后台' },
  { value: 'custom', label: '🤖 自定义' },
];

const models = [
  { value: 'Claude Opus 4.7', label: 'Claude Opus 4.7 (云端旗舰)' },
  { value: 'GPT-5.5', label: 'GPT-5.5 (云端通用)' },
  { value: 'GLM-5.1', label: 'GLM-5.1 (国内云端)' },
  { value: 'MiMo V2.5', label: 'MiMo V2.5 (国内云端)' },
  { value: 'DeepSeek V4 (本地)', label: 'DeepSeek V4 (本地部署)' },
];

// Fallback demo agents when backend not running
const FALLBACK_AGENTS = [
  { id: 101, name: '⚡ 我的能源助手', emoji: '⚡', description: '自定义能源调度分析Agent', model: 'Claude Opus 4.7', category: 'energy', is_preset: false, tools: ['天气API', '时序数据库'] },
  { id: 102, name: '📊 项目周报生成器', emoji: '📊', description: '自动汇总项目进度生成周报', model: 'GPT-5.5', category: 'project', is_preset: false, tools: ['飞书文档', '结构化数据库'] },
  { id: 103, name: '🔍 合同条款审查助手', emoji: '🔍', description: '审查合同中的风险条款', model: 'GLM-5.1', category: 'admin', is_preset: false, tools: ['合同模板库', '飞书审批'] },
];
const FALLBACK_TOOLS = [
  { id: 1, name: '向量知识库检索', description: 'Milvus 语义检索', tool_type: 'mcp', is_active: 1 },
  { id: 2, name: '飞书文档API', description: '飞书文档读写', tool_type: 'feishu', is_active: 1 },
  { id: 3, name: '天气数据API', description: '实时天气与预报', tool_type: 'api', is_active: 1 },
  { id: 4, name: '设备时序数据查询', description: 'TDengine 时序查询', tool_type: 'database', is_active: 1 },
  { id: 5, name: 'Git代码仓库API', description: 'Git PR/Commit', tool_type: 'api', is_active: 1 },
  { id: 6, name: '碳排放计算工具', description: '碳排放量计算', tool_type: 'mcp', is_active: 1 },
];
const FALLBACK_KBS = [
  { id: 1, name: '能源行业案例库', description: '综合能源项目案例', doc_count: 35 },
  { id: 2, name: '公司制度文档库', description: '人事/财务/行政', doc_count: 28 },
  { id: 3, name: '技术标准库', description: '国标/行标/企标', doc_count: 42 },
];

export default function AgentBuilder() {
  const [agents, setAgents] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [kbs, setKbs] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    try {
      const [a, t, k] = await Promise.all([getAgents(), getTools(), getKnowledgeBases()]);
      setAgents(a && a.length ? a : FALLBACK_AGENTS);
      setTools(t && t.length ? t : FALLBACK_TOOLS);
      setKbs(k && k.length ? k : FALLBACK_KBS);
    } catch {
      setAgents(FALLBACK_AGENTS);
      setTools(FALLBACK_TOOLS);
      setKbs(FALLBACK_KBS);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createAgent(values);
      message.success('Agent 创建成功！');
      setModalOpen(false);
      form.resetFields();
      load();
    } catch (e: any) {
      if (e?.errorFields) return;
      message.error('创建失败，请确保后端服务已启动');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAgent(id);
      message.success('已删除');
      load();
    } catch {
      message.error('删除失败');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>Agent 搭建器</Title>
          <Text type="secondary">低代码搭建自定义 Agent，非技术人员可自助创建</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', border: 'none' }}
        >
          创建 Agent
        </Button>
      </div>

      {/* Agent list */}
      <Row gutter={[16, 16]}>
        {agents.map((agent) => (
          <Col key={agent.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                background: '#0a1628', border: '1px solid #1a3055',
                height: '100%',
              }}
              bodyStyle={{ padding: '20px 22px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{agent.emoji}</span>
                  <Text strong style={{ color: '#e8edf5' }}>{agent.name}</Text>
                </div>
                {!agent.is_preset && (
                  <Popconfirm title="确定删除此 Agent？" onConfirm={() => handleDelete(agent.id)}>
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )}
              </div>
              <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12 }} ellipsis={{ rows: 2 }}>
                {agent.description}
              </Paragraph>
              <Space size={4} wrap>
                <Tag color="purple">{agent.model}</Tag>
                <Tag color={agent.is_preset ? 'blue' : 'green'}>
                  {agent.is_preset ? '预置' : '自定义'}
                </Tag>
              </Space>
              {agent.tools?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {agent.tools.map((t: string) => <Tag key={t} style={{ fontSize: 10 }}>{t}</Tag>)}
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create Modal */}
      <Modal
        title={<Space><RobotOutlined style={{ color: '#a78bfa' }} />创建自定义 Agent</Space>}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleCreate}
        confirmLoading={loading}
        width={640}
        okText="创建"
        cancelText="取消"
        style={{ top: 40 }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="name" label="Agent 名称" rules={[{ required: true, message: '请输入名称' }]}>
                <Input placeholder="例如：我的能源分析助手" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emoji" label="图标" initialValue="🤖">
                <Input placeholder="🤖" maxLength={2} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input placeholder="简要描述这个 Agent 的用途" />
          </Form.Item>
          <Form.Item name="system_prompt" label="系统提示词">
            <TextArea rows={3} placeholder="定义 Agent 的角色和行为规则..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="model" label="模型选择" initialValue="Claude Opus 4.7">
                <Select options={models} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="业务分类" initialValue="custom">
                <Select options={categories} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tools" label="挂载工具" initialValue={[]}>
                <Select mode="multiple" placeholder="选择工具" options={tools.map((t: any) => ({ value: t.name, label: t.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="knowledge_bases" label="挂载知识库" initialValue={[]}>
                <Select mode="multiple" placeholder="选择知识库" options={kbs.map((k: any) => ({ value: k.name, label: k.name }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
