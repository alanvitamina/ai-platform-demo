from database import engine, SessionLocal, Base
from models import Agent, KnowledgeBase, Document, Tool, DataSource
import json

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Only seed if empty
if db.query(Agent).count() > 0:
    db.close()
    print("Database already seeded.")
    exit()


# Agents
agents_data = [
    {
        "name": "客户需求分析 Agent", "emoji": "🎯", "category": "marketing",
        "description": "分析客户沟通记录与需求文档，提炼关键诉求，生成客户需求画像与解决方案建议",
        "system_prompt": "你是客户需求分析专家。从客户沟通记录中提取关键信息，生成客户画像和需求分析报告。",
        "model": "Claude Opus 4.7",
        "tools": json.dumps(["向量知识库", "结构化数据库", "网页搜索"]),
        "knowledge_bases": json.dumps(["能源行业案例库", "客户沟通模板库"]),
    },
    {
        "name": "代码审查 Agent", "emoji": "💻", "category": "rd",
        "description": "自动审查代码提交，识别潜在Bug、安全漏洞和编码规范问题，给出修改建议",
        "system_prompt": "你是资深代码审查专家。审查代码中的Bug、安全漏洞和规范问题。",
        "model": "Claude Opus 4.7",
        "tools": json.dumps(["Git API", "编码规范库", "安全扫描引擎"]),
        "knowledge_bases": json.dumps(["公司编码规范 v2.1", "OWASP Top 10"]),
    },
    {
        "name": "项目方案生成 Agent", "emoji": "📐", "category": "project",
        "description": "基于历史项目案例库和客户需求，自动生成综合能源项目初步方案与投资测算",
        "system_prompt": "你是综合能源项目方案专家。根据项目需求生成技术方案和投资测算。",
        "model": "GLM-5.1",
        "tools": json.dumps(["向量知识库", "图数据库", "财务测算模型"]),
        "knowledge_bases": json.dumps(["综合能源项目案例库", "设备选型数据库"]),
    },
    {
        "name": "内部知识问答 Agent", "emoji": "💬", "category": "admin",
        "description": "基于飞书文档自动同步的知识库，回答公司制度、流程规范、技术标准等内部问题",
        "system_prompt": "你是公司内部知识助手。从公司制度文档中检索相关信息，给出准确回答并标注来源。",
        "model": "DeepSeek V4 (本地)",
        "tools": json.dumps(["飞书文档同步", "向量知识库"]),
        "knowledge_bases": json.dumps(["公司制度文档库", "技术标准库", "流程规范库"]),
    },
]

for a in agents_data:
    db.add(Agent(**a, is_preset=1))

# Knowledge Bases
kbs_data = [
    {"name": "能源行业案例库", "description": "综合能源服务行业典型项目案例，含技术方案和投资数据"},
    {"name": "公司制度文档库", "description": "公司人事、财务、行政等管理制度的飞书文档集合"},
    {"name": "技术标准库", "description": "能源行业国家标准、行业规范和公司内部技术标准"},
    {"name": "编码规范库", "description": "公司软件开发编码规范、安全标准和最佳实践"},
    {"name": "客户沟通模板库", "description": "客户沟通记录、需求文档模板和话术参考"},
]

for kb in kbs_data:
    db.add(KnowledgeBase(**kb))
db.flush()

# Documents (for knowledge bases)
docs_data = [
    {"kb_id": 1, "title": "苏州工业园微电网项目案例", "content": "苏州工业园微电网项目，2025年实施。装机5MW光伏+2MW储能。总投资3500万，年收益490万，IRR 13.2%，回收期6.2年。"},
    {"kb_id": 1, "title": "东莞松山湖综合能源项目", "content": "东莞松山湖综合能源项目，2025年实施。包含光伏、储能、充电桩一体化方案。装机3MW，年减排CO₂ 3800吨。"},
    {"kb_id": 2, "title": "财务管理制度 V3.2", "content": "差旅管理：一线城市住宿500元/晚，二线400元/晚。交通：高铁6h内二等座。超标需审批。"},
    {"kb_id": 2, "title": "考勤与休假管理制度", "content": "弹性工作制，核心工作时间10:00-16:00。年假：1-5年5天，5-10年10天，10年以上15天。"},
    {"kb_id": 3, "title": "光伏电站设计规范 GB50797", "content": "光伏电站设计应符合GB50797-2012标准。组件倾角应根据当地纬度优化，逆变器容量配比1:1.1~1.3。"},
    {"kb_id": 4, "title": "Python编码规范 v2.1", "content": "遵循PEP8规范。函数命名用snake_case，类名用PascalCase。数据库操作必须使用参数化查询。"},
]

for doc in docs_data:
    db.add(Document(**doc, chunk_count=max(1, len(doc["content"]) // 500)))

# Tools
tools_data = [
    {"name": "向量知识库检索", "description": "基于Milvus的语义检索工具，支持混合检索(向量+关键词)+Reranker重排", "tool_type": "mcp", "config": json.dumps({"protocol": "mcp", "endpoint": "/mcp/vector-search"})},
    {"name": "飞书文档API", "description": "飞书开放平台文档读写接口，支持文档创建、读取、更新", "tool_type": "feishu", "config": json.dumps({"app_id": "cli_xxx", "scopes": ["doc:read", "doc:write"]})},
    {"name": "天气数据API", "description": "获取实时天气和未来天气预报数据，用于能源调度预测", "tool_type": "api", "config": json.dumps({"protocol": "openapi", "endpoint": "https://api.weather.com/v3"})},
    {"name": "设备时序数据查询", "description": "查询TDengine中存储的设备运行数据，支持时间范围和聚合函数", "tool_type": "database", "config": json.dumps({"db_type": "tdengine", "tables": ["device_readings", "alarms"]})},
    {"name": "Git代码仓库API", "description": "访问Git代码仓库，获取代码diff、commit历史和分支信息", "tool_type": "api", "config": json.dumps({"protocol": "openapi", "endpoint": "https://git.internal/api/v4"})},
    {"name": "碳排放计算工具", "description": "根据能源消耗数据计算碳排放量，支持多种能源类型和排放因子", "tool_type": "mcp", "config": json.dumps({"protocol": "mcp", "endpoint": "/mcp/carbon-calc"})},
]

for t in tools_data:
    db.add(Tool(**t))

# Data Sources
dbs_data = [
    {"name": "业务数据库", "db_type": "postgresql", "description": "存储Agent配置、用户权限、工单记录等业务数据", "host": "pg-master.internal:5432"},
    {"name": "向量数据库", "db_type": "milvus", "description": "RAG知识库语义检索引擎，存储文档向量嵌入", "host": "milvus.internal:19530"},
    {"name": "时序数据库", "db_type": "tdengine", "description": "设备运行数据、发电量、能耗曲线等时序数据", "host": "tdengine.internal:6030"},
    {"name": "图数据库", "db_type": "neo4j", "description": "设备关联关系、故障因果链和知识图谱", "host": "neo4j.internal:7687"},
]

for ds in dbs_data:
    db.add(DataSource(**ds))

db.commit()
db.close()
print("Database seeded successfully!")
