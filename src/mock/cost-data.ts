import type { CostRecord } from './types';

export const costRecords: CostRecord[] = [
  { id: '1', user: '张伟', department: '生产运营部', agent: '能耗分析报告 Agent', model: 'Claude Opus 4.7', tokens: 12500, cost: 0.18, time: '2026-04-28 14:32' },
  { id: '2', user: '李娜', department: '研发中心', agent: '代码审查 Agent', model: 'Claude Opus 4.7', tokens: 8200, cost: 0.12, time: '2026-04-28 14:28' },
  { id: '3', user: '王强', department: '综能西安销售部', agent: '客户需求分析 Agent', model: 'GPT-5.5', tokens: 15600, cost: 0.23, time: '2026-04-28 14:15' },
  { id: '4', user: '赵敏', department: '交付管理中心', agent: '项目方案生成 Agent', model: 'GLM-5.1', tokens: 21000, cost: 0.08, time: '2026-04-28 14:10' },
  { id: '5', user: '陈刚', department: '研发中心', agent: '内部知识问答 Agent', model: 'DeepSeek V4', tokens: 4800, cost: 0, time: '2026-04-28 13:55' },
  { id: '6', user: '刘芳', department: '生产运营部', agent: '设备故障诊断 Agent', model: 'Claude Opus 4.7', tokens: 18900, cost: 0.28, time: '2026-04-28 13:42' },
  { id: '7', user: '周雪', department: '总裁办', agent: '战略分析 Agent', model: 'Claude Opus 4.7', tokens: 18500, cost: 0.27, time: '2026-04-28 13:20' },
  { id: '8', user: '吴昊', department: '生产运营部', agent: '碳资产管理 Agent', model: 'GPT-5.5', tokens: 9500, cost: 0.14, time: '2026-04-28 12:48' },
  { id: '9', user: '林晓', department: '人力资源部', agent: '内部知识问答 Agent', model: 'DeepSeek V4', tokens: 3200, cost: 0, time: '2026-04-28 11:20' },
  { id: '10', user: '黄蕾', department: '人力资源部', agent: '智能合同评审 Agent', model: 'GLM-5.1', tokens: 2800, cost: 0.01, time: '2026-04-28 10:45' },
];

export const costSummary = {
  today: { total: 1.31, calls: 142, tokens: '168,300' },
  thisWeek: { total: 6.87, calls: 856, tokens: '942,000' },
  thisMonth: { total: 33.58, calls: 3420, tokens: '3,860,000' },
};

export const costByDept = [
  { dept: '生产运营部', cost: 8.92, color: '#00e5c8' },
  { dept: '总裁办', cost: 7.80, color: '#34d399' },
  { dept: '研发中心', cost: 7.45, color: '#a78bfa' },
  { dept: '综能西安销售部', cost: 6.23, color: '#f472b6' },
  { dept: '交付管理中心', cost: 3.18, color: '#ff8c42' },
  { dept: '人力资源部', cost: 0.35, color: '#60a5fa' },
];

export const costByModel = [
  { model: 'Claude Opus 4.7', cost: 12.45, color: '#ff8c42' },
  { model: 'GPT-5.5', cost: 6.78, color: '#00b4ff' },
  { model: 'GLM-5.1', cost: 4.92, color: '#a78bfa' },
  { model: 'MiMo V2.5', cost: 3.15, color: '#f472b6' },
  { model: 'DeepSeek V4 (本地)', cost: 0, color: '#34d399' },
];
