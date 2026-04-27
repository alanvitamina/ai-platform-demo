/**
 * Pure frontend LLM simulator — mirrors backend llm_simulator.py
 * Used when the FastAPI backend is not running.
 */
export function mockChatResponse(agentId: number, agentName: string, userMsg: string): string {
  const category = getCategory(agentId, agentName);
  const intent = detectIntent(userMsg);
  const model = getModel(agentId, agentName);

  switch (category) {
    case 'marketing': return marketingResponse(intent, userMsg, model);
    case 'rd': return rdResponse(intent, userMsg, model);
    case 'project': return projectResponse(intent, userMsg, model);
    case 'admin': return adminResponse(intent, userMsg, model);
    case 'energy': return energyResponse(intent, userMsg, model);
    default: return genericResponse(intent, agentName, model);
  }
}

function getCategory(id: number, name: string): string {
  if (name.includes('客户') || name.includes('需求') || name.includes('营销')) return 'marketing';
  if (name.includes('代码') || name.includes('研发')) return 'rd';
  if (name.includes('项目') || name.includes('方案')) return 'project';
  if (name.includes('知识') || name.includes('内部') || name.includes('制度')) return 'admin';
  if (name.includes('能源') || name.includes('调度')) return 'energy';
  return 'general';
}

function getModel(id: number, name: string): string {
  if (id === 4 || name.includes('知识问答')) return 'DeepSeek V4 (本地)';
  if (id === 3 || name.includes('项目')) return 'GLM-5.1';
  return 'Claude Opus 4.7';
}

function detectIntent(msg: string): string {
  const m = msg.toLowerCase();
  if (/分析|客户|画像|需求|帮我看看|评估/.test(m)) return 'analysis';
  if (/方案|策划|计划|建议|推荐|怎么做|如何/.test(m)) return 'planning';
  if (/代码|审查|review|bug|漏洞|编程|函数/.test(m)) return 'code_review';
  if (/文档|报告|生成|写一个|帮我写/.test(m)) return 'document';
  if (/合同|审阅|条款|法务/.test(m)) return 'contract';
  if (/报销|差旅|住宿|标准|制度|规定|流程|怎么申请|如何报销|假期|考勤|年假/.test(m)) return 'policy';
  if (/数据|查询|统计|今天|本月|能耗|电量|发电/.test(m)) return 'data_query';
  if (/进度|项目|施工|安装|调试/.test(m)) return 'progress';
  if (/周报|日报|总结|汇总/.test(m)) return 'summary';
  return 'general';
}

