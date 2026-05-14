# InsightHub

InsightHub es una web SaaS con landing publica, login, panel privado y una base real de integraciones sociales sobre Supabase.

Incluye:

- Landing publica en `/`
- Login en `/login`
- App privada en `/dashboard`, `/content`, `/audience`, `/insights`, `/settings`
- Paginas legales en `/privacy`, `/terms` y `/cookies`
- Integraciones reales de YouTube y TikTok via Supabase Edge Functions

El proyecto todavia conserva datos simulados en partes del dashboard mientras se completan las integraciones reales restantes.

## Base de producto

La arquitectura ya esta pensada para comercializar el producto desde una sola web:

- zona publica para venta y captacion
- zona privada para uso del panel
- autenticacion por Google o email/password
- base preparada para suscripciones y control de acceso

## Preparado para Supabase

El proyecto queda listo para evolucionar hacia Supabase:

- Cliente frontend en `src/integrations/supabase/`
- Variables de entorno en `.env.example`
- Esquema SQL inicial en `supabase/migrations/001_creatoros_schema.sql`
- Edge Functions base en `supabase/functions/`

Si `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` no existen, la app sigue funcionando con mocks.

### Flujo recomendado

1. Crear proyecto en Supabase
2. Ejecutar la migracion SQL
3. Configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Añadir secretos OAuth en Supabase para YouTube, Instagram y TikTok
5. Completar o ampliar las integraciones reales restantes

## Integraciones reales actuales: YouTube + TikTok

Ya queda preparada una primera base real de YouTube y TikTok via Supabase:

- `supabase/functions/youtube-oauth-start`
- `supabase/functions/youtube-oauth-callback`
- `supabase/functions/youtube-sync`
- `supabase/functions/tiktok-oauth-start`
- `supabase/functions/tiktok-oauth-callback`
- `supabase/functions/tiktok-sync`
- `src/integrations/supabase/youtube.ts`
- `src/integrations/supabase/tiktok.ts`

### Secrets necesarios en Supabase

- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REDIRECT_URI`
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REDIRECT_URI`
- `SERVICE_ROLE_KEY`

### Redirect URI sugerida

Usa la URL de la edge function callback, por ejemplo:

```text
https://<project-ref>.supabase.co/functions/v1/youtube-oauth-callback
```

Y para TikTok:

```text
https://<project-ref>.supabase.co/functions/v1/tiktok-oauth-callback
```

### Que sincroniza

- Canal de YouTube autenticado
- Seguidores y datos basicos del canal
- Ultimos videos publicados
- Metricas diarias de 90 dias via YouTube Analytics
- Paises principales
- Demografia por edad y genero
- Perfil autenticado de TikTok
- Ultimos videos publicados en TikTok
- Seguidores y evolucion basica desde snapshots propios

### Siguiente paso real

Cuando tengas Google Cloud y TikTok for Developers configurados, el frontend puede iniciar la conexion llamando a `startYouTubeOAuth({ redirectTo })` y `startTikTokOAuth({ redirectTo })`.

### Seed demo para probar sin Auth completo

Puedes cargar un usuario demo en Supabase con:

```sql
\i supabase/seed/001_demo_creator.sql
```

Ese seed usa el id:

```text
11111111-1111-1111-1111-111111111111
```

Y coincide con `VITE_CREATOROS_DEMO_USER_ID`, que permite disparar la conexion real de YouTube desde la UI mientras no se haya integrado Supabase Auth.

## Despliegue en Vercel

El proyecto incluye `vercel.json` para servir correctamente las rutas del frontend con React Router.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Rutas principales

- `/login`
- `/dashboard`
- `/content`
- `/audience`
- `/insights`
- `/settings`
