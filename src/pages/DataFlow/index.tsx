import { useState } from 'react';
import { Card, Typography, Tag } from 'antd';
import { SwapOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

type PathId = 'A' | 'B' | 'C';

const pathColors: Record<PathId, { color: string; bg: string }> = {
  'A': { color: '#34d399', bg: 'rgba(52,211,153,0.04)' },
  'B': { color: '#ff5c6c', bg: 'rgba(255,92,108,0.04)' },
  'C': { color: '#ff8c42', bg: 'rgba(255,140,66,0.04)' },
};

const OUTBOUND = '#00b4ff';
const INBOUND = '#a78bfa';
const CRITICAL = '#ff5c6c';

// ── Path cards ──
interface PathCard {
  id: PathId; title: string; tagline: string; routeSummary: string; steps: string[]; note: string;
}

const pathCards: PathCard[] = [
  {
    id: 'A', title: '路径 A：云端安全路径',
    tagline: '公开级 / 内部级数据 —— 脱敏后走云端，返回时反脱敏还原',
    routeSummary: '用户 → 网关（分级+脱敏+路由云端）→ 引擎（RAG+校验+推理）→ 云端模型 → 引擎（审核+封装）→ 网关（反脱敏还原）→ 用户',
    steps: ['用户在飞书提问', '网关分级→公开/内部级，正则+词典+NER脱敏', '路由至云端模型（Claude/GPT/GLM）', 'RAG检索公开/内部知识库→二次校验通过', '云端模型推理→输出安全审核', '网关反脱敏还原→飞书回复'],
    note: '敏感信息替换为假名后发给外部AI，返回后自动还原。全程可观测。',
  },
  {
    id: 'B', title: '路径 B：本地隔离路径',
    tagline: '机密级 / 绝密级数据 —— 网关强制阻断云端，全程不出公司网络',
    routeSummary: '用户 → 网关（分级+阻断云端+强制本地）→ 引擎（RAG+校验+推理）→ 本地模型 → 引擎（审核+封装）→ 网关（无需脱敏）→ 用户',
    steps: ['用户在飞书提问（涉及机密数据）', '网关识别为机密级→强制阻断云端请求', 'RAG检索机密知识库（数据不出域）', '二次安全校验：级别匹配，确认安全', '本地模型推理（DeepSeek/Ollama）→输出审核', '无需脱敏，直接返回→飞书回复'],
    note: '机密数据全程不出公司网络。网关在路由层直接拦截。',
  },
  {
    id: 'C', title: '路径 C：动态熔断路径',
    tagline: '问题不涉密但检索到机密知识 —— 先走云端，二次校验触发熔断后切回本地',
    routeSummary: '用户 → 网关（分级+脱敏+路由云端）→ 引擎（RAG命中机密→熔断！）→ 切换本地模型 → 引擎（审核+封装）→ 网关（反脱敏还原）→ 用户',
    steps: ['用户提问（问题本身不涉密）', '网关分级为内部级→脱敏→路由至云端', 'RAG检索→命中机密级会议纪要！', '二次校验触发动态熔断→切换本地模型', '本地模型基于机密知识重新推理→输出审核', '网关反脱敏还原→飞书安全回复'],
    note: '像漏电保护器：问题不涉密走云端，检索到涉密知识瞬间"跳闸"，机密数据不会泄露。',
  },
];

// ── Zone content ──
interface ZoneStep { label: string; desc?: string; critical?: boolean }
interface DirectionData { steps: ZoneStep[]; note?: string }

const zoneContentMap: Record<PathId, Record<string, { outbound: DirectionData; inbound: DirectionData }>> = {
  'A': {
    user: {
      outbound: { steps: [
        { label: '飞书机器人', desc: '群聊@AI/单聊/卡片' },
        { label: 'Web 控制台', desc: '搭建/编排/调试' },
        { label: 'API / Webhook', desc: 'SCADA/IoT/ERP' },
      ]},
      inbound: { steps: [
        { label: '飞书回复', desc: '卡片消息返回结果' },
        { label: 'Web 预览', desc: '控制台查看回复' },
      ]},
    },
    gateway: {
      outbound: {
        steps: [
          { label: '安全分级', desc: '判定为公开级或内部级' },
          { label: '入口脱敏', desc: '正则+词典+NER→替换敏感信息' },
          { label: '路由决策', desc: '放行至云端模型' },
        ],
        note: '毫秒级脱敏，不阻塞网关链路',
      },
      inbound: {
        steps: [
          { label: '反脱敏还原', desc: '映射表还原假名→真实信息' },
          { label: '输出安全审核', desc: '敏感词/合规性/格式' },
          { label: '审计记录', desc: '完整日志入库' },
        ],
        note: '自动还原，用户无感知',
      },
    },
    engine: {
      outbound: { steps: [
        { label: 'RAG 混合检索', desc: '向量语义+关键词→Reranker' },
        { label: '二次安全校验', desc: '逐条检查检索结果→通过 ✓' },
        { label: '发送模型推理', desc: '安全上下文→云端模型' },
      ]},
      inbound: { steps: [
        { label: '输出审核', desc: '幻觉检测/合规/格式' },
        { label: '结果封装', desc: '引用溯源→结构化响应' },
      ]},
    },
    resource: {
      outbound: { steps: [
        { label: '云端模型', desc: 'Claude/GPT/GLM/MiMo' },
        { label: '知识库', desc: '公开库+内部库' },
      ], note: '数据经脱敏后安全上云' },
      inbound: { steps: [
        { label: '推理完成', desc: '模型返回生成结果' },
      ]},
    },
  },
  'B': {
    user: {
      outbound: { steps: [
        { label: '飞书机器人', desc: '群聊@AI/单聊/卡片' },
        { label: 'Web 控制台', desc: '搭建/编排/调试' },
        { label: 'API / Webhook', desc: 'SCADA/IoT/ERP' },
      ]},
      inbound: { steps: [
        { label: '飞书回复', desc: '卡片消息返回结果' },
        { label: 'Web 预览', desc: '控制台查看回复' },
      ]},
    },
    gateway: {
      outbound: {
        steps: [
          { label: '安全分级', desc: '判定为机密级或绝密级' },
          { label: '跳过脱敏', desc: '数据不出域，无需脱敏' },
          { label: '强制阻断云端', desc: '🚫 云端请求被网关拒绝', critical: true },
          { label: '路由至本地', desc: '强制指向本地模型' },
        ],
        note: '机密数据出域请求在网关层直接拦截',
      },
      inbound: {
        steps: [
          { label: '无需反脱敏', desc: '全程未脱敏，直接返回' },
          { label: '输出安全审核', desc: '敏感词/合规性/格式' },
          { label: '审计记录', desc: '完整日志入库' },
        ],
        note: '数据全程不出公司网络',
      },
    },
    engine: {
      outbound: { steps: [
        { label: 'RAG 混合检索', desc: '向量语义+关键词→机密库' },
        { label: '二次安全校验', desc: '级别匹配→确认安全 ✓' },
        { label: '发送模型推理', desc: '安全上下文→本地模型' },
      ]},
      inbound: { steps: [
        { label: '输出审核', desc: '幻觉检测/合规/格式' },
        { label: '结果封装', desc: '引用溯源→结构化响应' },
      ]},
    },
    resource: {
      outbound: { steps: [
        { label: '本地模型', desc: 'DeepSeek V4/Ollama集群' },
        { label: '知识库', desc: '机密库+绝密库' },
      ], note: '部署在公司GPU服务器，物理隔离' },
      inbound: { steps: [
        { label: '推理完成', desc: '本地模型返回结果' },
      ]},
    },
  },
  'C': {
    user: {
      outbound: { steps: [
        { label: '飞书机器人', desc: '群聊@AI/单聊/卡片' },
        { label: 'Web 控制台', desc: '搭建/编排/调试' },
        { label: 'API / Webhook', desc: 'SCADA/IoT/ERP' },
      ]},
      inbound: { steps: [
        { label: '飞书回复', desc: '卡片消息返回结果' },
        { label: 'Web 预览', desc: '控制台查看回复' },
      ]},
    },
    gateway: {
      outbound: {
        steps: [
          { label: '安全分级', desc: '判定为内部级（问题不涉密）' },
          { label: '入口脱敏', desc: '正则+词典+NER→替换' },
          { label: '路由决策', desc: '放行至云端模型' },
        ],
        note: '问题本身不涉密，正常走云端',
      },
      inbound: {
        steps: [
          { label: '反脱敏还原', desc: '映射表还原假名→真实信息' },
          { label: '输出安全审核', desc: '敏感词/合规性/格式' },
          { label: '审计记录', desc: '完整日志入库' },
        ],
        note: '返回前还原所有脱敏信息',
      },
    },
    engine: {
      outbound: {
        steps: [
          { label: 'RAG 混合检索', desc: '向量语义+关键词→命中机密！' },
          { label: '动态熔断触发', desc: '⚠ 检测到机密→切换本地模型', critical: true },
          { label: '发送模型推理', desc: '本地模型基于机密知识推理' },
        ],
        note: '"路由悖论"关键防线：问题不涉密，但知识涉密',
      },
      inbound: { steps: [
        { label: '输出审核', desc: '幻觉检测/合规/格式' },
        { label: '结果封装', desc: '引用溯源→结构化响应' },
      ]},
    },
    resource: {
      outbound: { steps: [
        { label: '先请求云端', desc: '脱敏数据→Claude/GPT' },
        { label: '熔断后切本地', desc: '切换至DeepSeek/Ollama' },
      ], note: '熔断后云端请求取消，回退本地处理' },
      inbound: { steps: [
        { label: '推理完成', desc: '本地模型返回结果' },
      ]},
    },
  },
};

// ── Static data ──
const scenarios = [
  {
    title: '场景 A：竞品分析', color: '#34d399', bg: 'rgba(52,211,153,0.04)',
    steps: [
      { label: '用户输入', val: '"分析XX公司在储能领域的布局"' },
      { label: '分级', val: '公开级' }, { label: '脱敏', val: '无需' },
      { label: '路由', val: '云端 Claude' }, { label: 'RAG', val: '检索公开行业报告' },
      { label: '校验', val: '通过' }, { label: '返回', val: '飞书发送分析报告' },
    ],
  },
  {
    title: '场景 B：工艺参数查询', color: '#ff5c6c', bg: 'rgba(255,92,108,0.04)',
    steps: [
      { label: '用户输入', val: '"查一下3号机组的核心工艺参数"' },
      { label: '分级', val: '机密级' }, { label: '脱敏', val: '数据不出域' },
      { label: '路由', val: '本地 DeepSeek' }, { label: 'RAG', val: '检索机密工艺库' },
      { label: '校验', val: '级别匹配，安全' }, { label: '返回', val: '飞书发送参数详情' },
    ],
  },
  {
    title: '场景 C：会议总结（熔断）', color: '#ff8c42', bg: 'rgba(255,140,66,0.04)',
    steps: [
      { label: '用户输入', val: '"帮我总结昨天的会议"' },
      { label: '分级', val: '内部级' }, { label: '脱敏', val: '正则+词典' },
      { label: '路由', val: '云端 GPT' }, { label: 'RAG', val: '检索会议纪要' },
      { label: '校验', val: '命中机密！熔断→切本地' }, { label: '返回', val: '飞书发送会议摘要' },
    ],
  },
];

const obsDims = [
  { title: 'Tracing 链路追踪', desc: '完整执行链路，每步输入/输出/耗时/元数据', color: '#ffd166' },
  { title: 'Replay 回放', desc: '历史对话一键重放，新版模型对比', color: '#00e5c8' },
  { title: 'Evaluation 质量评估', desc: '自动评分：相关性/准确性/幻觉/安全', color: '#a78bfa' },
  { title: 'Feedback 用户反馈', desc: '点赞/点踩/文字反馈，回流优化Agent', color: '#34d399' },
  { title: 'Audit 审计追溯', desc: '谁问了什么/答了什么，审批/操作日志', color: '#00b4ff' },
  { title: 'Drift 漂移检测', desc: '质量趋势监控，下降自动告警', color: '#ff5c6c' },
];

const zoneIds = ['user', 'gateway', 'engine', 'resource'] as const;
const zoneMeta: Record<string, { title: string; icon: string }> = {
  user: { title: '用户入口层', icon: '👤' },
  gateway: { title: '安全网关层', icon: '🛡️' },
  engine: { title: '处理引擎层', icon: '⚙️' },
  resource: { title: '资源层', icon: '🗄️' },
};

// ── Sub-components ──

function FlowDots({ color, reverse }: { color: string; reverse?: boolean }) {
  const cls = reverse ? 'flow-particle-reverse' : 'flow-particle';
  return (
    <>
      <div className={cls} style={{ position: 'absolute', background: color, width: 4, height: 4, borderRadius: '50%', boxShadow: `0 0 6px ${color}` }} />
      <div className={cls} style={{ position: 'absolute', background: color, width: 4, height: 4, borderRadius: '50%', boxShadow: `0 0 6px ${color}` }} />
      <div className={cls} style={{ position: 'absolute', background: color, width: 4, height: 4, borderRadius: '50%', boxShadow: `0 0 6px ${color}` }} />
    </>
  );
}

// ── Page ──
export default function DataFlow() {
  const [selectedPath, setSelectedPath] = useState<PathId>('A');
  const pc = pathColors[selectedPath];
  const zoneData = zoneContentMap[selectedPath];
  const card = pathCards.find(c => c.id === selectedPath)!;

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#e8edf5' }}>数据安全流转</Title>
        <Text type="secondary">数据从用户发起请求到返回结果的往返闭环 — 蓝色出站，紫色入站，红色安全拦截</Text>
      </div>

      {/* Path Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {pathCards.map((p) => {
          const isSel = selectedPath === p.id;
          const c = pathColors[p.id];
          return (
            <button key={p.id} onClick={() => setSelectedPath(p.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px', borderRadius: 10,
              background: isSel ? `${c.color}10` : 'rgba(255,255,255,0.01)',
              border: isSel ? `2px solid ${c.color}` : '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: isSel ? `0 0 20px ${c.color}12` : undefined,
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: 7,
                background: isSel ? `${c.color}20` : 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: isSel ? c.color : '#4a5f80',
                transition: 'all 0.3s ease',
              }}>{p.id}</span>
              <span style={{ fontSize: 13, fontWeight: isSel ? 600 : 400, color: isSel ? '#e8edf5' : '#8899b4', textAlign: 'left' as const, transition: 'all 0.3s ease' }}>
                {p.title.replace(/路径 [ABC]：/, '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Flow Diagram: one card per zone, outbound+inbound inside each ── */}
      <Card
        className="anim-fade-up"
        style={{
          background: '#0a1628',
          border: `2px solid ${pc.color}25`,
          borderRadius: 12,
          marginBottom: 16,
        }}
        styles={{ body: { padding: '18px 20px 14px' } }}
      >
        {/* Outbound label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <ArrowRightOutlined style={{ color: OUTBOUND, fontSize: 13 }} />
          <Text style={{ fontSize: 12, fontWeight: 600, color: OUTBOUND }}>出站</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>请求进入 → 分级脱敏 → 路由决策 → 模型推理</Text>
        </div>

        {/* Zone cards row */}
        <div className="df-zone-row" style={{ display: 'flex', gap: 0, alignItems: 'stretch', overflowX: 'auto' }}>
          {zoneIds.map((zid, zi) => {
            const meta = zoneMeta[zid];
            const zd = zoneData[zid];
            const hasCritical = zd.outbound.steps.some(s => s.critical) || zd.inbound.steps.some(s => s.critical);

            return (
              <div key={zid} style={{ display: 'flex', alignItems: 'stretch' }}>
                {/* Connector: outbound (top) + inbound (bottom) stacked */}
                {zi > 0 && (
                  <div className="df-connector" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: 36, flexShrink: 0, gap: 6,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 14 }}>
                      <ArrowRightOutlined style={{ color: OUTBOUND, fontSize: 14, opacity: 0.5 }} />
                      <FlowDots color={OUTBOUND} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative', height: 14 }}>
                      <ArrowLeftOutlined style={{ color: INBOUND, fontSize: 14, opacity: 0.5 }} />
                      <FlowDots color={INBOUND} reverse />
                    </div>
                  </div>
                )}

                {/* Zone card */}
                <div className={zid === 'user' ? 'df-zone-card df-user-zone' : 'df-zone-card'} style={{
                  flex: zid === 'user' ? '0 0 200px' : '1 1 0',
                  minWidth: zid === 'user' ? 160 : 190,
                  background: '#0f1d35',
                  border: hasCritical ? `1px solid ${CRITICAL}20` : `1px solid ${pc.color}12`,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}>
                  {/* Zone header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 14px',
                    borderBottom: `1px solid ${pc.color}10`,
                    background: `${pc.color}04`,
                  }}>
                    <span style={{ fontSize: 16 }}>{meta.icon}</span>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#c8d6e5' }}>{meta.title}</Text>
                    {hasCritical && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: `${CRITICAL}15`, color: CRITICAL, marginLeft: 'auto' }}>
                        拦截
                      </span>
                    )}
                  </div>

                  {/* Outbound section */}
                  <div style={{ padding: '10px 14px 6px' }}>
                    <div style={{ fontSize: 10, color: OUTBOUND, marginBottom: 6, fontWeight: 600 }}>
                      <ArrowRightOutlined style={{ fontSize: 9, marginRight: 4 }} />出站
                    </div>
                    {zd.outbound.steps.map((step, si) => (
                      <div key={si} style={{
                        fontSize: 11, padding: '3px 0 3px 10px', lineHeight: 1.5, marginBottom: 2,
                        borderLeft: step.critical ? `2px solid ${CRITICAL}` : `1px solid ${OUTBOUND}15`,
                      }}>
                        <span style={{ color: step.critical ? CRITICAL : '#c8d6e5', fontWeight: step.critical ? 600 : 400 }}>
                          {step.label}
                        </span>
                        {step.desc && <span style={{ color: step.critical ? `${CRITICAL}99` : '#4a5f80', marginLeft: 4, fontSize: 10 }}>{step.desc}</span>}
                      </div>
                    ))}
                    {zd.outbound.note && (
                      <div style={{ marginTop: 6, fontSize: 9, color: '#4a5f80', padding: '4px 8px', background: 'rgba(255,255,255,0.015)', borderRadius: 4, textAlign: 'center' as const }}>
                        {zd.outbound.note}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, margin: '4px 14px', background: `linear-gradient(90deg, ${OUTBOUND}15, ${INBOUND}15)` }} />

                  {/* Inbound section */}
                  <div style={{ padding: '6px 14px 10px' }}>
                    <div style={{ fontSize: 10, color: INBOUND, marginBottom: 6, fontWeight: 600 }}>
                      <ArrowLeftOutlined style={{ fontSize: 9, marginRight: 4 }} />入站
                    </div>
                    {zd.inbound.steps.map((step, si) => (
                      <div key={si} style={{
                        fontSize: 11, padding: '3px 0 3px 10px', lineHeight: 1.5, marginBottom: 2,
                        borderLeft: step.critical ? `2px solid ${CRITICAL}` : `1px solid ${INBOUND}15`,
                      }}>
                        <span style={{ color: step.critical ? CRITICAL : '#c8d6e5', fontWeight: step.critical ? 600 : 400 }}>
                          {step.label}
                        </span>
                        {step.desc && <span style={{ color: step.critical ? `${CRITICAL}99` : '#4a5f80', marginLeft: 4, fontSize: 10 }}>{step.desc}</span>}
                      </div>
                    ))}
                    {zd.inbound.note && (
                      <div style={{ marginTop: 6, fontSize: 9, color: '#4a5f80', padding: '4px 8px', background: 'rgba(255,255,255,0.015)', borderRadius: 4, textAlign: 'center' as const }}>
                        {zd.inbound.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inbound label below */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <ArrowLeftOutlined style={{ color: INBOUND, fontSize: 13 }} />
          <Text style={{ fontSize: 12, fontWeight: 600, color: INBOUND }}>入站</Text>
          <Text type="secondary" style={{ fontSize: 10 }}>审核封装 → 反脱敏还原 → 安全返回用户</Text>
        </div>
      </Card>

      {/* Route summary */}
      <div style={{
        marginBottom: 28, padding: '10px 18px',
        background: `${pc.color}06`,
        border: `1px solid ${pc.color}15`,
        borderLeft: `3px solid ${pc.color}`,
        borderRadius: '0 8px 8px 0',
        fontSize: 12, color: '#8899b4', lineHeight: 1.6,
      }}>
        <strong style={{ color: pc.color }}>路径 {selectedPath} 往返路线：</strong>{card.routeSummary}
      </div>

      {/* ── Path Cards ── */}
      <div style={{ marginBottom: 36 }}>
        <Title level={5} style={{ color: '#e8edf5', marginBottom: 16 }}>三条路径详情对比</Title>
        <div className="path-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          {pathCards.map((p) => {
            const isSel = selectedPath === p.id;
            const c = pathColors[p.id];
            return (
              <Card key={p.id} onClick={() => setSelectedPath(p.id)} className="anim-fade-up"
                style={{
                  background: isSel ? `${c.color}05` : 'rgba(255,255,255,0.01)',
                  border: isSel ? `2px solid ${c.color}40` : `1px solid rgba(255,255,255,0.06)`,
                  borderTop: `3px solid ${c.color}`,
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSel ? `0 0 24px ${c.color}10` : undefined,
                  opacity: isSel ? 1 : 0.65,
                }}
                styles={{ body: { padding: '18px 20px' } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c.color }}>{p.id}</div>
                  <Text strong style={{ color: c.color, fontSize: 15 }}>{p.title}</Text>
                  {isSel && <Tag style={{ fontSize: 9, margin: 0, background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>当前选中</Tag>}
                </div>
                <Text type="secondary" style={{ fontSize: 11, marginBottom: 10, display: 'block', lineHeight: 1.5 }}>{p.tagline}</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10 }}>
                  {p.steps.map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: '#8899b4', paddingLeft: 14, position: 'relative', lineHeight: 1.7 }}>
                      <span style={{ position: 'absolute', left: 0, color: c.color }}>→</span>{s}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 10px', borderRadius: 6, background: `${c.color}10`, color: c.color, fontSize: 11, lineHeight: 1.5 }}>{p.note}</div>
                <div style={{ marginTop: 10, padding: '6px 10px', borderRadius: 4, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', fontSize: 10, color: '#4a5f80', lineHeight: 1.5 }}>
                  <strong style={{ color: c.color }}>往返路线：</strong>{p.routeSummary}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Scenarios + Observability ── */}
      <div className="roundtrip-flow" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <Title level={4} style={{ color: '#e8edf5', marginBottom: 16 }}>关键场景实例</Title>
          <div className="scenario-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {scenarios.map((sc, idx) => (
              <Card key={idx} style={{ background: sc.bg, border: `1px solid ${sc.color}20`, borderTop: `3px solid ${sc.color}` }} styles={{ body: { padding: '16px 18px' } }} className="anim-fade-up">
                <Text strong style={{ color: sc.color, fontSize: 14, display: 'block', marginBottom: 12 }}>{sc.title}</Text>
                {sc.steps.map((step, si) => (
                  <div key={si}>
                    {si > 0 && <div style={{ textAlign: 'center', fontSize: 10, color: '#1a3055', padding: '1px 0' }}>↓</div>}
                    <div style={{ fontSize: 11, color: '#8899b4', padding: '5px 8px', background: si === sc.steps.length - 2 ? `${sc.color}10` : 'transparent', border: si === sc.steps.length - 2 ? `1px solid ${sc.color}20` : 'none', borderRadius: 4, lineHeight: 1.5 }}>
                      <strong style={{ color: sc.color }}>{step.label}：</strong>{step.val}
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.12)', borderLeft: '3px solid #00b4ff', borderRadius: '0 6px 6px 0', fontSize: 13, color: '#8899b4', lineHeight: 1.7 }}>
            <strong style={{ color: '#00b4ff' }}>三个场景的核心对比：</strong>场景 A 全程云端链路（最快、最省资源）；场景 B 全程本地链路（最安全）；场景 C 先走云端但被二次校验拦截，动态切换到本地（安全兜底）。三条路径覆盖了所有业务场景。
          </div>
        </div>

        <div style={{ width: 250, flexShrink: 0 }}>
          <Card style={{ background: '#0f1d35', border: '1px solid rgba(167,139,250,0.15)', position: 'sticky', top: 80 }} styles={{ body: { padding: '14px 16px' } }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <SwapOutlined /> 可观测性数据回流
            </div>
            <Text type="secondary" style={{ fontSize: 10, display: 'block', marginBottom: 10, lineHeight: 1.5 }}>平台每一环节都产生观测数据，回流至管理后台</Text>
            {obsDims.map((dim) => (
              <div key={dim.title} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderLeft: `2px solid ${dim.color}`, borderRadius: 4, padding: '8px 10px', marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: dim.color, marginBottom: 2 }}>{dim.title}</div>
                <div style={{ fontSize: 10, color: '#4a5f80', lineHeight: 1.4 }}>{dim.desc}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, padding: '8px 10px', background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 6, fontSize: 10, color: '#4a5f80', lineHeight: 1.5 }}>
              <strong style={{ color: '#a78bfa' }}>实现工具：</strong><br />LangFuse（核心引擎）<br />Grafana（可视化）<br />Prometheus（指标）
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
