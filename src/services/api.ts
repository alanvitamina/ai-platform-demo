const BASE = 'http://localhost:8000';

export async function sendMessage(agentId: number, message: string, conversationId?: number) {
  const res = await fetch(`${BASE}/api/chat/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agentId, message, conversation_id: conversationId || null }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function getConversations(agentId: number) {
  const res = await fetch(`${BASE}/api/chat/conversations/${agentId}`);
  return res.json();
}

export async function deleteConversation(conversationId: number) {
  const res = await fetch(`${BASE}/api/chat/conversations/${conversationId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete conversation');
  return res.json();
}

export async function getMessages(conversationId: number) {
  const res = await fetch(`${BASE}/api/chat/messages/${conversationId}`);
  return res.json();
}

export async function getAgents() {
  const res = await fetch(`${BASE}/api/agents/`);
  return res.json();
}

export async function createAgent(data: any) {
  const res = await fetch(`${BASE}/api/agents/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAgent(id: number) {
  const res = await fetch(`${BASE}/api/agents/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getKnowledgeBases() {
  const res = await fetch(`${BASE}/api/knowledge/bases`);
  return res.json();
}

export async function getDocuments(kbId: number) {
  const res = await fetch(`${BASE}/api/knowledge/bases/${kbId}/documents`);
  return res.json();
}

export async function createDocument(data: any) {
  const res = await fetch(`${BASE}/api/knowledge/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDocument(id: number) {
  const res = await fetch(`${BASE}/api/knowledge/documents/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getTools() {
  const res = await fetch(`${BASE}/api/tools`);
  return res.json();
}

export async function getDataSources() {
  const res = await fetch(`${BASE}/api/datasources`);
  return res.json();
}
