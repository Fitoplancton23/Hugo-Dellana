# Editor del Press Kit (Sveltia CMS)

El cliente puede editar **textos (bio), galería de fotos, videos de YouTube y fechas**
desde `https://fitoplancton23.github.io/Hugo-Dellana/admin/`.
Al guardar, los cambios se commitean a este repo y GitHub Pages republica el sitio solo.

El sitio lee todo el contenido editable desde `content.json` (en la raíz del repo).
Si `content.json` no cargara, el sitio muestra el contenido estático del HTML como respaldo.

---

## Puesta en marcha (una sola vez) — lo hace Facundo

Para que el login del editor funcione, Sveltia necesita un pequeño relay OAuth.
Es gratis y se hace en ~10 minutos.

### 1) Crear una GitHub OAuth App
GitHub → Settings → Developer settings → **OAuth Apps** → **New OAuth App**
- **Application name:** Hugo Dellana Press Kit
- **Homepage URL:** `https://fitoplancton23.github.io/Hugo-Dellana/`
- **Authorization callback URL:** `https://TU-WORKER.workers.dev/callback`
  (completá esta URL después de crear el worker, en el paso 2)
- Guardá el **Client ID** y generá un **Client Secret**.

### 2) Deployar el worker `sveltia-cms-auth` en Cloudflare (gratis)
- Repo: https://github.com/sveltia/sveltia-cms-auth (tiene botón "Deploy to Cloudflare").
- Al terminar te da una URL tipo `https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev`.
- En el worker → Settings → Variables, cargá:
  - `GITHUB_CLIENT_ID` = el Client ID del paso 1
  - `GITHUB_CLIENT_SECRET` = el Client Secret (marcalo como *encrypted*)
  - `ALLOWED_DOMAINS` = `fitoplancton23.github.io`
- Volvé a la OAuth App del paso 1 y poné el **callback** = `https://ESA-URL-DEL-WORKER/callback`.

### 3) Conectar el CMS
En `admin/config.yml`, reemplazá el placeholder:
```yaml
backend:
  base_url: https://sveltia-cms-auth.TU-SUBDOMINIO.workers.dev
```
Commiteá y listo.

### 4) Dar acceso al cliente
- Agregá al cliente como **colaborador** del repo (Settings → Collaborators) — necesita cuenta de GitHub.
- El cliente entra a `.../admin/`, hace **Login with GitHub**, autoriza una vez, y ya puede editar.

---

## Notas
- Las fotos nuevas que suba el cliente van a `assets/photos/`.
- Los videos aceptan el **link de YouTube** o el **ID** de 11 caracteres.
- Para quitar la sección de Fechas del sitio, borrá todas las fechas en el editor
  (o pedímelo y saco la sección del HTML).
