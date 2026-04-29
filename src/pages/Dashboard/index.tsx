import { Card, Col, Row, Space, Statistic, Table, Tag, Progress, Typography } from 'antd';
import {
  RobotOutlined,
  UserOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  SafetyOutlined,
  ApiOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { costSummary, costRecords, costByDept, costByModel } from '../../mock/cost-data';
import { architectureLayers } from '../../mock/architecture';
import { allAgents } from '../../mock/agents';

const { Text, Title } = Typography;

const costColumns = [
  { title: '时间', dataIndex: 'time', key: 'time', width: 140, render: (v: string) => <Text style={{ fontSize: 12, color: '#8899b4' }}>{v}</Text> },
  { title: '用户', dataIndex: 'user', key: 'user', width: 80 },
  { title: '部门', dataIndex: 'department', key: 'dept', width: 100 },
  { title: 'Agent', dataIndex: 'agent', key: 'agent', width: 140, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> },
  { title: '模型', dataIndex: 'model', key: 'model', width: 140, render: (v: string) => <Tag color={v.includes('Claude') ? 'orange' : v.includes('GPT') ? 'blue' : v.includes('DeepSeek') ? 'green' : 'purple'}>{v}</Tag> },
  { title: 'Token', dataIndex: 'tokens', key: 'tokens', width: 80, render: (v: number) => v.toLocaleString() },
  { title: '费用', dataIndex: 'cost', key: 'cost', width: 80, render: (v: number) => <Text style={{ color: v > 0 ? '#ff8c42' : '#34d399', fontWeight: 600 }}>{v > 0 ? `$${v.toFixed(2)}` : '免费'}</Text> },
];

export default function Dashboard() {
  const demoCount = allAgents.filter((a) => a.demo).length;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>AI Agent 平台仪表盘</Title>
        <Text type="secondary">思安新能源 · 智慧综合能源服务 AI 平台运行概览</Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up">
            <Statistic title="预置 Agent" value={allAgents.length} prefix={<RobotOutlined style={{ color: '#a78bfa' }} />} suffix={<Text style={{ fontSize: 13, color: '#34d399' }}>其中{demoCount}个可演示</Text>} valueStyle={{ color: '#a78bfa', fontSize: 32 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <Statistic title="平台用户" value={586} prefix={<UserOutlined style={{ color: '#00b4ff' }} />} suffix={<Text style={{ fontSize: 13, color: '#34d399' }}>覆盖97.7%</Text>} valueStyle={{ color: '#00b4ff', fontSize: 32 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <Statistic title="今日模型调用" value={142} prefix={<ApiOutlined style={{ color: '#ff8c42' }} />} suffix={<span style={{ fontSize: 14, color: '#34d399' }}><ArrowUpOutlined /> 12%</span>} valueStyle={{ color: '#ff8c42', fontSize: 32 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.3s' }}>
            <Statistic title="今日成本" value={1.29} prefix={<DollarOutlined style={{ color: '#34d399' }} />} suffix={<Text style={{ fontSize: 13, color: '#8899b4' }}>USD</Text>} valueStyle={{ color: '#34d399', fontSize: 32 }} precision={2} />
          </div>
        </Col>
      </Row>

      {/* Architecture diagram */}
      <Card
        title={<Space><ClusterOutlined style={{ color: '#00b4ff' }} /><span>五层平台架构</span></Space>}
        style={{ background: '#0a1628', border: '1px solid #1a3055', marginBottom: 24 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {architectureLayers.map((layer, idx) => (
            <div key={idx}>
              <div
                className="anim-fade-up"
                style={{
                  background: `rgba(255,255,255,0.02)`,
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${layer.color}`,
                  borderRadius: 8,
                  padding: '14px 20px',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderLeftWidth = '6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderLeftWidth = '3px';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{layer.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: layer.color }}>{layer.name}</span>
                  <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{layer.nameEn}</Text>
                </div>
                {/* Capability layer: compact 3×2 card grid */}
                {idx === 2 ? (
                  <div className="capability-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingLeft: 30 }}>
                    {layer.items.map((item, i) => {
                      const icons = ['🔍', '🧩', '💾', '🛡️', '✋', '📊'];
                      return (
                        <div key={i} style={{
                          background: 'rgba(255,255,255,0.015)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          borderLeft: `2px solid ${layer.color}40`,
                          borderRadius: 6,
                          padding: '10px 12px',
                          display: 'flex', gap: 10, alignItems: 'flex-start',
                        }}>
                          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icons[i]}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#e8edf5', fontWeight: 600, fontSize: 12, marginBottom: 3 }}>{item.title}</div>
                            <div style={{ color: '#4a5f80', fontSize: 11, lineHeight: 1.5 }}>
                              {item.desc.split('·').slice(0, 2).map((part, j) => (
                                <div key={j}>{part.trim()}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="arch-sub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, paddingLeft: 30 }}>
                    {layer.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 12 }}>
                        <div style={{ color: '#e8edf5', fontWeight: 500, marginBottom: 2 }}>{item.title}</div>
                        <div style={{ color: '#4a5f80', lineHeight: 1.7 }}>
                          {item.desc.split('·').map((part, j) => (
                            <div key={j}>{part.trim()}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {idx < architectureLayers.length - 1 && (
                <div style={{ textAlign: 'center', padding: '2px 0', color: '#1a3055', fontSize: 16 }}>↓</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security highlight */}
      <div className="security-banner" style={{
        background: 'rgba(255,92,108,0.04)',
        border: '1px solid rgba(255,92,108,0.15)',
        borderLeft: '3px solid #ff5c6c',
        borderRadius: '0 8px 8px 0',
        padding: '14px 20px',
        marginBottom: 24,
        fontSize: 13,
        color: '#8899b4',
        lineHeight: 1.8,
      }}>
        <strong style={{ color: '#ff5c6c' }}>🛡️ 安全架构核心：两阶段拦截 + 动态熔断</strong><br />
        <strong>第一阶段（网关入口）：</strong>用户输入经正则+词典+NER 三层脱敏扫描，按数据级别路由到云端或本地模型。<br />
        <strong>第二阶段（RAG 出口）：</strong>RAG 检索完成后、模型推理前，二次校验检索结果的数据级别。如用户问题不涉密但检索命中机密知识，<strong style={{ color: '#ff8c42' }}>动态熔断立即触发</strong>——切换本地模型、过滤机密片段或拒绝请求。
      </div>

      {/* Cost & Calls */}
      <Row gutter={[16, 16]} style={{ alignItems: 'stretch' }}>
        <Col xs={24} lg={17} style={{ display: 'flex' }}>
          <Card
            title={<Space><SafetyOutlined style={{ color: '#ff8c42' }} /><span>模型调用实时明细</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055', flex: 1, display: 'flex', flexDirection: 'column' }}
            styles={{ body: { padding: 0, flex: 1, overflow: 'auto' } }}
          >
            <Table
              columns={costColumns}
              dataSource={costRecords}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ x: 700 }}
              style={{ background: 'transparent' }}
              locale={{ emptyText: '暂无数据' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={7} style={{ display: 'flex' }}>
          <Card
            title={<Space><DollarOutlined style={{ color: '#34d399' }} /><span>成本分布</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055', flex: 1 }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, color: '#8899b4', marginBottom: 8, display: 'block' }}>按部门</Text>
              {costByDept.map((d) => (
                <div key={d.dept} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 100, fontSize: 12, color: '#8899b4', textAlign: 'right' }}>{d.dept}</div>
                  <div style={{ flex: 1 }}>
                    <Progress percent={Math.round((d.cost / 30) * 100)} size="small" strokeColor={d.color} trailColor="rgba(255,255,255,0.04)" showInfo={false} />
                  </div>
                  <div style={{ width: 60, fontSize: 12, color: '#e8edf5', fontWeight: 600 }}>${d.cost.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div>
              <Text style={{ fontSize: 12, color: '#8899b4', marginBottom: 8, display: 'block' }}>按模型</Text>
              {costByModel.map((m) => (
                <div key={m.model} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 100, fontSize: 11, color: '#8899b4', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.model}</div>
                  <div style={{ flex: 1 }}>
                    <Progress percent={Math.round((m.cost / 15) * 100)} size="small" strokeColor={m.color} trailColor="rgba(255,255,255,0.04)" showInfo={false} />
                  </div>
                  <div style={{ width: 60, fontSize: 12, color: '#e8edf5', fontWeight: 600 }}>${m.cost.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
