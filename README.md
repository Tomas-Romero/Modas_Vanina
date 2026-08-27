# Modas Vanina

Catálogo online (sin precios) para Modas Vanina — indumentaria, perfumería, cremas, tuppers y varios. Next.js + Tailwind + Framer Motion, Supabase (datos/auth), Cloudinary (fotos) y Groq (descripciones por IA).

## Desarrollo local

```bash
npm install
npm run dev
```

Sin las variables de entorno de abajo, el sitio corre igual en **modo demo**: catálogo y panel admin funcionan con datos de muestra en memoria, subida de fotos usa preview local y la descripción por IA devuelve un texto de ejemplo. Ideal para probar diseño/UX sin depender de las cuentas externas.

## Variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

- **Supabase** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`): creá un proyecto en supabase.com, corré `supabase/migrations/0001_init.sql` en el SQL Editor, y creá el usuario admin a mano en Authentication → Users (no hay pantalla de registro en la app).
- **Cloudinary** (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`): cuenta gratuita en cloudinary.com, las tres keys están en el dashboard principal.
- **Groq** (`GROQ_API_KEY`, `GROQ_VISION_MODEL`): API key en console.groq.com; confirmá ahí el nombre del modelo de visión vigente (rotan seguido) y usalo como `GROQ_VISION_MODEL`.

## Estructura

- `app/(site)/` — sitio público (home, catálogo, mi lista, nosotros)
- `app/admin/` — panel privado (login + `(dashboard)/` con productos y ofertas)
- `lib/data/` — acceso a datos, con fallback automático a `lib/sample-data.ts` sin Supabase
- `lib/cloudinary/`, `lib/groq/` — integraciones externas, cada una con su propio modo demo
- `supabase/migrations/0001_init.sql` — esquema completo (tablas + RLS)
