import { useState, useEffect, useRef } from 'react';
import { Input, Button, Typography, Tag, Space, Spin, Avatar, Grid, Drawer } from 'antd';
import { DeleteOutlined, SendOutlined, RobotOutlined, UserOutlined, ReloadOutlined, LoadingOutlined, CheckCircleFilled, ThunderboltOutlined, MenuOutlined, HistoryOutlined } from '@ant-design/icons';
import { sendMessage, getConversations, getMessages, deleteConversation } from '../services/api';
import { mockChatResponse } from '../services/mock-llm';

const { Text } = Typography;

interface Message {
  id: number;
  role: string;
  content: string;
}

interface WorkflowStep {
  label: string;
  icon: string;
  detail: string;
  color: string;
}

interface Props {
  agentId: number;
  agentName: string;
  agentEmoji: string;
  agentCategory?: string;
}

function getWorkflowSteps(agentName: string, userMsg: string): WorkflowStep[] {
  const hasCode = /\b(code|代码|function|def |class |import )/.test(userMsg);
  const hasAnalysis = /(分析|客户|需求|画像)/.test(userMsg);
  const hasPlan = /(方案|策划|计划|项目)/.test(userMsg);
  const hasPolicy = /(制度|规定|报销|差旅|假期|考勤|标准)/.test(userMsg);

  if (hasCode) {
    return [
      { label: '代码解析', icon: '📖', detail: 'AST语法分析 + 代码结构识别', color: '#00b4ff' },
      { label: '静态扫描', icon: '🔍', detail: '规则引擎扫描 → 编码规范', color: '#a78bfa' },
      { label: '安全审计', icon: '🛡️', detail: 'SQL注入/硬编码密钥/OWASP检测', color: '#ff5c6c' },
      { label: 'AI深度审查', icon: '🧠', detail: '模型推理：逻辑错误/命名/架构', color: '#ff8c42' },
      { label: '报告输出', icon: '📋', detail: '问题分级 + 修复建议 + 代码示例', color: '#34d399' },
    ];
  }
  if (hasAnalysis) {
    return [
      { label: '意图识别', icon: '🎯', detail: '识别分析目标：客户需求/数据/问题', color: '#00b4ff' },
      { label: '实体提取', icon: '🏷️', detail: '关键实体：人名/公司/金额/指标', color: '#a78bfa' },
      { label: '知识检索', icon: '🔍', detail: '向量库检索 → 匹配相似案例', color: '#00e5c8' },
      { label: '模型分析', icon: '🧠', detail: '模型推理 → 综合分析判断', color: '#ff8c42' },
      { label: '报告生成', icon: '📄', detail: '结构化输出 + 建议 + 参考来源', color: '#34d399' },
    ];
  }
  if (hasPlan) {
    return [
      { label: '需求解析', icon: '📋', detail: '提取项目关键参数和约束', color: '#00b4ff' },
      { label: '案例匹配', icon: '🔍', detail: '向量库检索相似规模和场景案例', color: '#00e5c8' },
      { label: '方案设计', icon: '✏️', detail: '技术方案框架生成', color: '#a78bfa' },
      { label: '投资测算', icon: '💰', detail: '财务模型计算 → IRR和回收期', color: '#ff8c42' },
      { label: '文档输出', icon: '📄', detail: '完整方案报告 + 实施建议', color: '#34d399' },
    ];
  }
  if (hasPolicy) {
    return [
      { label: '意图识别', icon: '🎯', detail: '制度查询类问题', color: '#00b4ff' },
      { label: '知识检索', icon: '🔍', detail: '向量检索 + 关键词匹配 → 制度文档库', color: '#00e5c8' },
      { label: '权限检查', icon: '🔒', detail: '验证用户可查看的文档范围', color: '#a78bfa' },
      { label: '答案生成', icon: '🧠', detail: '本地模型 → 提取制度原文 + 解读', color: '#ff8c42' },
      { label: '来源标注', icon: '📎', detail: '引用制度名称、章节号和原文', color: '#34d399' },
    ];
  }
  return [
    { label: '意图识别', icon: '🎯', detail: '理解用户输入意图和关键信息', color: '#00b4ff' },
    { label: '知识检索', icon: '🔍', detail: '向量库 + 关键词混合检索', color: '#00e5c8' },
    { label: '工具调用', icon: '🔧', detail: '根据需要调用相关API工具', color: '#a78bfa' },
    { label: '模型推理', icon: '🧠', detail: '模型综合分析 + 生成回复', color: '#ff8c42' },
    { label: '输出检查', icon: '✅', detail: '安全审核 → 格式化 → 输出', color: '#34d399' },
  ];
}

