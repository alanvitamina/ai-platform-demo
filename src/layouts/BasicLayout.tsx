import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, theme as antdTheme } from 'antd';
import {
  DashboardOutlined,
  RobotOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  BuildOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '平台仪表盘',
  },
  {
    key: '/agents',
    icon: <AppstoreOutlined />,
    label: 'Agent 市场',
  },
  {
    key: 'demo',
    icon: <RobotOutlined />,
    label: 'Agent 演示',
    children: [
      { key: '/agent/customer-analysis', label: '🎯 客户需求分析' },
      { key: '/agent/code-review', label: '💻 代码审查' },
      { key: '/agent/project-planning', label: '📐 项目方案生成' },
      { key: '/agent/knowledge-qa', label: '💬 内部知识问答' },
    ],
  },
  {
    key: '/agent-builder',
    icon: <BuildOutlined />,
    label: 'Agent 搭建器',
  },
  {
    key: '/capabilities',
    icon: <ToolOutlined />,
    label: '能力管理',
  },
  {
    key: '/gateway',
    icon: <SafetyOutlined />,
    label: '模型网关监控',
  },
];

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const getSelectedKey = () => {
    const path = location.pathname;
    return path || '/';
  };

  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.startsWith('/agent/')) return ['demo'];
    return [];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        width={220}
        style={{
          background: '#060b14',
          borderRight: '1px solid #1a3055',
        }}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid #1a3055',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #00b4ff, #00e5c8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}
          >
            <ThunderboltOutlined style={{ color: '#fff' }} />
          </div>
          {!collapsed && (
            <Text strong style={{ color: '#e8edf5', fontSize: 16, marginLeft: 10, whiteSpace: 'nowrap' }}>
              思安新能源
            </Text>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#060b14',
            borderBottom: '1px solid #1a3055',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            height: 56,
          }}
        >
          <Text style={{ color: '#8899b4', fontSize: 13 }}>
            {(() => {
              const topLevel = menuItems.find((m) => m.key === getSelectedKey());
              if (topLevel) return topLevel.label;
              for (const m of menuItems) {
                if (m.children) {
                  const child = m.children.find((c) => c?.key === getSelectedKey());
                  if (child) return `${m.label} / ${child.label}`;
                }
              }
              return '';
            })()}
          </Text>
        </Header>
        <Content
          style={{
            padding: 24,
            background: 'transparent',
            overflow: 'auto',
            height: 'calc(100vh - 56px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
