export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function buildMessage(role, text) {
  if (role !== 'user' && role !== 'model') {
    throw new Error(`Rol invalido: ${role}`);
  }
  return { role, parts: [{ text }] };
}

export function parseReply(data) {
  if (!data || typeof data.reply !== 'string' || data.reply.trim() === '') {
    throw new Error('Respuesta de la IA en formato inesperado');
  }
  return data.reply;
}

export function trimHistory(history, maxEntries = 20) {
  if (history.length <= maxEntries) return history;
  return history.slice(history.length - maxEntries);
}

export function stripMarkdown(str) {
  return String(str)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1');
}