export default function ChatWindow({ agentId, agentName, agentEmoji }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<number | undefined>();
  const [convs, setConvs] = useState<any[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    loadConversations();
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    setMessages([]);
    setConvId(undefined);
    try {
      const list = await getConversations(agentId);
      setConvs(list);
    } catch { /* backend not running */ }
  };

  const loadConversation = async (cid: number) => {
    setConvId(cid);
    if (isMobile) setShowHistory(false);
    try {
      const msgs = await getMessages(cid);
      setMessages(msgs);
    } catch { setMessages([]); }
  };

  const handleDeleteConv = async (cid: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvs((prev) => prev.filter((c) => c.id !== cid));
    if (convId === cid) {
      setConvId(undefined);
      setMessages([]);
    }
    try { await deleteConversation(cid); } catch { /* backend not running */ }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    const steps = getWorkflowSteps(agentName, userMsg);
    setWorkflow(steps);
    setActiveStep(0);
    setDoneSteps([]);

    steps.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        setTimeout(() => setDoneSteps((prev) => [...prev, idx]), 400 + idx * 100);
      }, idx * 700);
    });

    const tempId = Date.now();
    setMessages((prev) => [...prev, { id: tempId, role: 'user', content: userMsg }]);

    // Show workflow panel on mobile when sending
    if (isMobile) setShowWorkflow(true);

    try {
      const res = await sendMessage(agentId, userMsg, convId);
      if (!convId) setConvId(res.conversation_id);
      if (res.message) {
        const totalAnimationTime = (steps.length - 1) * 700 + 600;
        setTimeout(() => {
          setMessages((prev) => [...prev, res.message]);
          setLoading(false);
        }, Math.min(totalAnimationTime, 2500));
      } else {
        setLoading(false);
      }
      loadConversations();
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: tempId + 1, role: 'assistant', content: mockChatResponse(agentId, agentName, userMsg) },
        ]);
        setLoading(false);
      }, 1500);
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('|') && line.includes('|', 1)) {
        const cells = line.split('|').filter(Boolean);
        return (
          <div key={i} style={{ display: 'flex', gap: 0, fontFamily: 'monospace', fontSize: 12, overflowX: 'auto' }}>
            {cells.map((c, j) => (
              <div key={j} style={{
                flex: j === 0 ? 2 : 1,
                padding: '2px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontWeight: i === 0 ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>{c.trim()}</div>
            ))}
          </div>
        );
      }

      let rendered = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:3px;font-family:monospace;font-size:12px">$1</code>');

      if (rendered.startsWith('### ')) return <div key={i} style={{ fontSize: 14, fontWeight: 700, marginTop: 12, marginBottom: 4 }}>{rendered.slice(4)}</div>;
      if (rendered.startsWith('## ')) return <div key={i} style={{ fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 4 }}>{rendered.slice(3)}</div>;
      if (rendered.startsWith('🔴') || rendered.startsWith('🟡') || rendered.startsWith('✅'))
        return <div key={i} style={{ lineHeight: 1.8, paddingLeft: 8 }} dangerouslySetInnerHTML={{ __html: rendered }} />;

      return <div key={i} style={{ lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  // Conversation list (reused in desktop sidebar and mobile drawer)
  const convList = (
    <div style={{ padding: '12px 0' }}>
      <div style={{ padding: '0 12px', marginBottom: 8 }}>
        <Button block type="primary" ghost size="small" icon={<ReloadOutlined />} onClick={() => { loadConversations(); if (isMobile) setShowHistory(false); }} style={{ borderColor: '#1a3055' }}>新对话</Button>
      </div>
      {convs.map((c) => (
        <div key={c.id} onClick={() => loadConversation(c.id)}
          style={{ padding: '10px 12px', cursor: 'pointer', background: convId === c.id ? 'rgba(0,180,255,0.08)' : 'transparent', borderLeft: convId === c.id ? '2px solid #00b4ff' : '2px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onMouseEnter={(e) => { if (convId !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={(e) => { if (convId !== c.id) e.currentTarget.style.background = 'transparent'; }}
        >
          <Text style={{ fontSize: 11, color: '#8899b4', flex: 1, minWidth: 0 }} ellipsis>{c.title}</Text>
          <DeleteOutlined
            onClick={(e) => handleDeleteConv(c.id, e)}
            style={{ fontSize: 11, color: '#4a5f80', marginLeft: 8, flexShrink: 0, cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5c6c'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#4a5f80'; }}
          />
        </div>
      ))}
      {convs.length === 0 && <div style={{ padding: 20, textAlign: 'center' }}><Text type="secondary" style={{ fontSize: 11 }}>暂无对话</Text></div>}
    </div>
  );

  // Workflow panel content
  const workflowContent = (
    <div style={{ padding: '12px 10px' }}>
      {workflow.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <div style={{ fontSize: 36, opacity: 0.3 }}>⚙️</div>
          <Text type="secondary" style={{ fontSize: 11 }}>发送消息后<br />此处展示工作过程</Text>
        </div>
      ) : (
        workflow.map((step, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '8px 4px', position: 'relative',
            opacity: doneSteps.includes(idx) ? 1 : idx === activeStep ? 1 : 0.35,
            transition: 'all 0.4s ease',
          }}>
            {idx < workflow.length - 1 && (
              <div style={{
                position: 'absolute', left: 15, top: 32, bottom: -4, width: 2,
                background: doneSteps.includes(idx) ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.05)',
                transition: 'background 0.4s',
              }} />
            )}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: doneSteps.includes(idx) ? `rgba(52,211,153,0.12)` : idx === activeStep ? `rgba(0,180,255,0.12)` : 'rgba(255,255,255,0.04)',
              border: `2px solid ${doneSteps.includes(idx) ? '#34d399' : idx === activeStep ? '#00b4ff' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, flexShrink: 0, zIndex: 1, transition: 'all 0.3s',
            }}>
              {idx === activeStep && !doneSteps.includes(idx) ? <LoadingOutlined style={{ color: '#00b4ff', fontSize: 11 }} /> : doneSteps.includes(idx) ? <CheckCircleFilled style={{ color: '#34d399', fontSize: 11 }} /> : <span style={{ color: step.color, fontSize: 12 }}>{step.icon}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: doneSteps.includes(idx) ? '#e8edf5' : idx === activeStep ? '#00b4ff' : '#4a5f80' }}>
                {step.label}
              </div>
              <div style={{ fontSize: 10, color: idx === activeStep ? '#00b4ff' : '#4a5f80', lineHeight: 1.5, marginTop: 1 }}>
                {step.detail}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 160px)', gap: 0, flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Desktop: conversation sidebar */}
      {!isMobile && (
        <div style={{ width: 200, borderRight: '1px solid #1a3055', overflowY: 'auto', background: 'rgba(6,11,20,0.5)', flexShrink: 0 }}>
          {convList}
        </div>
      )}

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a1628', minHeight: 0 }}>
        {/* Header */}
        <div style={{ padding: isMobile ? '8px 12px' : '10px 20px', borderBottom: '1px solid #1a3055', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isMobile && (
            <Button
              type="text"
              size="small"
              icon={<HistoryOutlined style={{ color: showHistory ? '#00b4ff' : '#8899b4' }} />}
              onClick={() => { setShowHistory(true); setShowWorkflow(false); }}
            />
          )}
          <span style={{ fontSize: isMobile ? 16 : 20 }}>{agentEmoji}</span>
          <Text strong style={{ color: '#e8edf5', fontSize: isMobile ? 13 : 14 }}>{agentName}</Text>
          {loading && <Spin size="small" style={{ marginLeft: 8 }} />}
          <div style={{ flex: 1 }} />
          {isMobile && (
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined style={{ color: showWorkflow ? '#ff8c42' : '#8899b4' }} />}
              onClick={() => { setShowWorkflow(!showWorkflow); setShowHistory(false); }}
            >
              <span style={{ fontSize: 11, color: '#8899b4' }}>过程</span>
            </Button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px 14px' : '20px 24px' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <RobotOutlined style={{ fontSize: 48, color: '#4a5f80', marginBottom: 16 }} />
              <div style={{ color: '#4a5f80', fontSize: 15, marginBottom: 8 }}>开始对话</div>
              <Text type="secondary">输入您的问题，Agent 将为您处理</Text>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 16, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease' }}>
                {msg.role === 'assistant' && (
                  <Avatar size={isMobile ? 28 : 32} style={{ background: 'rgba(0,180,255,0.12)', color: '#00b4ff', marginRight: 8, flexShrink: 0 }} icon={<RobotOutlined />} />
                )}
                <div className="chat-bubble" style={{
                  maxWidth: isMobile ? '90%' : '80%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1677ff, #0958d9)' : 'rgba(255,255,255,0.04)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                  color: msg.role === 'user' ? '#fff' : '#e8edf5',
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  padding: isMobile ? '10px 14px' : '12px 16px',
                  fontSize: isMobile ? 13 : 14,
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{renderContent(msg.content)}</div>
                </div>
                {msg.role === 'user' && (
                  <Avatar size={isMobile ? 28 : 32} style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', marginLeft: 8, flexShrink: 0 }} icon={<UserOutlined />} />
                )}
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <Avatar size={28} style={{ background: 'rgba(0,180,255,0.12)' }} icon={<RobotOutlined style={{ color: '#00b4ff' }} />} />
              <div style={{ display: 'flex', gap: 4 }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile: workflow panel inline */}
        {isMobile && showWorkflow && (
          <div style={{
            borderTop: '1px solid #1a3055',
            background: 'rgba(6,11,20,0.95)',
            maxHeight: 200,
            overflowY: 'auto',
            flexShrink: 0,
          }}>
            <div style={{ padding: '8px 14px', borderBottom: '1px solid #1a3055', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ThunderboltOutlined style={{ color: '#ff8c42', fontSize: 12 }} />
              <Text style={{ color: '#e8edf5', fontSize: 12, fontWeight: 600 }}>工作过程</Text>
            </div>
            {workflowContent}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: isMobile ? '10px 12px' : '14px 20px', borderTop: '1px solid #1a3055', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input.TextArea
              value={input} onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="输入问题，Enter 发送"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={loading}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1a3055', color: '#e8edf5', borderRadius: 10, fontSize: isMobile ? 13 : 14 }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}
              style={{ background: 'linear-gradient(135deg, #00b4ff, #0958d9)', border: 'none', borderRadius: 10, height: 'auto', padding: isMobile ? '8px 16px' : '8px 20px' }}>
              {isMobile ? '' : '发送'}
            </Button>
          </div>
          <Text type="secondary" style={{ fontSize: 10, marginTop: 4, display: 'block' }}>⚡ 演示模式 · 模拟模型响应</Text>
        </div>
      </div>

      {/* Desktop: workflow panel */}
      {!isMobile && (
        <div style={{ width: 280, borderLeft: '1px solid #1a3055', overflowY: 'auto', background: 'rgba(6,11,20,0.5)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a3055', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ThunderboltOutlined style={{ color: '#ff8c42' }} />
            <Text style={{ color: '#e8edf5', fontSize: 13, fontWeight: 600 }}>Agent 工作过程</Text>
          </div>
          <div style={{ flex: 1 }}>
            {workflowContent}
          </div>
        </div>
      )}

      {/* Mobile: history drawer */}
      {isMobile && (
        <Drawer
          title="对话历史"
          placement="left"
          width={240}
          open={showHistory}
          onClose={() => setShowHistory(false)}
          styles={{ body: { padding: 0, background: '#060b14' }, header: { background: '#060b14', color: '#e8edf5', borderBottom: '1px solid #1a3055' } }}
        >
          {convList}
        </Drawer>
      )}
    </div>
  );
}
