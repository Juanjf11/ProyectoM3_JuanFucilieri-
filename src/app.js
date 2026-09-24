import { renderChat } from './chat.js';

const routes = {};

export function addRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function resolveRoute(path) {
  return routes[path] || routes['/home'];
}

export function navigate(path) {
  window.history.pushState({}, '', path);
  render(path);
}

function render(path) {
  const container = document.getElementById('app');
  const renderFn = resolveRoute(path);
  container.innerHTML = '';
  renderFn(container);
  updateActiveLink(path);
}

function updateActiveLink(path) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === path);
  });
}

export function initRouter() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) {
      e.preventDefault();
      navigate(link.getAttribute('href'));
    }
  });

  window.addEventListener('popstate', () => {
    render(window.location.pathname);
  });

  const initialPath = window.location.pathname === '/' ? '/home' : window.location.pathname;
  if (window.location.pathname === '/') {
    window.history.replaceState({}, '', '/home');
  }
  render(initialPath);
}

// ---- Vistas simples (Home / About) ----

export function renderHome(container) {
  container.innerHTML = `
    <section class="home-view">
      <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/MarioNSMBUDeluxe.png"
           alt="Mario" class="character-img" />
      <h1>Wahoo! Soy Mario</h1>
      <p>
        El fontanero mas famoso del Mushroom Kingdom. Vengo a contarte
        historias de mis aventuras salvando a la princesa Peach de Bowser,
        recolectando estrellas y comiendo algun que otro hongo por el camino.
      </p>
      <button id="start-chat-btn" class="btn-primary">Empezar a chatear</button>
    </section>
  `;

  container.querySelector('#start-chat-btn').addEventListener('click', () => {
    navigate('/chat');
  });
}

export function renderAbout(container) {
  container.innerHTML = `
    <section class="about-view">
      <h1>Sobre el proyecto</h1>
      <p>
        Esta es una prueba de concepto (POC) desarrollada como Proyecto
        Integrador: una Single Page Application que permite chatear con un
        personaje ficticio usando inteligencia artificial (Google Gemini AI).
      </p>
      <h2>El personaje: Mario</h2>
      <p>
        Mario es el protagonista de la saga de videojuegos de Nintendo.
        Fontanero italiano, alegre y valiente, siempre listo para una nueva
        aventura en el Mushroom Kingdom.
      </p>
      <h2>Tecnologias usadas</h2>
      <ul>
        <li>HTML, CSS y JavaScript</li>
        <li>SPA con routing propio basado en History API</li>
        <li>Vercel Functions como proxy seguro hacia Gemini AI</li>
        <li>Tests unitarios con Vitest</li>
      </ul>
    </section>
  `;
}

if (typeof window !== 'undefined' && document.getElementById('app')) {
  addRoute('/home', renderHome);
  addRoute('/chat', renderChat);
  addRoute('/about', renderAbout);
  initRouter();
}
