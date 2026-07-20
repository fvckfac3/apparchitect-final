import { serveStatic } from 'hono/bun';
import type { ViteDevServer } from 'vite';
import { createServer as createViteServer } from 'vite';
import config from './zosite.json';
import { Hono } from 'hono';
import { handleAiChat } from './server/ai';

type Mode = 'development' | 'production';
const app = new Hono();
const mode: Mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
app.post('/api/ai/chat', handleAiChat);

if (mode === 'production') configureProduction(app);
else await configureDevelopment(app);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : mode === 'production' ? (config.publish?.published_port ?? config.local_port) : config.local_port;
export default { fetch: app.fetch, port, idleTimeout: 255 };

function configureProduction(app: Hono) {
  app.use('/assets/*', serveStatic({ root: './dist' }));
  app.get('/favicon.ico', (c) => c.redirect('/favicon.svg', 302));
  app.use(async (c, next) => {
    if (c.req.method !== 'GET') return next();
    const path = c.req.path;
    if (path.startsWith('/api/') || path.startsWith('/assets/')) return next();
    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) return new Response(file);
    }
    return serveStatic({ path: './dist/index.html' })(c, next);
  });
}

async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  app.use('*', async (c, next) => {
    if (c.req.path.startsWith('/api/')) return next();
    if (c.req.path === '/favicon.ico') return c.redirect('/favicon.svg', 302);
    try {
      if (c.req.path === '/' || c.req.path === '/index.html') {
        let template = await Bun.file('./index.html').text();
        template = await vite.transformIndexHtml(c.req.path, template);
        return c.html(template, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
      }
      const publicFile = Bun.file(`./public${c.req.path}`);
      if (await publicFile.exists()) return new Response(publicFile, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
      const result = await vite.transformRequest(c.req.path).catch(() => null);
      if (result) return new Response(result.code, { headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store, must-revalidate' } });
      let template = await Bun.file('./index.html').text();
      template = await vite.transformIndexHtml('/', template);
      return c.html(template, { headers: { 'Cache-Control': 'no-store, must-revalidate' } });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text('Internal Server Error', 500);
    }
  });
  return vite;
}
