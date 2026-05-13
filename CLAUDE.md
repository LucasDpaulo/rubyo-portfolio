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
| `main` | **Produção** — versão dark marrom/cream/dourado original | https://rubyo.vercel.app | Trabalhar direto aqui (usuário não quer iterar local mais) |
| `dev` | Versão Awwwards light editorial (laranja, hero centralizado) | — | Histórico, não em uso ativo |

**Fluxo atual (2026-05-13 em diante):**

1. Editar direto em `main` → `git push origin main`
2. Vercel deploya automático (mas alias precisa atualizar manual, ver abaixo)
3. **SEMPRE** rodar `vercel alias set <novo-deploy-url> rubyo.vercel.app` após cada deploy — auto-alias está quebrado

⚠️ **NÃO criar previews na Vercel** (aliases tipo `rubyo-dev.vercel.app`). O usuário não gosta — polui a conta.

⚠️ **Alias manual sempre.** Após `git push`, esperar deploy ficar Ready (`vercel ls`) e fazer:
```bash
vercel alias set ruby-<hash>-lucashs-projects.vercel.app rubyo.vercel.app
```
Sem isso, o site público continua mostrando o deploy anterior.

## Comandos

```bash
npm run dev                    # localhost:3000
npm run build                  # build de produção
npm run db:migrate             # prisma migrate dev
npm run db:deploy              # prisma migrate deploy (prod)
npm run db:seed                # popula admin + hero/profile + vídeos
npm run db:reset-admin         # reseta email/senha do admin pra roberto@gmail.com / editor
npm run db:studio              # Prisma Studio
```

⚠️ **Não rodar Docker local** (`docker compose up`). Problemas de prod-só agora — validar tudo direto no Neon via `DATABASE_URL` apontando pra prod.

## Acesso a prod (Neon)

Neon CLI (`neonctl`) instalado e autenticado. Pra pegar a URL ou rodar SQL sem abrir painel:

```bash
# URL unpooled
neon connection-string --project-id shy-cell-56903702 --org-id org-gentle-pond-43389937 --pooled false

# rodar script Prisma contra prod
DATABASE_URL="$(neon connection-string --project-id shy-cell-56903702 --org-id org-gentle-pond-43389937 --pooled false)" npm run <script>
```

## Variáveis de ambiente

- Em **prod (Vercel)** já setadas: `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL=https://rubyo.vercel.app`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD`
- Em **local**: ver `.env.example`. Pra testar com dados reais, apontar `DATABASE_URL` no `.env.local` pro Neon de prod (não precisa subir docker).

## Admin

Login: `roberto@gmail.com` / senha `editor` (trocar pelo painel `/admin/conta`).

**Dois fluxos pra editar conteúdo:**

1. **Inline na home** (preferido) — depois de logar, clicar no logo "ROBERTO" do nav abre o modal de login. Logado, aparecem botões ✏️ em cada elemento editável (nome, título, descrição, vídeo de fundo, social links, cards de vídeo). Cards de vídeo também ganham um botão "+" no header de cada seção (Shorts / Long Form) pra adicionar novos vídeos inline. Long Form tem ainda um toggle grid↔lista pra alternar visual.
2. **Painel `/admin`** — abas: Vídeos (CRUD + drag-reorder), Hero, Perfil, Conta (trocar senha).

Rotas API `/api/admin/*` todas validam `auth()` server-side antes de qualquer query.

## Decisões técnicas tomadas

- **Sem backend Java separado** (pedido original) — Vercel não roda Java, ficou tudo TS num projeto só
- **Vídeos por URL** (YouTube/Vimeo), não upload mp4 — sem custo de storage, sem limite Vercel
- **Prisma 6** (não 7) — Prisma 7 mudou drasticamente API (sem `url` em datasource), 6 é estável
- **Sem `DIRECT_URL`** no schema — usando URL unpooled do Neon como `DATABASE_URL` direto, simplifica
- **Build command na Vercel**: `prisma generate && next build` (migrate roda separado via `npm run db:deploy`)
- **Postgres Neon** integrado pela Vercel (env vars prefixadas `Ruby_*` foram criadas automaticamente, mas usamos `DATABASE_URL` adicionada manualmente apontando pro mesmo DB)
- **Tailwind 4** com `@theme {}` (não `tailwind.config.ts`) — convention nova
- **next/font com `adjustFontFallback: false`** — sem isso, o fallback metric-adjusted (Arial) deixava o ROBERTO do nav perceptivelmente mais "fino" antes do Bebas Neue swap. Desligar evita esse FOUC visual

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

## Última sessão (2026-05-13)

**O que foi feito:**
- Reset do admin no Neon prod: email `rms.empreendimento@gmail.com` → `roberto@gmail.com`, senha `editor`. Script `scripts/reset-admin.ts` + comando `npm run db:reset-admin`
- Instalado + autenticado `neonctl` global. Projeto Ruby: `org-gentle-pond-43389937` / `shy-cell-56903702`
- CSS fix: profile-card empilha nome/cargo/social (`display: flex` + `width: fit-content` em `.editable-wrapper`)
- Avatar simplificado pra sempre mostrar inicial em texto (removida tentativa de carregar `/avatar.jpg` inexistente)
- Voltou pra `next/font` com `adjustFontFallback: false` (tentativa intermediária com `<link>` direto quebrou hidratação)
- Toggle grid/lista no Long Form (botão de ícone no header da seção)
- Botão `+` inline pra admin adicionar Shorts/Long Form direto da home (sem ir no `/admin/videos`). `EditPayload` ganhou variante `new-video`, `EditModal` faz `POST /api/admin/videos`
- Memory + CLAUDE.md atualizados com novo workflow (sem dev local, alias Vercel manual)

**Estado atual:**
- Último commit: `0c803f4` (docs: CLAUDE.md update) — push e deploy feitos
- Alias `rubyo.vercel.app` aponta pro deploy mais recente
- Site funcional: login ok, edição inline + painel `/admin`, adicionar/editar/reordenar vídeos, toggle de layout

**Próximos passos discutidos mas não feitos:**
- Roberto pode/vai editar conteúdo (textos hero, role "EDITOR · 1 ANO" → "CONTENT EDITOR", videos reais, etc) pelo próprio painel
- Nenhuma feature técnica pendente

**Fios soltos:**
- `.gitignore` foi modificado (adicionado `.env*.local`) — está commitado
- Branch `dev` continua com a v1 Awwwards mas não está em uso ativo
