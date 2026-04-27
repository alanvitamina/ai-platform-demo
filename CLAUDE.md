# ai-platform-demo - 企业级 AI 应用平台 Demo

用于向管理层汇报的 Demo 全栈应用，展示公司内部 AI 平台架构。

## 项目约定

- 前端：React + Ant Design Pro
- 后端：FastAPI (Python 3.12+)
- 数据库：SQLite
- 部署：Docker Compose
- 配置走 config.yaml + .env

## 架构

五层架构：用户接入层 → Agent编排层 → 能力支撑层 → 模型网关层 → 基础设施层

## 启动方式

```bash
npm install
npm run dev
```
浏览器打开 http://localhost:3000

## 恢复工作

打开后说"继续 AI 平台 Demo"即可恢复上下文。

## 当前状态（2026-04-28）

Demo v1.0 已完成：
- 6个页面：首页仪表盘、Agent市场、4个Agent演示、模型网关监控
- 4个可演示Agent：客户需求分析、代码审查、项目方案生成、内部知识问答
- 全部模拟数据，点"下一步"推进演示流程
