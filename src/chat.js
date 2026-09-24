import { escapeHtml, buildMessage, parseReply, trimHistory, stripMarkdown } from './utils.js';

let conversation = [];

export async function sendMessage(history) {
  const response = await fetch('/api/functions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Error del servidor: ${response.status}`);
  }

  const data = await response.json();
  return parseReply(data);
}

export function renderChat(container) {
  container.innerHTML = `
    <section class="chat-view">
      <div id="chatMessages" class="chatMessages"></div>
      <div id="typingIndicator" class="typing-indicator hidden">Mario esta escribiendo...</div>
      <div id="errorBanner" class="error-banner hidden"></div>
      <form id="chatForm" class="chat-form">
        <input
          id="chatInput"
          type="text"
          placeholder="Escribile algo a Mario..."
          autocomplete="off"
          required
        />
        <button type="submit" class="btn-primary">Enviar</button>
      </form>
    </section>
  `;

  const messagesEl = container.querySelector('#chatMessages');
  const formEl = container.querySelector('#chatForm');
  const inputEl = container.querySelector('#chatInput');
  const typingEl = container.querySelector('#typingIndicator');
  const errorEl = container.querySelector('#errorBanner');

  renderMessages(messagesEl);

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    hideError(errorEl);
    conversation.push(buildMessage('user', text));
    conversation = trimHistory(conversation);
    renderMessages(messagesEl);
    inputEl.value = '';
    inputEl.disabled = true;
    typingEl.classList.remove('hidden');

    try {
      const reply = await sendMessage(conversation);
      conversation.push(buildMessage('model', reply));
      renderMessages(messagesEl);
    } catch (err) {
      showError(errorEl, err.message || 'Ocurrio un error al contactar a Mario.');
    } finally {
      typingEl.classList.add('hidden');
      inputEl.disabled = false;
      inputEl.focus();
    }
  });
}

function renderMessages(messagesEl) {
  messagesEl.innerHTML = conversation
    .map((msg) => {
      const roleClass = msg.role === 'user' ? 'message-user' : 'message-character';
      const rawText = msg.parts[0].text;
      const text = msg.role === 'model' ? stripMarkdown(rawText) : rawText;
      return `<div class="message ${roleClass}">${escapeHtml(text)}</div>`;
    })
    .join('');

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showError(el, message) {
  el.textContent = message;
  el.classList.remove('hidden');
}
function hideError(el) {
  el.classList.add('hidden');
  el.textContent = '';
}
