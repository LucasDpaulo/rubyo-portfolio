@AGENTS.md

# Portfolio Roberto — guia rápido

Site de portfólio para Roberto (editor de vídeo) com painel admin para ele mesmo gerenciar conteúdo.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind 4** (`@theme` em `globals.css`)
- **Prisma 6** + **PostgreSQL** (Neon na Vercel)
- **Auth.js v5** (Credentials + bcrypt, sessão JWT em cookie httpOnly)
- **Framer Motion** (fade in/out, transições)
- **dnd-kit** (drag-reorder de vídeos no admin)
- **Zod** (validação de payloads)

## Estrutura

```
src/
├── app/
│   ├── page.tsx                 # home pública (server component, lê do DB)
│   ├── layout.tsx               # fontes + html
│   ├── globals.css              # tokens Tailwind 4 via @theme
│   ├── admin/                   # painel protegido (login + abas)
│   └── api/
│       ├── auth/[...nextauth]/  # NextAuth handlers
│       └── admin/               # CRUD vídeos, hero, profile, password
├── components/
│   ├── public/                  # Nav, Hero, VideosGrid, VideoCard, About, Contact, Footer
│   ├── admin/                   # VideosManager, HeroEditor, ProfileEditor, AdminShell, ChangePasswordForm
│   └── transitions/             # FadeIn, PageTransition (Framer Motion)
├── lib/
│   ├── auth.ts                  # NextAuth config (Credentials)
│   ├── db.ts                    # Prisma singleton
│   ├── content.ts               # getHero/getProfile/getVideos com fallback de defaults
│   ├── validators.ts            # schemas Zod (video, hero, profile, login, changePassword)
│   └── youtube.ts               # parser de URL YouTube/Vimeo
└── proxy.ts                     # antigo middleware.ts (Next 16 renomeou pra proxy)
prisma/
├── schema.prisma                # User, Video, SiteContent
├── migrations/                  # já aplicadas em prod
└── seed.ts                      # admin + hero/profile defaults + 5 vídeos placeholder
reference/
└── portfolio_roberto_v3.html    # design original (não usar como código, só referência visual histórica)
```

## Branches & ambientes

| Branch | Estado atual | URL | Quando atualizar |
|---|---|---|---|
| `main` | **Produção** — versão dark marrom/cream/dourado original | https://rubyo.vercel.app | Só após aprovação visual local |
| `dev` | Versão Awwwards light editorial (laranja, hero centralizado) | — (rodar local) | Sandbox de iteração visual |

**Fluxo de trabalho preferido pelo usuário:**

1. `git checkout dev` → mudanças → `npm run dev` → revisar em `localhost:3000`
2. Iterar até aprovar visualmente
3. `git checkout main && git merge dev && git push origin main`
4. Vercel deploya automático em `rubyo.vercel.app`

⚠️ **NÃO criar previews na Vercel** (aliases tipo `rubyo-dev.vercel.app`). O usuário não gosta — polui a conta. Sempre iterar local.

## Comandos

```bash
npm run dev              # localhost:3000
npm run build            # build de produção
npm run db:migrate       # prisma migrate dev
npm run db:deploy        # prisma migrate deploy (prod)
npm run db:seed          # popula admin + hero/profile + vídeos
npm run db:studio        # Prisma Studio
docker compose up -d     # Postgres local em :5432
```

## Variáveis de ambiente

- Em **prod (Vercel)** já setadas: `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL=https://rubyo.vercel.app`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`
- Em **local**: ver `.env.example`. Pra testar com dados reais, apontar `DATABASE_URL` no `.env.local` pro Neon de prod (não precisa subir docker).

## Admin

- Login: `https://rubyo.vercel.app/admin/login` (email `rms.empreendimento@gmail.com`, senha trocada pelo painel `/admin/conta`)
- Abas: Vídeos (CRUD + drag-reorder), Hero, Perfil, Conta (trocar senha)
- Rotas API `/api/admin/*` todas validam `auth()` server-side antes de qualquer query

## Decisões técnicas tomadas

- **Sem backend Java separado** (pedido original) — Vercel não roda Java, ficou tudo TS num projeto só
- **Vídeos por URL** (YouTube/Vimeo), não upload mp4 — sem custo de storage, sem limite Vercel
- **Prisma 6** (não 7) — Prisma 7 mudou drasticamente API (sem `url` em datasource), 6 é estável
- **Sem `DIRECT_URL`** no schema — usando URL unpooled do Neon como `DATABASE_URL` direto, simplifica
- **Build command na Vercel**: `prisma generate && next build` (migrate roda separado via `npm run db:deploy`)
- **Postgres Neon** integrado pela Vercel (env vars prefixadas `Ruby_*` foram criadas automaticamente, mas usamos `DATABASE_URL` adicionada manualmente apontando pro mesmo DB)
- **Tailwind 4** com `@theme {}` (não `tailwind.config.ts`) — convention nova

## Histórico de design (resumo)

- v0 (commit `a7728c5`, em main): dark editorial — paleta marrom #0D0A08/cream/accent dourado #C4956A, Bebas Neue + DM Sans, hero com avatar à esquerda + título à direita (200px+1fr)
- v1 (commit `d8e61ae`, na dev): redesign Awwwards light — bg #F8F8F8, accent laranja #FA5D29, Bebas + Inter Tight, hero centralizado, sections About e Contact dark
- v2/v3 (revertidos): tentativa "Raw Rhythm" do Gemini (preto + laranja gigante com cursor timecode, fonts Syne) — usuário rejeitou totalmente
- **Estado atual na dev**: v1 (Awwwards light), aguardando refinamento ou substituição

## Refs visuais que o usuário gostou

- **Awwwards.com** (referência inicial) — estilo editorial, headlines grandes, cards com hover overlay, dotted dividers

## O que evitar

- Não criar deploys de preview Vercel (alias dev) — iterar local
- Não inventar nova direção visual sem confirmar — refinar a existente
- Não comitar `.env*` (já no .gitignore, mas vale o lembrete)
- Não usar credenciais em chat/logs — usuário já colou credenciais Neon expostas; rotacionar se precisar
