import type { Agent } from './types';

export const agentCategories = [
  { key: 'energy', name: '智慧综合能源服务', icon: '⚡', color: '#00e5c8', bg: 'rgba(0,229,200,0.1)' },
  { key: 'rd', name: '研发场景', icon: '🔬', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { key: 'marketing', name: '营销场景', icon: '📣', color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  { key: 'project', name: '工程项目交付', icon: '🏗️', color: '#ff8c42', bg: 'rgba(255,140,66,0.1)' },
  { key: 'admin', name: '职能后台', icon: '🏢', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
];

export const allAgents: Agent[] = [
  // 智慧综合能源服务
  { id: 'energy-scheduling', name: '能源调度优化 Agent', emoji: '⚡', description: '基于多能互补模型，结合实时负荷数据与天气预测，生成源-网-荷-储协同调度方案', category: 'energy', categoryColor: '#00e5c8', tools: [{ label: '时序数据库', color: 'gold' }, { label: '云端模型', color: 'orange' }, { label: '天气API', color: 'blue' }] },
  { id: 'energy-report', name: '能耗分析报告 Agent', emoji: '📊', description: '自动采集各能源站运行数据，生成日/周/月能耗分析报告，识别节能优化空间', category: 'energy', categoryColor: '#00e5c8', tools: [{ label: '时序数据库', color: 'gold' }, { label: '向量知识库', color: 'cyan' }, { label: '飞书文档', color: 'blue' }] },
  { id: 'energy-fault', name: '设备故障诊断 Agent', emoji: '🔧', description: '结合设备实时告警与历史故障知识图谱，智能定位故障根因并推荐维修方案', category: 'energy', categoryColor: '#00e5c8', tools: [{ label: '图数据库', color: 'purple' }, { label: '时序数据库', color: 'gold' }, { label: '向量知识库', color: 'cyan' }] },
  { id: 'energy-carbon', name: '碳资产管理 Agent', emoji: '📈', description: '追踪碳排放数据，管理碳配额与CCER，辅助碳交易决策与碳中和路径规划', category: 'energy', categoryColor: '#00e5c8', tools: [{ label: '结构化数据库', color: 'green' }, { label: '时序数据库', color: 'gold' }, { label: '向量知识库', color: 'cyan' }] },

  // 研发场景
  { id: 'rd-simulation', name: '能源产品建模仿真 Agent', emoji: '🧪', description: '辅助能源产品的参数建模与仿真分析，自动生成仿真配置与结果解读', category: 'rd', categoryColor: '#a78bfa', tools: [{ label: '云端模型', color: 'orange' }, { label: '向量知识库', color: 'cyan' }, { label: '仿真工具API', color: 'blue' }] },
  { id: 'rd-doc', name: '研发技术文档 Agent', emoji: '📄', description: '根据研发过程数据自动生成产品规格书、测试报告、专利申请书等文档', category: 'rd', categoryColor: '#a78bfa', tools: [{ label: '云端模型', color: 'orange' }, { label: '向量知识库', color: 'cyan' }, { label: '飞书文档', color: 'blue' }] },
  { id: 'rd-search', name: '研发知识检索 Agent', emoji: '🔍', description: '检索技术标准、行业论文、专利库、内部研发笔记，辅助研发人员快速获取技术参考', category: 'rd', categoryColor: '#a78bfa', tools: [{ label: '向量知识库', color: 'cyan' }, { label: '云端模型', color: 'orange' }, { label: '网页搜索', color: 'blue' }] },
  { id: 'rd-code-review', name: '代码审查 Agent', emoji: '💻', description: '自动审查代码提交，识别潜在Bug、安全漏洞和编码规范问题，给出修改建议', category: 'rd', categoryColor: '#a78bfa', tools: [{ label: '云端模型', color: 'orange' }, { label: 'Git API', color: 'blue' }, { label: '编码规范库', color: 'cyan' }], demo: true, demoPath: '/agent/code-review' },

  // 营销场景
  { id: 'mkt-plan', name: '营销方案策划 Agent', emoji: '📝', description: '基于行业趋势和竞品分析，生成综合能源服务的营销方案、话术与推广策略', category: 'marketing', categoryColor: '#f472b6', tools: [{ label: '云端模型', color: 'orange' }, { label: '向量知识库', color: 'cyan' }, { label: '网页搜索', color: 'blue' }] },
  { id: 'mkt-intel', name: '竞品情报分析 Agent', emoji: '📊', description: '自动采集综合能源行业竞品动态、政策变化、市场趋势，生成定期情报简报', category: 'marketing', categoryColor: '#f472b6', tools: [{ label: '云端模型', color: 'orange' }, { label: '网页搜索', color: 'blue' }, { label: '飞书文档', color: 'blue' }] },
  { id: 'mkt-customer', name: '客户需求分析 Agent', emoji: '🎯', description: '分析客户沟通记录与需求文档，提炼关键诉求，生成客户需求画像与解决方案建议', category: 'marketing', categoryColor: '#f472b6', tools: [{ label: '云端模型', color: 'orange' }, { label: '向量知识库', color: 'cyan' }, { label: '结构化数据库', color: 'green' }], demo: true, demoPath: '/agent/customer-analysis' },

  // 工程项目交付
  { id: 'proj-plan', name: '项目方案生成 Agent', emoji: '📐', description: '基于历史项目案例库和客户需求，自动生成综合能源项目初步方案与投资测算', category: 'project', categoryColor: '#ff8c42', tools: [{ label: '向量知识库', color: 'cyan' }, { label: '图数据库', color: 'purple' }, { label: '云端模型', color: 'orange' }], demo: true, demoPath: '/agent/project-planning' },
  { id: 'proj-track', name: '施工进度跟踪 Agent', emoji: '📋', description: '汇总项目各节点进度数据，自动识别延期风险，生成进度报告并推送预警通知', category: 'project', categoryColor: '#ff8c42', tools: [{ label: '结构化数据库', color: 'green' }, { label: '飞书审批', color: 'blue' }, { label: '飞书通知', color: 'blue' }] },
  { id: 'proj-doc', name: '竣工文档整理 Agent', emoji: '📑', description: '自动归集项目过程文档，按验收标准整理竣工资料清单，检查完整性与合规性', category: 'project', categoryColor: '#ff8c42', tools: [{ label: '向量知识库', color: 'cyan' }, { label: '飞书文档', color: 'blue' }, { label: '云端模型', color: 'orange' }] },

  // 职能后台
  { id: 'admin-contract', name: '智能合同评审 Agent', emoji: '📝', description: '自动审查合同条款，识别法律风险、付款条件异常、责任条款缺失等问题', category: 'admin', categoryColor: '#34d399', tools: [{ label: '云端模型', color: 'orange' }, { label: '合同模板库', color: 'cyan' }, { label: '飞书审批', color: 'blue' }] },
  { id: 'admin-finance', name: '智能财报生成 Agent', emoji: '📊', description: '自动归集各业务线财务数据，生成月度/季度/年度财务报告，附带关键指标分析', category: 'admin', categoryColor: '#34d399', tools: [{ label: '结构化数据库', color: 'green' }, { label: '云端模型', color: 'orange' }, { label: '飞书文档', color: 'blue' }] },
  { id: 'admin-hr', name: '智能人才推荐 Agent', emoji: '👤', description: '基于岗位需求画像与内部人才库，匹配技能、经验等维度，推荐候选人', category: 'admin', categoryColor: '#34d399', tools: [{ label: '结构化数据库', color: 'green' }, { label: '云端模型', color: 'orange' }, { label: '向量知识库', color: 'cyan' }] },
  { id: 'admin-qa', name: '内部知识问答 Agent', emoji: '💬', description: '基于飞书文档自动同步的知识库，回答公司制度、流程规范、技术标准等内部问题', category: 'admin', categoryColor: '#34d399', tools: [{ label: '向量知识库', color: 'cyan' }, { label: '飞书文档同步', color: 'blue' }, { label: '本地模型', color: 'red' }], demo: true, demoPath: '/agent/knowledge-qa' },
  { id: 'admin-weekly', name: '周报/日报生成 Agent', emoji: '📊', description: '自动汇总个人或团队的工作记录、任务完成情况，生成结构化周报/日报并发送飞书', category: 'admin', categoryColor: '#34d399', tools: [{ label: '云端模型', color: 'orange' }, { label: '飞书日历', color: 'blue' }, { label: '飞书文档', color: 'blue' }] },
];

export function getAgentById(id: string): Agent | undefined {
  return allAgents.find((a) => a.id === id);
}

export function getAgentsByCategory(): Array<{ category: typeof agentCategories[0]; agents: Agent[] }> {
  return agentCategories.map((cat) => ({
    category: cat,
    agents: allAgents.filter((a) => a.category === cat.key),
  }));
}
