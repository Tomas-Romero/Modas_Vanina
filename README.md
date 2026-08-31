# Modas Vanina

Catálogo online **sin precios** para Modas Vanina — indumentaria, perfumería, cremas, tuppers y variedades, en San Rafael, Mendoza. El cliente navega, arma una lista y consulta por WhatsApp; la dueña administra todo el catálogo (y publica en redes) desde un panel propio.

## ¿Qué es esto?

Una app web completa (sitio público + panel de administración) construida con Next.js, pensada para un comercio real que no vende online: no hay carrito ni pagos, el objetivo es que el cliente descubra productos lindo y fácil, y termine la conversación por WhatsApp — que es como esta tienda realmente vende.

## ¿Para qué sirve?

- **Para el cliente:** ver el catálogo por categoría (indumentaria, perfumería, cremas, tuppers, varios), buscar, abrir una ficha de producto con descripción generada por IA, armar una "lista" de productos de interés y mandarla por WhatsApp con un mensaje ya redactado.
- **Para la dueña (admin):** cargar productos con fotos (con recorte automático de portada), generar la descripción de cada producto con un click usando IA, armar ofertas/novedades que aparecen en la home, ver qué productos generan más consultas por WhatsApp, y publicar productos/ofertas directo en Facebook e Instagram sin salir del panel.

## ¿Qué tecnologías usa?

