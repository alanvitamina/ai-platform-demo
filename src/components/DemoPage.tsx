import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Tag, Space, Typography, Empty, Switch, Grid } from 'antd';
import {
  SendOutlined,
  LoadingOutlined,
  CheckCircleFilled,
  UserOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  PauseCircleOutlined,
  CaretRightOutlined,
  ReloadOutlined,
  HistoryOutlined,
  CloseOutlined,
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
  const [autoPlay, setAutoPlay] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStep(0);
    setVisibleSteps([0]);
    setDoneSteps([]);
    setAutoPlay(true);
    // Schedule first step to appear
    setTimeout(() => setDoneSteps([0]), 400);
  }, []);

  useEffect(() => {
    reset();
  }, [agentId, reset]);

  const advance = useCallback(() => {
    if (currentStep >= session.steps.length - 1) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    setVisibleSteps((prev) => [...prev, next]);
    setTimeout(() => {
      setDoneSteps((prev) => [...prev, next]);
    }, 400);
  }, [currentStep, session.steps.length]);

  // Auto-play timer
  useEffect(() => {
    if (!autoPlay) return;
    if (currentStep >= session.steps.length - 1) return;
    timerRef.current = setTimeout(() => {
      advance();
    }, 3500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoPlay, currentStep, advance, session.steps.length]);

  // Show initial step on reset
  useEffect(() => {
    if (currentStep === 0 && !visibleSteps.includes(0)) {
      setVisibleSteps([0]);
      setTimeout(() => setDoneSteps([0]), 400);
    }
  }, [currentStep, visibleSteps]);

  const step = session.steps[currentStep];
  const isComplete = currentStep >= session.steps.length - 1 && doneSteps.includes(currentStep);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(0,180,255,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}
          >
            {agent.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>{agent.name}</Title>
            <Text type="secondary">{agent.description}</Text>
          </div>
          <Space wrap>
            {agent.tools.map((t) => (
              <Tag key={t.label} color={t.color === 'gold' ? 'gold' : t.color === 'orange' ? 'orange' : t.color === 'cyan' ? 'cyan' : t.color === 'blue' ? 'blue' : t.color === 'purple' ? 'purple' : t.color === 'green' ? 'green' : 'red'}>
                {t.label}
              </Tag>
            ))}
          </Space>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Text type="secondary" style={{ fontSize: 13 }}>🟢 {session.title}</Text>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 11, color: '#8899b4' }}>自动播放</Text>
            <Switch
              size="small"
              checked={autoPlay}
              onChange={(v) => {
                setAutoPlay(v);
                if (timerRef.current) clearTimeout(timerRef.current);
              }}
            />
            <Button size="small" icon={<ReloadOutlined />} onClick={reset} style={{ borderColor: '#1a3055', color: '#8899b4' }}>
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: showHistory ? '280px 1fr 300px' : '1fr 300px', gap: 16, transition: 'all 0.3s' }}>
        {/* History sidebar */}
        {showHistory && (
          <Card
            title={
              <Space>
                <HistoryOutlined style={{ color: '#00b4ff' }} />
                <span style={{ fontSize: 13 }}>对话历史</span>
              </Space>
            }
            extra={
              <Button type="text" size="small" icon={<CloseOutlined />} style={{ color: '#8899b4' }} onClick={() => setShowHistory(false)} />
            }
            style={{ background: '#0a1628', border: '1px solid #1a3055' }}
            bodyStyle={{ padding: '8px 12px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}
          >
            {session.steps.slice(0, currentStep + 1).map((s, idx) => (
              <div
                key={s.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setVisibleSteps((prev) => Array.from(new Set([...prev, idx])));
                  setDoneSteps((prev) => Array.from(new Set([...prev, idx])));
                }}
                style={{
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 4,
                  background: currentStep === idx ? 'rgba(0,180,255,0.08)' : 'transparent',
                  border: currentStep === idx ? '1px solid rgba(0,180,255,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <Text style={{ fontSize: 11, color: currentStep === idx ? '#00b4ff' : '#8899b4' }} ellipsis>
                  {idx + 1}. {s.conversation.user ? s.conversation.user.slice(0, 30) + '...' : s.conversation.agent?.slice(0, 30) + '...'}
                </Text>
              </div>
            ))}
            {session.steps.length === 0 && <Empty description="暂无对话" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Card>
        )}

        {/* Center: Conversation */}
        <Card
          title={
            <Space>
              <RobotOutlined style={{ color: '#a78bfa' }} />
              <span style={{ fontSize: 14 }}>演示对话</span>
              <Tag>{currentStep + 1} / {session.steps.length}</Tag>
            </Space>
          }
          extra={
            <Space>
              <Button
                type="text"
                size="small"
                icon={showHistory ? <HistoryOutlined style={{ color: '#00b4ff' }} /> : <HistoryOutlined />}
                onClick={() => setShowHistory(!showHistory)}
                style={{ color: showHistory ? '#00b4ff' : '#8899b4' }}
              />
              {!autoPlay && (
                <Button
                  type="primary"
                  icon={<CaretRightOutlined />}
                  onClick={advance}
                  disabled={currentStep >= session.steps.length - 1}
                  style={{ background: 'linear-gradient(135deg, #00b4ff, #0958d9)' }}
                >
                  下一步
                </Button>
              )}
              {autoPlay && !isComplete && (
                <Button
                  icon={<PauseCircleOutlined />}
                  onClick={() => setAutoPlay(false)}
                  style={{ borderColor: '#1a3055', color: '#ff8c42' }}
                >
                  暂停
                </Button>
              )}
            </Space>
          }
          style={{ background: '#0a1628', border: '1px solid #1a3055' }}
          bodyStyle={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}
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
          {isComplete && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <CheckCircleFilled style={{ fontSize: 40, color: '#34d399', marginBottom: 8 }} />
              <div style={{ color: '#34d399', fontSize: 15, fontWeight: 600 }}>演示完成</div>
              <Text type="secondary">本次演示展示了 {agent.name} 的完整工作流程</Text>
              <div style={{ marginTop: 12 }}>
                <Button icon={<ReloadOutlined />} onClick={reset} style={{ borderColor: '#1a3055', color: '#8899b4' }}>
                  重新播放
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Right: Workflow */}
        <Card
          title={
            <Space>
              <ThunderboltOutlined style={{ color: '#ff8c42' }} />
              <span style={{ fontSize: 14 }}>工作过程</span>
            </Space>
          }
          style={{ background: '#0a1628', border: '1px solid #1a3055' }}
          bodyStyle={{ padding: '16px 20px', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}
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
