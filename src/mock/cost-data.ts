import type { CostRecord } from './types';

export const costRecords: CostRecord[] = [
  { id: '1', user: '张伟', department: '能源服务部', agent: '能耗分析报告 Agent', model: 'Claude Opus 4.7', tokens: 12500, cost: 0.18, time: '2026-04-28 14:32' },
  { id: '2', user: '李娜', department: '研发中心', agent: '代码审查 Agent', model: 'Claude Opus 4.7', tokens: 8200, cost: 0.12, time: '2026-04-28 14:28' },
  { id: '3', user: '王强', department: '营销部', agent: '客户需求分析 Agent', model: 'GPT-5.5', tokens: 15600, cost: 0.23, time: '2026-04-28 14:15' },
  { id: '4', user: '赵敏', department: '项目管理部', agent: '项目方案生成 Agent', model: 'GLM-5.1', tokens: 21000, cost: 0.08, time: '2026-04-28 14:10' },
  { id: '5', user: '陈刚', department: '研发中心', agent: '内部知识问答 Agent', model: 'DeepSeek V4', tokens: 4800, cost: 0, time: '2026-04-28 13:55' },
  { id: '6', user: '刘芳', department: '能源服务部', agent: '设备故障诊断 Agent', model: 'Claude Opus 4.7', tokens: 18900, cost: 0.28, time: '2026-04-28 13:42' },
  { id: '7', user: '孙磊', department: '营销部', agent: '竞品情报分析 Agent', model: 'Claude Opus 4.7', tokens: 11200, cost: 0.16, time: '2026-04-28 13:30' },
  { id: '8', user: '周雪', department: '行政部', agent: '智能合同评审 Agent', model: 'MiMo V2.5', tokens: 23400, cost: 0.09, time: '2026-04-28 13:20' },
  { id: '9', user: '吴昊', department: '能源服务部', agent: '碳资产管理 Agent', model: 'GPT-5.5', tokens: 9500, cost: 0.14, time: '2026-04-28 12:48' },
  { id: '10', user: '郑雨', department: '研发中心', agent: '研发知识检索 Agent', model: 'GLM-5.1', tokens: 3200, cost: 0.01, time: '2026-04-28 12:35' },
];

export const costSummary = {
  today: { total: 1.29, calls: 142, tokens: '168,300' },
  thisWeek: { total: 6.87, calls: 856, tokens: '942,000' },
  thisMonth: { total: 28.45, calls: 3420, tokens: '3,860,000' },
};

export const costByDept = [
  { dept: '能源服务部', cost: 8.92, color: '#00e5c8' },
  { dept: '研发中心', cost: 7.45, color: '#a78bfa' },
  { dept: '营销部', cost: 6.23, color: '#f472b6' },
  { dept: '项目管理部', cost: 3.18, color: '#ff8c42' },
  { dept: '行政部', cost: 2.67, color: '#34d399' },
];

export const costByModel = [
  { model: 'Claude Opus 4.7', cost: 12.45, color: '#ff8c42' },
  { model: 'GPT-5.5', cost: 6.78, color: '#00b4ff' },
  { model: 'GLM-5.1', cost: 4.92, color: '#a78bfa' },
  { model: 'MiMo V2.5', cost: 3.15, color: '#f472b6' },
  { model: 'DeepSeek V4 (本地)', cost: 0, color: '#34d399' },
];
