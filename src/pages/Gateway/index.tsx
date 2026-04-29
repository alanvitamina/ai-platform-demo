import { Card, Col, Row, Statistic, Table, Tag, Typography, Space, Progress } from 'antd';
import {
  ApiOutlined,
  DollarOutlined,
  CloudServerOutlined,
  SecurityScanOutlined,
  SwapOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { costByModel } from '../../mock/cost-data';

const { Text, Title } = Typography;

const routeColumns = [
  { title: '数据等级', dataIndex: 'level', key: 'level', width: 100, render: (v: string) => <Tag color={v === '公开级' ? 'green' : v === '内部级' ? 'blue' : v === '机密级' ? 'orange' : 'red'}>{v}</Tag> },
  { title: '路由策略', dataIndex: 'strategy', key: 'strategy' },
  { title: '可用模型', dataIndex: 'models', key: 'models', render: (v: string[]) => <Space>{v.map((m) => <Tag key={m}>{m}</Tag>)}</Space> },
  { title: '脱敏要求', dataIndex: 'desensitize', key: 'desensitize' },
];

const routeData = [
  { level: '公开级', strategy: '可调用任意云端模型', models: ['Claude Opus', 'GPT-5.5', 'GLM-5.1', 'MiMo'], desensitize: '无需脱敏' },
  { level: '内部级', strategy: '国内云端模型优先 + DPA协议', models: ['GLM-5.1', 'MiMo', '豆包'], desensitize: '基础脱敏（正则）' },
  { level: '机密级', strategy: '仅本地模型 · Gateway强制拦截云端请求', models: ['DeepSeek V4', 'Ollama集群'], desensitize: '数据不出域' },
  { level: '绝密级', strategy: '物理隔离 · 不接入平台', models: ['—'], desensitize: '完全离线' },
];

const costColumns = [
  { title: '模型', dataIndex: 'model', key: 'model', width: 160, render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text> },
  { title: '本月费用', dataIndex: 'cost', key: 'cost', width: 100, render: (v: number) => <Text style={{ color: v > 0 ? '#ff8c42' : '#34d399', fontWeight: 600 }}>{v > 0 ? `$${v.toFixed(2)}` : '免费（本地）'}</Text> },
  { title: '占比', dataIndex: 'pct', key: 'pct', width: 180, render: (v: number) => <Progress percent={v} size="small" strokeColor="#ff8c42" trailColor="rgba(255,255,255,0.04)" /> },
];

const totalCost = costByModel.reduce((s, m) => s + m.cost, 0);

export default function Gateway() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>模型网关监控</Title>
        <Text type="secondary">统一路由 · 安全脱敏 · 成本追踪</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up">
            <Statistic title="接入模型数" value={6} prefix={<CloudServerOutlined style={{ color: '#ff8c42' }} />} suffix={<Text style={{ fontSize: 13, color: '#34d399' }}>4云端+2本地</Text>} valueStyle={{ color: '#ff8c42', fontSize: 28 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <Statistic title="今日调用次数" value={142} prefix={<ApiOutlined style={{ color: '#00b4ff' }} />} valueStyle={{ color: '#00b4ff', fontSize: 28 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.2s' }}>
            <Statistic title="今日拦截" value={8} prefix={<SecurityScanOutlined style={{ color: '#ff5c6c' }} />} suffix={<Text style={{ fontSize: 13, color: '#ff5c6c' }}>机密级→云端</Text>} valueStyle={{ color: '#ff5c6c', fontSize: 28 }} />
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="stat-card anim-fade-up" style={{ animationDelay: '0.3s' }}>
            <Statistic title="月成本" value={28.45} prefix={<DollarOutlined style={{ color: '#34d399' }} />} suffix={<Text style={{ fontSize: 13, color: '#8899b4' }}>USD</Text>} valueStyle={{ color: '#34d399', fontSize: 28 }} precision={2} />
          </div>
        </Col>
      </Row>

      {/* Routing table */}
      <Card
        title={<Space><SwapOutlined style={{ color: '#ff8c42' }} /><span>数据安全分级路由策略</span></Space>}
        style={{ background: '#0a1628', border: '1px solid #1a3055', marginBottom: 24 }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={routeColumns}
          dataSource={routeData}
          rowKey="level"
          pagination={false}
          scroll={{ x: 500 }}
          style={{ background: 'transparent' }}
        />
      </Card>

      {/* Cost + demo */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<Space><DollarOutlined style={{ color: '#34d399' }} /><span>按模型成本分布（本月）</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055' }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            {costByModel.map((m) => (
              <div key={m.model} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13 }}>{m.model}</Text>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: m.cost > 0 ? '#ff8c42' : '#34d399' }}>
                    ${m.cost.toFixed(2)}
                  </Text>
                </div>
                <Progress percent={Math.round((m.cost / totalCost) * 100)} strokeColor={m.color} trailColor="rgba(255,255,255,0.04)" />
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>合计</Text>
                <Text strong style={{ color: '#ff8c42', fontSize: 16 }}>${totalCost.toFixed(2)}</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<Space><StopOutlined style={{ color: '#ff5c6c' }} /><span>网关拦截实时监控</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055' }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 12, color: '#8899b4', marginBottom: 8, display: 'block' }}>拦截次数 · 按数据等级</Text>
              {[
                { level: '机密级→云端', count: 5, pct: 62, color: '#ff5c6c' },
                { level: '绝密级→任意', count: 2, pct: 25, color: '#ff5c6c' },
                { level: '内部级→海外', count: 1, pct: 13, color: '#ff8c42' },
              ].map((d) => (
                <div key={d.level} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 100, fontSize: 11, color: '#8899b4', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.level}</div>
                  <div style={{ flex: 1 }}>
                    <Progress percent={d.pct} size="small" strokeColor={d.color} trailColor="rgba(255,255,255,0.04)" showInfo={false} />
                  </div>
                  <div style={{ width: 40, fontSize: 12, color: d.color, fontWeight: 600 }}>{d.count}次</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <Text style={{ fontSize: 12, color: '#8899b4', marginBottom: 8, display: 'block' }}>模型响应延迟 (ms)</Text>
              {[
                { model: 'Claude Opus 4.7', latency: 1200, pct: 85, color: '#ff8c42' },
                { model: 'GPT-5.5', latency: 980, pct: 70, color: '#00b4ff' },
                { model: 'GLM-5.1', latency: 650, pct: 46, color: '#a78bfa' },
                { model: 'DeepSeek V4 (本地)', latency: 420, pct: 30, color: '#34d399' },
              ].map((m) => (
                <div key={m.model} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 120, fontSize: 10, color: '#8899b4', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.model}</div>
                  <div style={{ flex: 1 }}>
                    <Progress percent={m.pct} size="small" strokeColor={m.color} trailColor="rgba(255,255,255,0.04)" showInfo={false} />
                  </div>
                  <div style={{ width: 48, fontSize: 12, color: '#e8edf5', fontWeight: 600 }}>{m.latency}ms</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#4a5f80' }}>网关健康状态</Text>
                <Space size={4}>
                  <Tag color="green">路由服务 OK</Tag>
                  <Tag color="green">脱敏引擎 OK</Tag>
                  <Tag color="green">限流模块 OK</Tag>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 7-step security flow */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title={<Space><SwapOutlined style={{ color: '#00b4ff' }} /><span>完整安全链路：入口脱敏 → 路由 → RAG → 二次校验 → 推理 → 反脱敏</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055' }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', gap: 0, padding: '8px 0' }}>
              {[
                { num: 1, title: '用户请求', desc: 'Agent 调用模型', color: '#00b4ff' },
                { num: 2, title: '入口脱敏', desc: '正则+词典(网关)\nNER(Sidecar)', color: '#ffd166' },
                { num: 3, title: '路由决策', desc: '按数据级别\n云端/本地', color: '#a78bfa' },
                { num: 4, title: 'RAG 检索', desc: '向量+关键词\n混合检索', color: '#00e5c8' },
                { num: 5, title: '🔴 二次校验', desc: '检查检索结果级别\n命中机密→动态熔断', color: '#ff5c6c', highlight: true },
                { num: 6, title: '模型推理', desc: '安全上下文\n送入模型', color: '#ff8c42' },
                { num: 7, title: '反脱敏还原', desc: '映射表还原\n返回用户', color: '#34d399' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div className="gateway-step-card" style={{
                    width: 120, padding: '12px 10px', borderRadius: 8, textAlign: 'center',
                    background: step.highlight ? 'rgba(255,92,108,0.08)' : 'rgba(255,255,255,0.02)',
                    border: step.highlight ? '2px solid rgba(255,92,108,0.3)' : '1px solid rgba(255,255,255,0.04)',
                    ...(step.highlight ? { animation: 'breakerPulse 2s infinite' } : {}),
                  }}>
                    <div style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 600,
                      padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginBottom: 6,
                      background: `${step.color}15`, color: step.color,
                    }}>
                      {step.num}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: step.color, marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 10, color: '#4a5f80', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{step.desc}</div>
                  </div>
                  {i < 6 && (
                    <div style={{ fontSize: 14, color: '#1a3055', padding: '0 2px' }}>→</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}