| Área | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + React 19 + TypeScript |
| Estilos / UI | Tailwind CSS, Framer Motion (animaciones), `next-themes` (claro/oscuro) |
| Base de datos y Auth | [Supabase](https://supabase.com/) (Postgres + Row Level Security + Auth) |
| Imágenes | [Cloudinary](https://cloudinary.com/) (subida firmada + optimización on-the-fly) |
| Descripciones por IA | [Groq](https://groq.com/) (modelo de visión, genera texto a partir de la foto del producto) |
| Redes sociales | Meta Graph API (Facebook Pages + Instagram Business) — publica y verifica que la publicación haya quedado realmente en línea |
| Formularios y validación | `react-hook-form` + `zod` |
| Hosting | [Vercel](https://vercel.com/) |

Todo el proyecto está en TypeScript estricto y sin dependencias de UI de terceros (los componentes son propios, sobre Tailwind).

## ¿Cómo lo veo funcionando? (demo en vivo)

**[modas-vanina.vercel.app](https://modas-vanina.vercel.app/)**

## ¿Cómo lo corro en mi máquina?

```bash
git clone <url-del-repo>
cd Modas_Vanina
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

**No hace falta ninguna cuenta ni API key para levantarlo**: sin variables de entorno, el sitio corre en **modo demo** — catálogo y panel admin funcionan con datos de muestra en memoria, la subida de fotos usa preview local, la descripción por IA devuelve un texto de ejemplo, y no hay publicación real en redes. Es el modo pensado para explorar el diseño y la UX sin depender de servicios externos.

Para que todo funcione contra servicios reales, copiá `.env.local.example` a `.env.local` y completá:

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Proyecto en [supabase.com](https://supabase.com) → corré `supabase/migrations/0001_init.sql` en el SQL Editor → creá el usuario admin a mano en *Authentication → Users* (la app no tiene pantalla de registro) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cuenta gratuita en [cloudinary.com](https://cloudinary.com), las tres keys están en el dashboard principal |
| `GROQ_API_KEY`, `GROQ_VISION_MODEL` | API key en [console.groq.com](https://console.groq.com); confirmá ahí el nombre del modelo de visión vigente (rotan seguido) |
| `META_ACCESS_TOKEN`, `META_FACEBOOK_PAGE_ID`, `META_INSTAGRAM_ACCOUNT_ID` | App en [developers.facebook.com](https://developers.facebook.com); un solo token de Facebook con permisos `pages_manage_posts` + `instagram_content_publish` alcanza para las dos redes, siempre que la cuenta de Instagram esté vinculada a esa Página |
| `NEXT_PUBLIC_SITE_URL` | La URL pública una vez deployado (para el sitemap, metadata y la imagen de OG) — vacío en local |

Cada integración es independiente: podés cargar solo Supabase y dejar Cloudinary/Groq/Meta en modo demo, por ejemplo.

Otros comandos útiles:

```bash
npm run build   # build de producción
npm run start   # sirve el build de producción
npm run lint    # ESLint
npx tsc --noEmit  # chequeo de tipos
```

## ¿Qué partes interesantes tiene?

- **Modo demo en cada integración:** cada capa externa (`lib/data`, `lib/cloudinary`, `lib/groq`, `lib/meta`) chequea si sus variables de entorno están presentes y si no, cae sola a un comportamiento de muestra — se puede desarrollar y ver la UI completa sin ninguna cuenta creada.
- **Publicación a redes con verificación real:** publicar en Facebook/Instagram no es solo "hacer el POST y confirmar" — después de publicar, el sistema vuelve a consultar la Graph API para confirmar que la publicación realmente quedó visible antes de mostrar éxito, y arma la tarjeta de imagen (1080×1350, marca y texto del producto superpuestos) con `<canvas>` en el navegador antes de subirla.
- **Panel admin sin fricción para una usuaria no técnica:** portada de producto = un botón "Hacer portada" en la miniatura (sin drag-and-drop), orden de ofertas = flechas arriba/abajo, confirmación de publicación mostrando siempre a qué cuenta exacta se va a publicar antes de habilitar el botón (para evitar publicar en la cuenta equivocada).
- **Estadísticas simples de interés real:** cada click en "Consultar por WhatsApp" queda registrado por producto (`product_inquiries`), y el panel admin tiene una vista de qué productos generan más consultas — sin ningún tracker de terceros.
- **Ficha de producto con URL como fuente de verdad:** el modal de producto se abre con `?producto=<id>` en la URL (compartible, funciona con el botón atrás/adelante del navegador) sin hacer un fetch extra, porque el catálogo ya está cargado en memoria.
- **Seguridad por Row Level Security, no por código:** no hay una capa de permisos escrita a mano — las políticas de Postgres en Supabase son las que deciden qué puede leer/escribir cada rol (`anon` vs `authenticated`), y el único usuario admin se crea a mano en el dashboard de Supabase (no hay registro público).
- **Sin precios en ningún lado**, por decisión de negocio: el flujo siempre termina en una conversación por WhatsApp, nunca en una transacción dentro del sitio.

## Estructura del proyecto

```
app/
  (site)/              sitio público — home, catálogo, mi lista, nosotros
  admin/                panel privado — login + productos, ofertas, estadísticas
  api/                  rutas que tocan secretos (firma de Cloudinary, IA de Groq)

components/
  ui/, layout/          componentes base y de layout
  home/, catalog/       componentes específicos del sitio público
  admin/                formularios, tablas y botones de publicación del panel

lib/
  data/                 acceso a datos, con fallback a lib/sample-data.ts sin Supabase
  supabase/             clientes browser/server + guard de sesión admin
  cloudinary/, groq/    integraciones externas, cada una con su propio modo demo
  meta/                 publicación en Facebook/Instagram vía Graph API
  canvas/               generación de la tarjeta de imagen para redes
  validation/           esquemas zod de los formularios del admin

supabase/
  migrations/0001_init.sql   esquema completo (tablas + Row Level Security)

proxy.ts                protege /admin/** verificando la sesión de Supabase
```

## Despliegue

Pensado para desplegarse en [Vercel](https://vercel.com/) conectando el repo directamente: cargá las mismas variables de entorno del paso anterior en el dashboard del proyecto (más `NEXT_PUBLIC_SITE_URL` apuntando al dominio final) y cada push a la rama principal genera un deploy nuevo.

## Créditos

Diseñado y desarrollado por [Tomas Romero](https://www.linkedin.com/in/tomas-agustin-romero/).
