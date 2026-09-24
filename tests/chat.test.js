import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../src/chat.js';

describe('sendMessage', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('devuelve el texto de la respuesta cuando la API responde OK', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "Wahoo! Let's-a go!" }),
    });

    const history = [{ role: 'user', parts: [{ text: 'Hola Mario' }] }];
    const reply = await sendMessage(history);

    expect(reply).toBe("Wahoo! Let's-a go!");
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/functions',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('lanza un error cuando la API responde con un status de error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error interno del servidor' }),
    });

    const history = [{ role: 'user', parts: [{ text: 'Hola' }] }];

    await expect(sendMessage(history)).rejects.toThrow('Error interno del servidor');
  });
});
