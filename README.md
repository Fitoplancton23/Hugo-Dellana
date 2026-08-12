# Hugo Dellana — Press Kit

Sitio de una página (formato sábana) para el press kit de Hugo Dellana, DJ — dirección
visual **Deep Tech House**: oscuro, editorial, tipografía a gran escala. HTML/CSS/JS sin
frameworks ni build: se sube tal cual a GitHub Pages.

## Estructura

```
hugo-dellana-presskit/
├── index.html            → contenido y secciones
├── css/styles.css        → tokens de diseño + responsive
├── js/main.js            → nav activa, parallax, reveal y los 2 carruseles
├── assets/
│   ├── hero.jpg          → portada (reemplazar)
│   ├── bio-1.jpg / bio-2.jpg
│   ├── flyers/01–07.jpg  → carrusel 3D de flyers
│   └── photos/01–11.jpg  → carrusel abanico de fotos
├── .nojekyll
└── README.md
```

## Secciones

Nav fija · Hero · Bio · Sets · Galería (carrusel abanico) · Flyers (carrusel 3D) ·
Fechas · Equipo · Booking/Contacto.

## Publicar en GitHub Pages

1. Creá un repo y subí **el contenido de esta carpeta** a la raíz (que `index.html` quede en la raíz).
2. Repo → **Settings → Pages**.
3. *Source*: **Deploy from a branch** → rama `main`, carpeta `/ (root)`. Guardá.
4. En ~1–2 min queda en `https://TU-USUARIO.github.io/hugo-dellana-presskit/`.

## Editar contenido

- **Portada:** reemplazá `assets/hero.jpg`. El nombre y textos están en `.hero` (index.html).
- **Textos:** bio, sets, fechas, equipo y booking están en `index.html` con placeholders entre `[corchetes]`.
- **Links reales:** poné las URLs en los `href="#"` (nav, sets, redes) y el mail en la sección Booking.
- **Sets de SoundCloud:** hay un ejemplo de `<iframe>` comentado en la sección Sets del HTML.
- **Flyers:** reemplazá `assets/flyers/01–07.jpg`. Para cambiar la cantidad, ajustá las cards en `.cyl-ring` y los ángulos `--rot` en el CSS (`360 / cantidad`).
- **Fotos:** reemplazá `assets/photos/01–11.jpg`. Para cambiar la cantidad, actualizá `--items` en `.fan-item` (CSS).
- **Color de acento:** variable `--signal` en `styles.css`.

## Ver en local

```bash
python3 -m http.server 8080   # luego http://localhost:8080
```

## Notas

- Tipografías vía Google Fonts (Archivo, Inter, Space Mono); si no hay internet caen a fuentes del sistema.
- El marco es monocromo a propósito: el color lo aportan fotos y flyers.
- La rueda del mouse controla los carruseles al pasar por encima; quitá el listener `'wheel'` en `main.js` si preferís que scrollee la página.
- Respeta `prefers-reduced-motion`.
