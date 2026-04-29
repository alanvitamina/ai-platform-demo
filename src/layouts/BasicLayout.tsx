import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Drawer, Button, Grid } from 'antd';
import {
  DashboardOutlined,
  RobotOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  BuildOutlined,
  MenuOutlined,
  SafetyOutlined,
  SwapOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '平台仪表盘' },
  { key: '/data-flow', icon: <SwapOutlined />, label: '数据安全流转' },
  { key: '/agents', icon: <AppstoreOutlined />, label: 'Agent 市场' },
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
  { key: '/agent-builder', icon: <BuildOutlined />, label: 'Agent 搭建器' },
  { key: '/capabilities', icon: <ToolOutlined />, label: '能力管理' },
  { key: '/gateway', icon: <SafetyOutlined />, label: '模型网关监控' },
];

const Logo = ({ collapsed, onClick }: { collapsed?: boolean; onClick?: () => void }) => (
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
    onClick={onClick}
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
);

function getBreadcrumb(pathname: string): string {
  const topLevel = menuItems.find((m) => m.key === pathname);
  if (topLevel) return topLevel.label;
  for (const m of menuItems) {
    if (m.children) {
      const child = m.children.find((c) => c?.key === pathname);
      if (child) return `${m.label} / ${child.label}`;
    }
  }
  return '';
}

function getSelectedKey(pathname: string): string {
  return pathname || '/';
}

function getOpenKeys(pathname: string): string[] {
  if (pathname.startsWith('/agent/')) return ['demo'];
  return [];
}

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const selectedKey = getSelectedKey(location.pathname);
  const openKeys = getOpenKeys(location.pathname);
  const breadcrumb = getBreadcrumb(location.pathname);

  const menuNode = (
    <>
      <Logo collapsed={false} onClick={() => { navigate('/'); setDrawerOpen(false); }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={({ key }) => { navigate(key); setDrawerOpen(false); }}
        style={{ background: 'transparent', borderRight: 0, marginTop: 8 }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile ? (
        <>
          {/* Mobile header */}
          <Header
            style={{
              background: '#060b14',
              borderBottom: '1px solid #1a3055',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              height: 56,
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}
          >
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20, color: '#e8edf5' }} />}
              onClick={() => setDrawerOpen(true)}
              style={{ marginRight: 12 }}
            />
            <div
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'linear-gradient(135deg, #00b4ff, #00e5c8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, flexShrink: 0, marginRight: 10,
              }}
            >
              <ThunderboltOutlined style={{ color: '#fff' }} />
            </div>
            <Text strong style={{ color: '#e8edf5', fontSize: 15, flex: 1 }}>思安新能源</Text>
            <Text style={{ color: '#8899b4', fontSize: 12 }}>{breadcrumb}</Text>
          </Header>

          {/* Mobile drawer */}
          <Drawer
            placement="left"
            width={240}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            styles={{
              body: { padding: 0, background: '#060b14' },
              header: { display: 'none' },
            }}
          >
            {menuNode}
          </Drawer>

          <Content
            style={{
              padding: 16,
              background: 'transparent',
              overflow: 'auto',
              height: 'calc(100vh - 56px)',
            }}
          >
            <Outlet />
          </Content>
        </>
      ) : (
        <>
          {/* Desktop sidebar */}
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
            <Logo collapsed={collapsed} onClick={() => navigate('/')} />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              defaultOpenKeys={openKeys}
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
              <Text style={{ color: '#8899b4', fontSize: 13 }}>{breadcrumb}</Text>
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
        </>
      )}
    </Layout>
  );
}
