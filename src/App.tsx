import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import BasicLayout from './layouts/BasicLayout';
import Dashboard from './pages/Dashboard';
import AgentMarket from './pages/AgentMarket';
import CustomerAnalysis from './pages/CustomerAnalysis';
import CodeReview from './pages/CodeReview';
import ProjectPlanning from './pages/ProjectPlanning';
import KnowledgeQA from './pages/KnowledgeQA';
import Gateway from './pages/Gateway';
import AgentBuilder from './pages/AgentBuilder';
import KnowledgeBasePage from './pages/KnowledgeBase';

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00b4ff',
          colorBgBase: '#060b14',
          colorBgContainer: '#0f1d35',
          colorBgElevated: '#0f1d35',
          colorBorder: '#1a3055',
          colorText: '#e8edf5',
          colorTextSecondary: '#8899b4',
          borderRadius: 8,
          fontFamily: `'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        },
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="agents" element={<AgentMarket />} />
            <Route path="agent/customer-analysis" element={<CustomerAnalysis />} />
            <Route path="agent/code-review" element={<CodeReview />} />
            <Route path="agent/project-planning" element={<ProjectPlanning />} />
            <Route path="agent/knowledge-qa" element={<KnowledgeQA />} />
            <Route path="agent-builder" element={<AgentBuilder />} />
            <Route path="capabilities" element={<KnowledgeBasePage />} />
            <Route path="gateway" element={<Gateway />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}
