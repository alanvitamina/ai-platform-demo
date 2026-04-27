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
      setAgents(a);
      setTools(t);
      setKbs(k);
    } catch { /* backend not running */ }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
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
