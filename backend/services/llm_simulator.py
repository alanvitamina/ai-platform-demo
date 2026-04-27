"""
Simulated LLM responses — dynamic, context-aware, multi-turn.
No real model calls. Produces varied, realistic responses for demo.
"""
import random
from database import SessionLocal
from models import Agent, KnowledgeBase, Tool, Document


def simulate_response(agent_id: int, user_message: str, db: SessionLocal) -> str:
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        return "Agent 未找到。"

    category = agent.category
    kbs = agent.knowledge_bases or []
    tools = agent.tools or []
    model = agent.model or "默认模型"
    msg = user_message.strip()

    # Determine intent type from message content
    intent = _detect_intent(msg, category)

    # Build context from knowledge bases (if configured)
    kb_context = ""
    if kbs:
        kb_context = _search_kb(kbs, msg, db)

    # Build tool usage note
    tool_note = _build_tool_note(tools, intent, category)

    # Generate response based on category + intent
    if category == "marketing":
        return _marketing_response(msg, agent, intent, kb_context, tool_note, model)
    elif category == "rd":
        return _rd_response(msg, agent, intent, kb_context, tool_note, model)
    elif category == "project":
        return _project_response(msg, agent, intent, kb_context, tool_note, model)
    elif category == "admin":
        return _admin_response(msg, agent, intent, kb_context, tool_note, model)
    elif category == "energy":
        return _energy_response(msg, agent, intent, kb_context, tool_note, model)
    else:
        return _generic_response(msg, agent, intent, kb_context, tool_note, model)


def _detect_intent(msg: str, category: str) -> str:
    msg_lower = msg.lower()
    if any(k in msg_lower for k in ['分析', '客户', '画像', '需求', '问题', '帮我看看', '评估']):
        return 'analysis'
    if any(k in msg_lower for k in ['方案', '策划', '计划', '建议', '推荐', '怎么做', '如何']):
        return 'planning'
    if any(k in msg_lower for k in ['代码', '审查', 'review', 'bug', '漏洞', '编程', '函数']):
        return 'code_review'
    if any(k in msg_lower for k in ['文档', '报告', '生成', '写一个', '帮我写']):
        return 'document'
    if any(k in msg_lower for k in ['合同', '审阅', '条款', '法务']):
        return 'contract'
    if any(k in msg_lower for k in ['报销', '差旅', '住宿', '标准', '制度', '规定', '流程', '怎么申请', '如何报销', '假期', '考勤', '年假']):
        return 'policy'
    if any(k in msg_lower for k in ['数据', '查询', '统计', '今天', '本月', '能耗', '电量', '发电']):
        return 'data_query'
    if any(k in msg_lower for k in ['进度', '项目', '施工', '安装', '调试']):
        return 'progress'
    if any(k in msg_lower for k in ['周报', '日报', '总结', '汇总']):
        return 'summary'
    return 'general'


def _search_kb(kbs: list, msg: str, db: SessionLocal) -> str:
    results = []
    for kb_name in kbs:
        kb = db.query(KnowledgeBase).filter(KnowledgeBase.name == kb_name).first()
        if kb:
            docs = db.query(Document).filter(Document.kb_id == kb.id).limit(2).all()
            for doc in docs:
                # Simple keyword overlap scoring
                overlap = len(set(msg) & set(doc.content[:200]))
                if overlap > 5 or any(w in doc.content for w in msg[:10]):
                    results.append(f"📄 [{kb_name}]《{doc.title}》")
    if results:
        return "\n".join(results[:3])
    return ""


def _build_tool_note(tools: list, intent: str, category: str) -> str:
    if not tools:
        return ""
    active_tools = []
    for t in tools:
        t_name = t if isinstance(t, str) else (t.name if hasattr(t, 'name') else str(t))
        if intent == 'analysis' and ('检索' in t_name or '搜索' in t_name or '数据库' in t_name):
            active_tools.append(t_name)
        elif intent == 'document' and ('文档' in t_name or 'API' in t_name):
            active_tools.append(t_name)
        elif intent == 'code_review' and ('Git' in t_name or '代码' in t_name):
            active_tools.append(t_name)
        elif intent == 'data_query' and ('数据' in t_name or '查询' in t_name):
            active_tools.append(t_name)
    return ", ".join(active_tools) if active_tools else (", ".join(tools[:2]) if len(tools) > 0 else "")


