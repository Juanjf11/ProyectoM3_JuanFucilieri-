import { describe, it, expect, vi } from 'vitest';
import { addRoute, resolveRoute } from '../src/app.js';

describe('router (app.js)', () => {
  it('resuelve la ruta registrada correspondiente', () => {
    const fakeHome = vi.fn();
    const fakeAbout = vi.fn();
    addRoute('/home', fakeHome);
    addRoute('/about', fakeAbout);

    expect(resolveRoute('/about')).toBe(fakeAbout);
  });

  it('devuelve la ruta /home como fallback cuando la ruta no existe', () => {
    const fakeHome = vi.fn();
    addRoute('/home', fakeHome);

    expect(resolveRoute('/ruta-inexistente')).toBe(fakeHome);
  });
});
