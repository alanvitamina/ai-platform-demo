import { Card, Col, Row, Statistic, Table, Tag, Typography, Space, Progress, Timeline } from 'antd';
import {
  SafetyOutlined,
  ApiOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  SecurityScanOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { costRecords, costByModel } from '../../mock/cost-data';

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
            title={<Space><ShieldOutlined style={{ color: '#ff5c6c' }} /><span>脱敏/反脱敏演示</span></Space>}
            style={{ background: '#0a1628', border: '1px solid #1a3055' }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <Timeline
              items={[
                { color: '#00b4ff', children: <div><Text strong style={{ color: '#00b4ff' }}>原始请求</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>"张三的手机号13812345678，身份证110101199001011234，电站A核心参数：最大功率5000kW"</Text></div> },
                { color: '#ff8c42', children: <div><Text strong style={{ color: '#ff8c42' }}>安全分级判定 → 内部级</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>规则命中：手机号、身份证号、核心参数关键词</Text></div> },
                { color: '#ff5c6c', children: <div><Text strong style={{ color: '#ff5c6c' }}>三层脱敏扫描</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>①正则→手机号、身份证 ②NER→"张三" ③词典→"5000kW"</Text></div> },
                { color: '#a78bfa', children: <div><Text strong style={{ color: '#a78bfa' }}>替换 & 记录映射</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>"人员A的手机[PHONE_001]，证件[CARD_001]，电站A核心参数：[REDACTED]" → 映射表 → Redis</Text></div> },
                { color: '#00e5c8', children: <div><Text strong style={{ color: '#00e5c8' }}>反脱敏还原</Text><br /><Text type="secondary" style={{ fontSize: 12 }}>云端返回→查Redis映射表→还原原始实体→返回完整结果给用户</Text></div> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// Shield icon fallback
function ShieldOutlined(props: any) {
  return <SafetyOutlined {...props} />;
}
