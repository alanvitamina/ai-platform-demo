import { useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Button, Space } from 'antd';
import {
  ExperimentOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getAgentsByCategory, agentCategories } from '../../mock/agents';

const { Text, Title, Paragraph } = Typography;

export default function AgentMarket() {
  const navigate = useNavigate();
  const grouped = getAgentsByCategory();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>Agent 市场</Title>
        <Text type="secondary">5大业务域 · {grouped.reduce((s, g) => s + g.agents.length, 0)}个预置 Agent · 员工可克隆和二次修改</Text>
      </div>

      {grouped.map(({ category, agents }) => (
        <div key={category.key} style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            paddingBottom: 12, marginBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: category.bg, color: category.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {category.icon}
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: category.color }}>{category.name}</span>
            <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: 12, marginLeft: 'auto' }}>
              {agents.length} AGENTS
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {agents.map((agent) => (
              <Card
                key={agent.id}
                hoverable
                style={{
                  background: '#0a1628', border: '1px solid #1a3055',
                  position: 'relative', overflow: 'hidden',
                  cursor: agent.demo ? 'pointer' : 'default',
                }}
                bodyStyle={{ padding: '20px 22px' }}
                onClick={() => agent.demo && navigate(agent.demoPath!)}
              >
                {agent.demo && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'linear-gradient(135deg, #00e5c8, #00b4ff)',
                    color: '#000', fontSize: 10, fontWeight: 700,
                    padding: '2px 10px', borderRadius: 4,
                  }}>
                    <ExperimentOutlined /> 可演示
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e8edf5', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{agent.emoji}</span>
                  <span>{agent.name}</span>
                </div>
                <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.6 }} ellipsis={{ rows: 2 }}>
                  {agent.description}
                </Paragraph>
                <Space size={4}>
                  {agent.tools.map((t) => (
                    <Tag key={t.label} color={t.color === 'gold' ? 'gold' : t.color === 'orange' ? 'orange' : t.color === 'cyan' ? 'cyan' : t.color === 'blue' ? 'blue' : t.color === 'purple' ? 'purple' : t.color === 'green' ? 'green' : 'red'}>
                      {t.label}
                    </Tag>
                  ))}
                </Space>
                {agent.demo && (
                  <div style={{ marginTop: 12 }}>
                    <Button type="primary" size="small" ghost icon={<ThunderboltOutlined />}
                      style={{ borderColor: '#00e5c8', color: '#00e5c8' }}>
                      进入演示
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
