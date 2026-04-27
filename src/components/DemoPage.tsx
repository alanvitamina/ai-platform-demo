import { useState, useEffect } from 'react';
import { Card, Button, Tag, Space, Typography, Empty } from 'antd';
import {
  SendOutlined,
  LoadingOutlined,
  CheckCircleFilled,
  UserOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { demoSessions } from '../mock/conversations';
import { getAgentById } from '../mock/agents';

const { Text, Title } = Typography;

const wfColors: Record<string, string> = {
  done: '#34d399',
  active: '#00b4ff',
  pending: 'rgba(255,255,255,0.12)',
};

export default function DemoPage({ agentId }: { agentId: string }) {
  const session = demoSessions.find((s) => s.agentId === agentId)!;
  const agent = getAgentById(agentId)!;
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    setCurrentStep(0);
    setVisibleSteps([]);
    setDoneSteps([]);
  }, [agentId]);

  const step = session.steps[currentStep];

  const advance = () => {
    if (currentStep >= session.steps.length - 1) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setVisibleSteps((prev) => [...prev, next]);
    setTimeout(() => {
      setDoneSteps((prev) => [...prev, next]);
    }, 400);
  };

  // Show initial step
  useEffect(() => {
    if (currentStep === 0 && !visibleSteps.includes(0)) {
      setVisibleSteps([0]);
      setTimeout(() => setDoneSteps([0]), 400);
    }
  }, [currentStep, visibleSteps]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(0,180,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}
          >
            {agent.emoji}
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>{agent.name}</Title>
            <Text type="secondary">{agent.description}</Text>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {agent.tools.map((t) => (
              <Tag key={t.label} color={t.color === 'gold' ? 'gold' : t.color === 'orange' ? 'orange' : t.color === 'cyan' ? 'cyan' : t.color === 'blue' ? 'blue' : t.color === 'purple' ? 'purple' : t.color === 'green' ? 'green' : 'red'}>
                {t.label}
              </Tag>
            ))}
          </div>
        </div>
        <Text type="secondary" style={{ fontSize: 13 }}>🟢 {session.title}</Text>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Left: Conversation */}
        <Card
          title={
            <Space>
              <RobotOutlined style={{ color: '#00b4ff' }} />
              <span>对话</span>
              <Tag>{currentStep + 1} / {session.steps.length}</Tag>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<RightOutlined />}
              onClick={advance}
              disabled={currentStep >= session.steps.length - 1}
              style={{ background: 'linear-gradient(135deg, #00b4ff, #0958d9)' }}
            >
              下一步
            </Button>
          }
          style={{ background: '#0a1628', border: '1px solid #1a3055', minHeight: 520 }}
          bodyStyle={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 520, overflowY: 'auto' }}
        >
          {session.steps.slice(0, currentStep + 1).map((s, idx) => (
            <div key={s.id} className={`${visibleSteps.includes(idx) ? 'anim-fade-up' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.conversation.user && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="chat-bubble chat-bubble-user">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <UserOutlined style={{ fontSize: 12 }} />
                      <span style={{ fontSize: 12, opacity: 0.8 }}>王工（能源服务部）</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{s.conversation.user}</div>
                  </div>
                </div>
              )}
              {s.conversation.agent && (
                <div style={{ display: 'flex' }}>
                  <div className="chat-bubble chat-bubble-agent" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <RobotOutlined style={{ color: '#00b4ff', fontSize: 12 }} />
                      <span style={{ fontSize: 12, color: '#00b4ff' }}>{agent.name}</span>
                      {doneSteps.includes(idx) && <CheckCircleFilled style={{ color: '#34d399', fontSize: 12 }} />}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{s.conversation.agent}</div>
                  </div>
                </div>
              )}
              {idx < currentStep && <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', margin: '4px 0' }} />}
            </div>
          ))}
          {currentStep >= session.steps.length - 1 && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <CheckCircleFilled style={{ fontSize: 40, color: '#34d399', marginBottom: 8 }} />
              <div style={{ color: '#34d399', fontSize: 15, fontWeight: 600 }}>演示完成</div>
              <Text type="secondary">本次演示展示了 {agent.name} 的完整工作流程</Text>
            </div>
          )}
        </Card>

        {/* Right: Workflow */}
        <Card
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#ff8c42' }} />
              <span>Agent 工作过程</span>
            </Space>
          }
          style={{ background: '#0a1628', border: '1px solid #1a3055' }}
          bodyStyle={{ padding: '16px 20px', maxHeight: 520, overflowY: 'auto' }}
        >
          {step ? (
            <div>
              {step.workflow.map((node, idx) => (
                <div key={idx} className="wf-step" style={{ opacity: node.status === 'pending' ? 0.4 : 1, transition: 'all 0.4s' }}>
                  <div
                    className="wf-dot"
                    style={{
                      background: node.status === 'done' ? 'rgba(52,211,153,0.15)' : node.status === 'active' ? 'rgba(0,180,255,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${wfColors[node.status]}`,
                      color: wfColors[node.status],
                    }}
                  >
                    {node.status === 'active' ? <LoadingOutlined /> : node.status === 'done' ? '✓' : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: node.status === 'pending' ? '#4a5f80' : '#e8edf5', marginBottom: 2 }}>
                      {node.label}
                    </div>
                    {node.detail && (
                      <div style={{ fontSize: 11, color: node.status === 'active' ? '#00b4ff' : '#4a5f80', lineHeight: 1.5 }}>
                        {node.detail}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="等待初始化" />
          )}
        </Card>
      </div>
    </div>
  );
}