# ===== Domain-specific response generators =====

def _marketing_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    if intent == 'analysis':
        responses = [
            f"""📋 **客户需求分析**

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
• 先做免费能源审计锁定具体痛点
• 光伏+储能方案，首年即可见效
• 能源管理平台SaaS化降低初始投入

{f'**参考案例**\\n{kb_ctx}' if kb_ctx else ''}
{f'🔧 调用工具：{tool_note}' if tool_note else ''}
> 🤖 推理模型：{model} | 响应模式：模拟""",

            f"""🎯 **客户需求深度分析**

**需求层次拆解：**
1. 表层需求 — "电费太贵了"
2. 深层需求 — 降本增效 + 碳排放合规
3. 隐性需求 — 设备可靠性提升 + 数字化转型

**推荐方案组合：**
• 短期（3个月）：能源审计 + 合同能源管理
• 中期（1年）：光伏+储能部署
• 长期（3年）：微电网+碳资产管理

{f'🔧 调用工具：{tool_note}' if tool_note else ''}
> 🤖 推理模型：{model} | 响应模式：模拟""",
        ]
        return random.choice(responses)

    elif intent == 'planning':
        return f"""📝 **营销策略建议**

**目标客户画像：** 年用电500万kWh以上的制造业企业
**核心价值主张：** "零投入降本15%，碳达标一步到位"

**渠道策略：**
• 行业协会/商会：精准触达决策者
• 政府节能目录：获取政策补贴信息
• 存量客户转介绍：最高转化率渠道

**话术四步法：**
1. "您知道吗，同行XX公司去年省了280万电费"
2. "我们可以免费做一次能源审计"
3. "方案实施后第一年就能看到回报"
4. "碳达标方面，我们可以帮您一步到位"

{f'🔧 调用工具：{tool_note}' if tool_note else ''}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    else:
        return f"""💡 **营销智能助手**

我可以帮您做这些事：

• **客户需求分析** — 粘贴沟通记录，我提炼客户画像和需求
• **营销方案策划** — 告诉我目标客户，我出推广策略
• **竞品情报追踪** — 告诉我关注哪家竞品，我整理动态
• **话术优化** — 给我原始话术，我帮你打磨

{f'📚 已挂载知识库：{", ".join(agent.knowledge_bases) if agent.knowledge_bases else "通用营销知识库"}'
 if not kb_ctx else f'📚 检索参考：\\n{kb_ctx}'}
> 🤖 推理模型：{model} | 响应模式：模拟"""


def _rd_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    if intent == 'code_review':
        return f"""🔍 **代码审查报告**

**审查方式：** 静态分析 + AI深度审查

🔴 **严重问题**
• 异常处理缺失：网络/IO操作未包裹try-catch，生产环境可能导致服务中断
• SQL注入风险：使用字符串拼接构建查询

🟡 **警告**
• 数据库连接管理不当，建议使用连接池
• 部分函数圈复杂度过高（>10），建议拆分
• 日志级别不统一，info 和 debug 混用

✅ **通过项**
• 命名规范，见名知义
• 函数职责单一，符合SRP原则
• 代码格式统一

**改进优先级：** 严重问题 → 立即修复 | 警告 → 下个迭代

