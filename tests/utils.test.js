import { describe, it, expect } from 'vitest';
import { escapeHtml, buildMessage, parseReply, trimHistory } from '../src/utils.js';

describe('escapeHtml', () => {
  it('escapa etiquetas HTML para evitar inyeccion', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });
});

describe('buildMessage', () => {
  it('arma un mensaje con el formato esperado por la API de Gemini', () => {
    const msg = buildMessage('user', 'Hola Mario');
    expect(msg).toEqual({ role: 'user', parts: [{ text: 'Hola Mario' }] });
  });

  it('lanza un error si el rol no es "user" ni "model"', () => {
    expect(() => buildMessage('system', 'texto')).toThrow('Rol invalido');
  });
});

describe('parseReply', () => {
  it('devuelve el texto cuando la respuesta tiene el formato correcto', () => {
    expect(parseReply({ reply: 'Wahoo!' })).toBe('Wahoo!');
  });

  it('lanza un error si falta el campo reply', () => {
    expect(() => parseReply({})).toThrow('formato inesperado');
  });
});

describe('trimHistory', () => {
  it('recorta el historial cuando supera el maximo de entradas', () => {
    const history = Array.from({ length: 25 }, (_, i) => buildMessage('user', `msg ${i}`));
    const trimmed = trimHistory(history, 20);
    expect(trimmed).toHaveLength(20);
    expect(trimmed[0].parts[0].text).toBe('msg 5'); 
  });

  it('no modifica el historial si esta por debajo del maximo', () => {
    const history = [buildMessage('user', 'hola')];
    expect(trimHistory(history, 20)).toBe(history);
  });
});