function marketingResponse(intent: string, msg: string, model: string): string {
  if (intent === 'analysis') {
    return `📋 **客户需求分析**

基于沟通记录的综合分析：

**客户画像**
• 行业类型：制造业（推测为机械加工/汽车零部件）
• 用能特征：电费占比高，存在大量电机负载和压缩空气需求
• 决策链条：技术部门提需求 → 财务评估 → 总经理拍板

**关键痛点**
1. 用能成本逐年上升（年均涨幅约5-8%）
2. 设备老化导致能效下降
3. 缺乏数字化能源管理手段

**推荐对策**
• 免费能源审计锁定具体痛点
• 光伏+储能方案，首年见效
• 能源管理平台SaaS化降低初始投入

> 🤖 推理模型：${model} | 🔧 工具调用：向量知识库检索 | 📚 参考：能源行业案例库 · 苏州工业园项目

⚠️ 离线模式 · 以上为前端模拟响应`;
  }
  if (intent === 'planning') {
    return `📝 **营销策略建议**

**目标客户：** 年用电500万kWh以上的制造业企业
**核心价值主张：** "零投入降本15%，碳达标一步到位"

**渠道策略：**
• 行业协会/商会 — 精准触达决策者
• 政府节能目录 — 获取政策补贴信息
• 存量客户转介绍 — 最高转化率渠道

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
  }
  return `💡 **营销智能助手**

我可以帮您：
• 📊 客户需求分析 — 粘贴沟通记录，提炼画像和需求
• 📝 营销方案策划 — 出推广策略和话术
• 🔍 竞品情报追踪 — 整理竞品动态

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
}

function rdResponse(intent: string, msg: string, model: string): string {
  if (intent === 'code_review') {
    return `🔍 **代码审查报告**

🔴 **严重问题**
• 异常处理缺失：网络/IO操作未包裹try-catch
• SQL注入风险：使用字符串拼接构建查询

🟡 **警告**
• 数据库连接未使用连接池
• 函数圈复杂度过高（>10），建议拆分

✅ **通过项** — 命名规范、函数职责单一、格式统一

> 🤖 推理模型：${model} | 🔧 调用工具：静态分析引擎, AI深度审查 | 📚 规范引用：公司编码规范 v2.1

⚠️ 离线模式 · 以上为前端模拟响应`;
  }
  if (intent === 'document') {
    return `📄 **技术文档生成**

已根据代码结构生成文档框架：
• API接口文档 — 路由、请求参数、curl示例
• 模块设计文档 — 类图、数据流、算法说明
• 部署运维手册 — 环境依赖、配置项、监控指标

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
  }
  return `💻 **研发智能助手**

可用能力：代码审查 · 技术文档生成 · 技术标准检索 · 建模仿真辅助

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
}

function projectResponse(intent: string, msg: string, model: string): string {
  if (intent === 'planning' || intent === 'analysis') {
    const scale = Math.min(msg.length / 50, 2.5);
    const inv = Math.round(3500 * scale);
    const ret = Math.round(490 * scale);
    return `📐 **项目初步方案**

**技术方案**
1. 分布式光伏：${Math.round(5 * scale)}MW
2. 电化学储能：${Math.round(2 * scale)}MW/${Math.round(4 * scale)}MWh
3. 微电网能量管理系统

**投资测算**
| 项目 | 投资(万元) | 年收益(万元) |
|------|-----------|-------------|
| 光伏系统 | ${Math.round(inv * 0.51)} | ${Math.round(ret * 0.61)} |
| 储能系统 | ${Math.round(inv * 0.27)} | ${Math.round(ret * 0.39)} |
| 管理系统 | ${Math.round(inv * 0.08)} | — |
| 施工及其他 | ${Math.round(inv * 0.14)} | — |
| **合计** | **${inv}** | **${ret}** |

• IRR：${(12 + (scale - 1) * 2).toFixed(1)}%
• 投资回收期：${(6.5 - (scale - 1) * 0.8).toFixed(1)}年
• 年减排CO₂：约 ${Math.round(5000 * scale)} 吨

> 🤖 推理模型：${model} | 🔧 工具：案例库检索, 财务测算模型 | 📚 参考：综合能源项目案例库

⚠️ 离线模式 · 以上为前端模拟响应`;
  }
  if (intent === 'progress') {
    return `📋 **项目进度总览**

合肥高新区：62% 🟢 正常 | 苏州二期：45% 🟡 设备延迟 | 成都双流：28% 🟢 正常

⚠️ 苏州二期储能设备预计延误5天

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
  }
  return `🏗️ **工程项目助手**

可用：方案生成 · 进度跟踪 · 文档整理

> 🤖 推理模型：${model} | ⚠️ 离线模式`;
}

function adminResponse(intent: string, msg: string, model: string): string {
  if (intent === 'policy') {
    if (/差旅|住宿|交通|报销/.test(msg)) {
      return `📋 **差旅报销制度**

根据公司《财务管理制度 V3.2》（2026年1月修订）：

**🏨 住宿标准**
• 一线城市（北上广深）：500元/晚
• 二线城市（省会/计划单列市）：400元/晚
• 其他城市：300元/晚

**🚄 交通标准**
• 高铁 ≤6小时：二等座
• 高铁 >6小时/特急：一等座（需审批）
• 飞机：≥1000km + 总监审批

**超标处理**
• 超标 ≤20%：总监审批 → 20%-60%：VP加签 → >60%：特批

📚 来源：《财务管理制度 V3.2》第4.3节 | 🤖 推理模型：${model}（本地部署）

⚠️ 离线模式 · 以上为前端模拟响应`;
    }
    return `📋 **制度查询结果**

根据公司制度库检索：请具体说明要查哪方面制度（考勤/假期/报销/合同/流程）。

📚 来源：公司制度文档库 | 🤖 推理模型：${model}（本地部署）

⚠️ 离线模式`;
  }
  if (intent === 'contract') {
    return `📝 **合同审查意见**

✅ 主体信息完整 | ⚠️ 违约责任条款偏弱（建议提高至5%）| ⚠️ 知识产权归属未明确

**风险评级：** 🟡 中等 | 修改建议：补充违约+知识产权条款

> 🤖 推理模型：${model}（本地部署）| ⚠️ 离线模式`;
  }
  return `💬 **内部知识助手**

可查询：📋 人事/财务/行政制度 · 📝 合同审查 · 📊 周报/日报生成 · 🔍 知识检索

> 🤖 推理模型：${model}（本地部署）| ⚠️ 离线模式`;
}

function energyResponse(intent: string, msg: string, model: string): string {
  return `⚡ **综合能源分析**

**今日数据** — 光伏发电：12,450 kWh | 储能充放：2,100 / 1,850 kWh | 峰谷套利：约 ¥3,200

> 🔧 工具调用：时序数据库查询, 天气API | 🤖 推理模型：${model}

⚠️ 离线模式 · 以上为前端模拟响应`;
}

function genericResponse(intent: string, name: string, model: string): string {
  return `收到您的问题。作为 **${name}** 进行处理。

• 意图识别：${intent === 'analysis' ? '分析型任务' : intent === 'planning' ? '规划型任务' : '通用对话'}
• 知识检索：通用知识库
• 工具调用：按需调用
• 模型推理：${model}

⚠️ 离线模式 · 后端服务未连接，使用前端模拟响应。如需完整功能，请启动后端服务。`;
}