{f'📚 规范引用：\\n{kb_ctx}' if kb_ctx else '📚 规范引用：公司编码规范 v2.1'}
{f'🔧 调用工具：{tool_note}' if tool_note else '🔧 调用工具：静态分析引擎, AI深度审查'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    elif intent == 'document':
        return f"""📄 **技术文档生成**

已根据代码结构生成以下文档框架：

**1. API 接口文档**
• 自动提取路由、请求参数、响应格式
• 生成 curl 示例和错误码说明

**2. 模块设计文档**
• 类图和调用关系
• 数据流向说明
• 关键算法描述

**3. 部署运维手册**
• 环境依赖清单
• 配置项说明
• 监控指标和告警规则

{f'📚 参考：\\n{kb_ctx}' if kb_ctx else ''}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    else:
        return f"""💻 **研发智能助手**

可用能力：
• **代码审查** — 粘贴代码，识别Bug/安全/规范问题
• **技术文档生成** — 从代码自动生成API文档和设计说明
• **技术检索** — 搜索内部技术标准、专利和论文
• **建模仿真** — 辅助能源产品参数建模

{f'📚 已挂载知识库：{", ".join(agent.knowledge_bases) if agent.knowledge_bases else "编码规范库, 技术标准库"}'
 if not kb_ctx else f'📚 检索参考：\\n{kb_ctx}'}
> 🤖 推理模型：{model} | 响应模式：模拟"""


def _project_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    if intent in ('planning', 'analysis'):
        # Dynamic investment numbers based on message length (simulated analysis)
        scale_factor = min(len(msg) / 50, 2.0)
        base_invest = int(3500 * scale_factor)
        base_return = int(490 * scale_factor)
        irr = round(12 + random.uniform(-2, 2), 1)

        return f"""📐 **项目初步方案**

**项目概况**
• 类型：工业园区综合能源项目
• 预估规模：根据需求分析，建议装机 5-8MW

**技术方案**
1. 分布式光伏：{int(5 * scale_factor)}MW
2. 电化学储能：{int(2 * scale_factor)}MW/{int(4 * scale_factor)}MWh
3. 微电网能量管理系统
4. 余热回收利用（如适用）

**投资测算**
| 项目 | 投资(万元) | 年收益(万元) |
|------|-----------|-------------|
| 光伏系统 | {int(base_invest * 0.51)} | {int(base_return * 0.61)} |
| 储能系统 | {int(base_invest * 0.27)} | {int(base_return * 0.39)} |
| 管理系统 | {int(base_invest * 0.08)} | — |
| 施工及其他 | {int(base_invest * 0.14)} | — |
| **合计** | **{base_invest}** | **{base_return}** |

• IRR：{irr}%
• 投资回收期：{round(10 - irr * 0.3, 1)}年
• 年减排CO₂：约 {int(5000 * scale_factor)} 吨

{f'📚 参考案例：\\n{kb_ctx}' if kb_ctx else ''}
{f'🔧 调用工具：{tool_note}' if tool_note else '🔧 调用工具：案例库检索, 财务测算模型'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    elif intent == 'progress':
        return f"""📋 **项目进度总览**

**活跃项目：** 3个在建，2个前期

| 项目 | 进度 | 状态 |
|------|------|------|
| 合肥高新区 | 62% | 🟢 正常 |
| 苏州二期 | 45% | 🟡 设备延迟 |
| 成都双流 | 28% | 🟢 正常 |

⚠️ 苏州二期储能设备运输预计延误5天，已调整施工排期。

{f'🔧 调用工具：{tool_note}' if tool_note else ''}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    else:
        return f"""🏗️ **工程项目助手**

当前可用：
• **方案生成** — 告诉我项目需求，生成方案+投资测算
• **进度跟踪** — 查看各项目节点进度和风险预警
• **文档整理** — 自动归集竣工资料

{f'📚 已挂载知识库：{", ".join(agent.knowledge_bases) if agent.knowledge_bases else "项目案例库, 设备选型库"}'
 if not kb_ctx else f'📚 检索参考：\\n{kb_ctx}'}
> 🤖 推理模型：{model} | 响应模式：模拟"""


def _admin_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    if intent == 'policy':
        kws = set(msg)
        if '差旅' in msg or '住宿' in msg or '交通' in msg or '报销' in msg:
            return f"""📋 **差旅报销制度**

根据公司《财务管理制度 V3.2》：

**🏨 住宿标准**
• 一线城市（北上广深）：500元/晚
• 二线城市（省会/计划单列市）：400元/晚
• 其他城市：300元/晚

**🚄 交通标准**
• 高铁 ≤6小时：二等座
• 高铁 >6小时/特急：一等座（需审批）
• 飞机：≥1000km + 总监审批

**超标处理**
• 超标 ≤20%：部门总监审批
• 超标 20%-60%：VP加签
• 超标 >60%：特批

{f'📚 {kb_ctx}' if kb_ctx else '📚 来源：《财务管理制度 V3.2》第4.3节'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

        elif '假期' in msg or '考勤' in msg or '年假' in msg:
            return f"""📋 **考勤与休假制度**

**弹性工作制**
• 核心工作时间：10:00-16:00
• 其余时间自主安排

**年假标准**
• 工龄 1-5年：5天
• 工龄 5-10年：10天
• 工龄 >10年：15天

**请假流程**
• ≤1天：直属上级审批
• 2-3天：部门总监审批
• ≥4天：VP审批

📚 来源：《考勤与休假管理制度》
> 🤖 推理模型：{model} | 响应模式：模拟"""

        return f"""📋 **制度查询**

根据公司制度库检索结果：

相关内容已在上方展示。如需查询其他制度，请具体说明。

{f'📚 {kb_ctx}' if kb_ctx else '📚 来源：公司制度文档库'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    elif intent == 'contract':
        return f"""📝 **合同审查意见**

**审查清单（15项检查）**
✅ 主体信息完整准确
✅ 付款条款金额正确
⚠️ 违约责任条款偏弱 — 建议将违约金提高至合同总额5%
⚠️ 知识产权归属未明确 — 建议增加"项目成果归甲方所有"
✅ 保密条款符合要求
✅ 争议解决条款合规

**风险评级：** 🟡 中等风险
**建议：** 修改上述2项后可通过。建议增加数据安全保护条款。

{f'🔧 调用工具：{tool_note}' if tool_note else '🔧 调用工具：合同模板库, 法务知识检索'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    elif intent == 'summary':
        return f"""📊 **本周工作总结（自动生成）**

**工作亮点**
• 完成项目节点3个
• 提交技术方案2份
• 客户拜访5次

**下周计划**
• 启动新项目前期调研
• 完成方案修订

> 以上基于日历和文档自动汇总，请核对后发送。
> 🤖 推理模型：{model} | 响应模式：模拟"""

    else:
        return f"""💬 **内部知识助手**

我可以帮您查：
• 📋 人事/财务/行政制度
• 📝 合同审查和条款分析
• 📊 周报/日报自动汇总生成
• 🔍 公司文档知识检索

{f'📚 已挂载知识库：{", ".join(agent.knowledge_bases) if agent.knowledge_bases else "公司制度库, 技术标准库, 流程规范库"}'
 if not kb_ctx else f'📚 检索参考：\\n{kb_ctx}'}
> 🤖 推理模型：{model} | 响应模式：模拟"""


def _energy_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    if intent == 'data_query':
        return f"""⚡ **能源数据查询**

**今日运行数据**
• 光伏发电：{random.randint(11000, 14000):,} kWh
• 储能充放电：充电 {random.randint(1800, 2400):,} / 放电 {random.randint(1600, 2200):,} kWh
• 当前负荷：{random.randint(1800, 2800)} kW
• 峰谷套利收益：约 ¥{random.randint(2800, 3800):,}

**优化建议**
• 午后时段可增加储能充电功率
• 晚高峰(18:00-20:00)建议提高放电比例

{f'🔧 调用工具：{tool_note}' if tool_note else '🔧 调用工具：时序数据库查询'}
> 🤖 推理模型：{model} | 响应模式：模拟"""

    return f"""⚡ **综合能源分析**

**系统状态：** 🟢 正常运行
**覆盖范围：** 3个能源站
**今日光伏出力：** {random.randint(11000, 14000):,} kWh

**核心指标：** 发电量达标率 103% | 储能效率 92% | 负荷预测准确率 96%

{f'📚 {kb_ctx}' if kb_ctx else ''}
{f'🔧 调用工具：{tool_note}' if tool_note else '🔧 调用工具：时序数据库, 天气API'}
> 🤖 推理模型：{model} | 响应模式：模拟"""


def _generic_response(msg: str, agent: Agent, intent: str, kb_ctx: str, tool_note: str, model: str) -> str:
    return f"""收到您的问题。作为 **{agent.name}**，我正在进行处理：

**处理流程：**
• 意图识别：{"分析型任务" if intent == 'analysis' else "规划型任务" if intent == 'planning' else "查询型任务" if intent in ('data_query', 'policy') else "通用对话"}
• 知识检索：{f"命中 {kb_ctx.count(chr(10))+1} 条参考" if kb_ctx else "通用知识库检索"}
• 工具调用：{tool_note if tool_note else "无需额外工具"}
• 模型推理：{model}

{f'📚 参考：\\n{kb_ctx}' if kb_ctx else ''}

这是基于当前知识库和工具能力的回复。在完整部署后，将通过真实模型推理生成更精准的答案。"""
