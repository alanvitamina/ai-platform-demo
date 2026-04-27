import type { DemoSession } from './types';

export const demoSessions: DemoSession[] = [
  {
    id: 'customer-analysis-demo',
    agentId: 'mkt-customer',
    title: '客户需求分析演示 — 合肥鑫源实业综合能源改造项目',
    steps: [
      {
        id: 1,
        conversation: {
          user: '帮我分析一下合肥鑫源实业这个客户的综合能源改造需求。以下是最近三次客户沟通的纪要……\n\n【第一次沟通 4月15日】客户提到工厂电费成本占比已达18%，主要耗能集中在空压机和制冷系统。屋顶面积约2万平米，目前闲置。\n【第二次沟通 4月20日】客户对光伏+储能的方案表示兴趣，但担心初始投资太高。年度用电量约1200万kWh，峰值负荷约2500kW。\n【第三次沟通 4月25日】客户透露预算上限约800万，希望3年内回本。另外他们的热处理车间有大量余热未利用。',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '识别为客户需求分析任务，输入类型为多轮沟通纪要' },
          { label: '向量检索', status: 'active', icon: '🔍', detail: '检索相似行业案例...匹配到3个光伏+储能+余热回收综合方案' },
          { label: '实体提取', status: 'pending', icon: '🏷️', detail: '等待中' },
          { label: '模型分析', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '报告生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 2,
        conversation: {
          agent: '已完成客户沟通信息提取：\n\n📋 **客户画像**\n• 企业类型：制造业（热处理工艺）\n• 核心痛点：电费占比18%过高，空压机/制冷系统能耗大\n• 可用资源：闲置屋顶2万㎡，余热未利用\n• 年用电量：1200万kWh | 峰值负荷：2500kW\n• 预算：800万 | 回报要求：3年内\n\n✅ 已匹配3个相似案例：某汽车零部件厂（2025年实施，已回本40%）',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '客户需求分析任务确认' },
          { label: '向量检索', status: 'done', icon: '🔍', detail: '匹配到3个相似案例：汽车零部件、电子制造、化工' },
          { label: '实体提取', status: 'active', icon: '🏷️', detail: '提取关键实体：电费18%、1200万kWh、800万预算、空压机、热处理余热' },
          { label: '模型分析', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '报告生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 3,
        conversation: {
          agent: '📊 **需求分析与方案建议**\n\n**推荐方案：光伏+储能+余热回收 三位一体**\n\n1️⃣ 屋顶光伏（2万㎡）\n• 装机容量：约2MW\n• 年发电量：约200万kWh\n• 预估投资：320万\n\n2️⃣ 储能系统\n• 配置500kW/1000kWh\n• 削峰填谷，年节省需量电费约35万\n• 预估投资：180万\n\n3️⃣ 余热回收系统\n• 热处理车间余热→预热锅炉进水\n• 年节省天然气约3万m³\n• 预估投资：150万',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '完成' },
          { label: '向量检索', status: 'done', icon: '🔍', detail: '案例库检索完成，引用3个参考案例' },
          { label: '实体提取', status: 'done', icon: '🏷️', detail: '客户关键参数提取完毕' },
          { label: '模型分析', status: 'active', icon: '🧠', detail: 'Claude Opus 4.7 进行方案生成...含财务测算' },
          { label: '报告生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 4,
        conversation: {
          agent: '💰 **投资回报测算**\n\n| 指标 | 数值 |\n|------|------|\n| 总投资 | 650万元 |\n| 年节省电费 | 约168万元 |\n| 年节省天然气 | 约12万元 |\n| 年碳排放减少 | 约1,850吨CO₂ |\n| **预计回本周期** | **3.4年** |\n| 10年净收益 | 约1,150万元 |\n\n⚠️ 回本周期略超客户3年预期。建议：将储能配置调整为300kW/600kWh，总投资降至580万，回本周期压缩至2.9年。\n\n📎 完整方案报告已生成，是否发送给客户？',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '完成' },
          { label: '向量检索', status: 'done', icon: '🔍', detail: '完成' },
          { label: '实体提取', status: 'done', icon: '🏷️', detail: '完成' },
          { label: '模型分析', status: 'done', icon: '🧠', detail: '方案生成完成，含财务模型测算' },
          { label: '报告生成', status: 'done', icon: '📄', detail: '客户需求分析报告已生成 → 飞书文档' },
        ],
      },
    ],
  },

  // ===== 代码审查 =====
  {
    id: 'code-review-demo',
    agentId: 'rd-code-review',
    title: '代码审查演示 — 能源管理平台设备数据采集模块',
    steps: [
      {
        id: 1,
        conversation: {
          user: '帮我审查这段设备数据采集模块的代码。最近生产环境偶尔出现数据丢失的情况。\n\n```python\ndef collect_device_data(device_id):\n    conn = get_db_connection()\n    data = fetch_from_device(device_id)\n    if data is not None:\n        save_to_db(conn, data)\n    send_mqtt_update(device_id, data)\n    return data\n\ndef fetch_from_device(device_id):\n    resp = requests.get(f"http://{DEVICE_HOST}:8080/api/data/{device_id}")\n    return resp.json()\n\ndef save_to_db(conn, data):\n    sql = f"INSERT INTO device_readings VALUES ({data[\'ts\']}, {data[\'val\']}, {data[\'id\']})"\n    conn.execute(sql)\n```',
        },
        workflow: [
          { label: '代码解析', status: 'done', icon: '📖', detail: '解析Python代码，识别3个函数，共18行' },
          { label: '静态分析', status: 'active', icon: '🔍', detail: '运行AST分析 + 规则引擎...检测到5个潜在问题' },
          { label: '安全扫描', status: 'pending', icon: '🛡️', detail: '等待中' },
          { label: 'AI审查', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '报告生成', status: 'pending', icon: '📋', detail: '等待中' },
        ],
      },
      {
        id: 2,
        conversation: {
          agent: '🔍 **静态分析已完成，发现以下问题：**\n\n🔴 **严重 (2个)**\n• `collect_device_data`: 数据库连接未关闭，可能导致连接池耗尽\n• `save_to_db`: SQL注入风险，使用f-string拼接SQL\n\n🟡 **警告 (3个)**\n• `fetch_from_device`: 缺少超时和异常处理，网络故障时会导致数据丢失 ← **这可能是你数据丢失的根因**\n• `send_mqtt_update`: 在数据可能为None时仍然调用\n• 硬编码的设备地址和端口',
        },
        workflow: [
          { label: '代码解析', status: 'done', icon: '📖', detail: '完成' },
          { label: '静态分析', status: 'done', icon: '🔍', detail: '发现5个问题：2严重/3警告' },
          { label: '安全扫描', status: 'active', icon: '🛡️', detail: '检测SQL注入漏洞 (CWE-89)' },
          { label: 'AI审查', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '报告生成', status: 'pending', icon: '📋', detail: '等待中' },
        ],
      },
      {
        id: 3,
        conversation: {
          agent: '🛡️ **安全扫描 & AI深度审查完成**\n\n**关于数据丢失的根因分析：**\n\n`fetch_from_device` 函数缺少超时和异常处理。当设备网络抖动时，`requests.get()` 可能无限等待或抛出异常，导致`data`为None或函数中断。后续`send_mqtt_update`在data为None时仍然发送，MQTT消息体为空。\n\n**修复建议：**\n\n```python\ndef fetch_from_device(device_id, timeout=10):\n    try:\n        resp = requests.get(\n            f"http://{DEVICE_HOST}:8080/api/data/{device_id}",\n            timeout=timeout\n        )\n        resp.raise_for_status()\n        return resp.json()\n    except requests.Timeout:\n        logger.error(f"设备{device_id}响应超时")\n        raise DeviceTimeoutError(f"设备{device_id}超时")\n    except requests.RequestException as e:\n        logger.error(f"获取设备数据失败: {e}")\n        raise\n```',
        },
        workflow: [
          { label: '代码解析', status: 'done', icon: '📖', detail: '完成' },
          { label: '静态分析', status: 'done', icon: '🔍', detail: '完成' },
          { label: '安全扫描', status: 'done', icon: '🛡️', detail: 'SQL注入确认，超时缺失可能导致DoS' },
          { label: 'AI审查', status: 'done', icon: '🧠', detail: 'Claude Opus审查完成，提供修复代码' },
          { label: '报告生成', status: 'done', icon: '📋', detail: '审查报告已生成，建议创建Jira工单' },
        ],
      },
    ],
  },

  // ===== 项目方案生成 =====
  {
    id: 'project-planning-demo',
    agentId: 'proj-plan',
    title: '项目方案生成演示 — 某工业园区微电网项目',
    steps: [
      {
        id: 1,
        conversation: {
          user: '帮我生成一个工业园区微电网项目的初步方案。基础信息：\n\n园区面积：15万㎡，含3栋办公楼、2个生产车间、1个数据中心\n年用电量：约8500万kWh\n当地日照：年均峰值日照4.2小时\n现有设施：1个10kV开闭所\n客户目标：降低用电成本30%+，提高供电可靠性（目前年均停电3次）',
        },
        workflow: [
          { label: '需求解析', status: 'done', icon: '📋', detail: '提取关键参数：8500万kWh、15万㎡、4.2h日照、10kV接入' },
          { label: '案例匹配', status: 'active', icon: '🔍', detail: '向量库检索相似规模园区微电网项目...' },
          { label: '方案设计', status: 'pending', icon: '✏️', detail: '等待中' },
          { label: '投资测算', status: 'pending', icon: '💰', detail: '等待中' },
          { label: '文档生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 2,
        conversation: {
          agent: '🏭 **园区微电网初步方案框架**\n\n基于项目参数和2个相似案例（苏州工业园、东莞松山湖），推荐方案：\n\n**1. 分布式光伏**\n• 屋顶+车棚光伏：8MW\n• 年发电量：约1370万kWh\n• 自发自用率：约95%\n\n**2. 储能系统**\n• 2MW/4MWh 磷酸铁锂\n• 峰谷套利 + 需量管理 + 备用电源\n\n**3. 微电网控制系统**\n• 源-网-荷-储协同调度\n• 孤岛运行能力（停电时保障数据中心供电）',
        },
        workflow: [
          { label: '需求解析', status: 'done', icon: '📋', detail: '完成' },
          { label: '案例匹配', status: 'done', icon: '🔍', detail: '匹配苏州工业园(相似度87%)、东莞松山湖(相似度82%)' },
          { label: '方案设计', status: 'active', icon: '✏️', detail: 'GLM-5.1 生成方案框架...' },
          { label: '投资测算', status: 'pending', icon: '💰', detail: '等待中' },
          { label: '文档生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 3,
        conversation: {
          agent: '💰 **投资与经济性分析**\n\n| 项目 | 投资(万元) | 年收益(万元) |\n|------|-----------|-------------|\n| 光伏8MW | 2,880 | 480 |\n| 储能2MW/4MWh | 960 | 210 |\n| 微电网控制系统 | 280 | — |\n| 施工与并网 | 380 | — |\n| **合计** | **4,500** | **690** |\n\n• 预计回本周期：6.5年\n• 年减排CO₂：约7,800吨\n• 供电可靠性：从99.7%提升至99.97%\n\n⚠️ 数据中心作为敏感负荷，建议额外配置UPS + 柴发作为第三层保障。',
        },
        workflow: [
          { label: '需求解析', status: 'done', icon: '📋', detail: '完成' },
          { label: '案例匹配', status: 'done', icon: '🔍', detail: '完成' },
          { label: '方案设计', status: 'done', icon: '✏️', detail: '技术方案完成' },
          { label: '投资测算', status: 'active', icon: '💰', detail: '财务模型计算中...引用行业平均造价数据' },
          { label: '文档生成', status: 'pending', icon: '📄', detail: '等待中' },
        ],
      },
      {
        id: 4,
        conversation: {
          agent: '📄 **项目方案报告已生成**\n\n报告包含：\n• 项目概述与技术方案\n• 系统设计与设备选型\n• 投资预算与资金计划\n• 经济性分析（IRR 12.8%）\n• 环境效益评估\n• 实施计划（预计工期8个月）\n\n📎 完整报告已保存到飞书文档：《某工业园区微电网项目初步方案 V1.0》\n\n💡 建议下一步：\n1. 现场踏勘确认屋顶结构承载力\n2. 与供电公司沟通并网方案\n3. 细化数据中心保障方案',
        },
        workflow: [
          { label: '需求解析', status: 'done', icon: '📋', detail: '完成' },
          { label: '案例匹配', status: 'done', icon: '🔍', detail: '完成' },
          { label: '方案设计', status: 'done', icon: '✏️', detail: '完成' },
          { label: '投资测算', status: 'done', icon: '💰', detail: 'IRR 12.8%，投资回收期6.5年' },
          { label: '文档生成', status: 'done', icon: '📄', detail: '完整方案已生成 → 飞书文档' },
        ],
      },
    ],
  },

  // ===== 内部知识问答 =====
  {
    id: 'knowledge-qa-demo',
    agentId: 'admin-qa',
    title: '内部知识问答演示 — 公司制度与流程查询',
    steps: [
      {
        id: 1,
        conversation: {
          user: '公司的差旅报销标准是什么？特别是住宿和交通这块。',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '识别为制度查询类问题，关键词：差旅报销、住宿、交通' },
          { label: '知识检索', status: 'active', icon: '🔍', detail: '向量检索 + 关键词匹配：飞书文档库 → 财务制度...' },
          { label: '权限检查', status: 'pending', icon: '🔒', detail: '等待中' },
          { label: '答案生成', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '来源标注', status: 'pending', icon: '📎', detail: '等待中' },
        ],
      },
      {
        id: 2,
        conversation: {
          agent: '📋 根据公司《财务管理制度 V3.2》（2026年1月修订）：\n\n**🏨 住宿标准（按城市等级）**\n• 一线城市（北上广深）：500元/晚\n• 二线城市（省会/计划单列市）：400元/晚\n• 其他城市：300元/晚\n• 超出标准需提前审批\n\n**🚄 交通标准**\n• 高铁6小时内：二等座\n• 高铁6小时以上/紧急情况：一等座（需审批）\n• 飞机：需部门总监审批，仅限1000公里以上\n• 市内交通：实报实销，单日上限100元\n\n📎 来源：《财务管理制度 V3.2》第4.3节"差旅费管理"',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '制度查询确认' },
          { label: '知识检索', status: 'done', icon: '🔍', detail: '检索到：财务管理制度V3.2、差旅费补充规定' },
          { label: '权限检查', status: 'done', icon: '🔒', detail: '该员工可查看财务制度（公开级）' },
          { label: '答案生成', status: 'active', icon: '🧠', detail: 'DeepSeek V4 本地模型生成答案...' },
          { label: '来源标注', status: 'pending', icon: '📎', detail: '等待中' },
        ],
      },
      {
        id: 3,
        conversation: {
          user: '如果我去上海出差3天，住宿费超标了怎么办？比如我需要住600一晚的酒店。',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '追问：超标处理流程' },
          { label: '知识检索', status: 'active', icon: '🔍', detail: '检索超标审批相关制度...' },
          { label: '权限检查', status: 'pending', icon: '🔒', detail: '等待中' },
          { label: '答案生成', status: 'pending', icon: '🧠', detail: '等待中' },
          { label: '来源标注', status: 'pending', icon: '📎', detail: '等待中' },
        ],
      },
      {
        id: 4,
        conversation: {
          agent: '关于住宿超标的情况，根据制度规定：\n\n**超标处理流程：**\n\n1️⃣ 提前在飞书提交《差旅超标审批单》\n• 说明超标原因（如：会议指定酒店、安全考虑等）\n• 部门总监审批（500-800元/晚范围）\n• 超过800元需分管VP加签\n\n2️⃣ 紧急情况可先住后补\n• 出差结束后3个工作日内补交审批\n• 超期未补视为个人承担差额\n\n⚠️ 上海属于一线城市，标准500元/晚。600元属于超标20%，部门总监审批即可，不需要VP。\n\n📎 来源：《财务管理制度 V3.2》第4.3.2节 + 《差旅超标审批管理办法》',
        },
        workflow: [
          { label: '意图识别', status: 'done', icon: '🎯', detail: '完成' },
          { label: '知识检索', status: 'done', icon: '🔍', detail: '检索到超标审批流程、审批权限表' },
          { label: '权限检查', status: 'done', icon: '🔒', detail: '通过' },
          { label: '答案生成', status: 'done', icon: '🧠', detail: '本地模型生成，含超标具体金额分级说明' },
          { label: '来源标注', status: 'done', icon: '📎', detail: '引用两条制度原文，精确到章节号' },
        ],
      },
    ],
  },
];
