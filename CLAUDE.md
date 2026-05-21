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

1. **Inline na home** (preferido) — depois de logar, clicar no logo "ROBERTO" do nav abre o modal de login. Logado, aparecem botões ✏️ em cada elemento editável (avatar/foto, nome, título, descrição, vídeo de fundo, social links, cards de vídeo). O botão ✏️ no avatar abre o editor: upload é redimensionado client-side pra 512px webp e gravado direto no Postgres (modelo `MediaAsset`, bytea), servido por `/api/assets/[id]` com cache imutável. Ajuste de zoom/posição, presets de color grade e sliders (brilho/contraste/saturação/matiz/sépia/P&B/desfoque). Cards de vídeo também ganham um botão "+" no header de cada seção (Shorts / Long Form) pra adicionar novos vídeos inline. Long Form tem ainda um toggle grid↔lista pra alternar visual.
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

## Sessão 2026-05-13

- Reset admin Neon prod: `rms.empreendimento@gmail.com` → `roberto@gmail.com` / `editor`. Script `scripts/reset-admin.ts` + `npm run db:reset-admin`
- `neonctl` instalado/autenticado. Projeto Ruby: `org-gentle-pond-43389937` / `shy-cell-56903702`
- CSS: profile-card empilha nome/cargo/social (`display: flex` + `width: fit-content`)
- Avatar simplificado (só inicial em texto, fim da tentativa de `/avatar.jpg`)
- `next/font` com `adjustFontFallback: false` (link direto quebrou hidratação)
- Toggle grid/lista no Long Form
- Botão `+` inline pra adicionar Shorts/Long Form direto da home (`EditPayload.new-video`)

## Sessão 2026-05-14

**Features novas:**
- **Shorts maiores e centralizados** — grid `minmax(240, 280)` + `justify-content: center`
- **Avatar com upload + editor de color grade** — tentamos S3 (`@aws-sdk/*` + presigned PUT) mas trocamos por **Postgres puro**: nova tabela `MediaAsset { id, mimeType, data Bytes }`, servida via `/api/assets/[id]` com `Cache-Control: immutable`. Cliente redimensiona pra 512px webp via canvas antes de enviar base64. Modal tem: zoom, posição X/Y, 7 presets (Quente/Frio/Noir/Vintage/Vívido/Fosco) e sliders brilho/contraste/saturação/matiz/sépia/P&B/desfoque. Adjustments salvos em `profile.avatarAdjustments` (JSON em SiteContent). Avatar renderiza `<img>` com `filter:` CSS aplicado; fallback pra inicial se vazio
- **Dashboard `/admin/stats`** — modelo `Visit { path, fingerprint, country, durationMs }`. Beacon client (`VisitBeacon`) faz POST inicial, rastreia tempo ativo (pausa em `visibilitychange`), envia PATCH com `durationMs` no `pagehide`/`beforeunload` via `fetch keepalive`. Filtra bots por UA regex, ignora `/admin` e `/api`. Dashboard: 4 cards (Total/24h/7d/30d) com visitas+únicos+tempo médio, gráfico SVG de barras dos últimos 30 dias, top 10 páginas (com tempo médio), top 5 países (header `x-vercel-ip-country`). Clamp 1h pra evitar outliers
- **Setas inline pra reordenar vídeos** (admin) — `↑/↓` em Long Form, `‹/›` em Shorts. Novo endpoint `POST /api/admin/videos/swap { aId, bId }` que só troca o `sortOrder` dos dois. Vizinhos calculados por seção
- **Vídeos abrem em modal** — `VideoCard` agora abre `VideoModal` no play (era inline). Backdrop 18% opacity + `backdrop-filter: blur(6px)` (mal aparece), fade 350ms cubic-bezier(0.16,1,0.3,1). Botão X redondo + ESC + click fora pra fechar
- **Botão EXCLUIR no modal de edição de vídeo** — só aparece quando edita projeto existente, `window.confirm` antes do DELETE. Endpoint já existia, faltava o botão

**Migrations aplicadas em prod Neon (via `npm run db:deploy` com `DATABASE_URL` do `neonctl`):**
- `20260514022716_add_media_asset` — CREATE TABLE MediaAsset
- `20260514024723_add_visit` — CREATE TABLE Visit + 3 índices
- `20260514030248_add_visit_duration` — ALTER TABLE Visit ADD COLUMN durationMs INT NULL

**Fontes (idas e voltas):**
- Bebas Neue → Anton → Archivo Black → Bebas → **Archivo Black (final)**
- Só `.hero-content h1` usa Archivo Black, resto continua Bebas
- Lição: quando o usuário cola um snippet CSS, ele pode estar mostrando o que JÁ tem (cole o "antes"), não o que QUER. Confirmar o intent antes de aplicar

**Estado (após parte 1):**
- Último commit: `6a8cfb1` (botão excluir vídeo)
- Stack: deps `@aws-sdk/*` e `react-image-crop` removidas; `lib/s3.ts` deletado

**Fios soltos:**
- Background tasks de alias Vercel travam silenciosamente às vezes — depois de cada deploy, conferir com `vercel inspect rubyo.vercel.app` se aponta pro hash novo. Se não, forçar com `vercel alias set <hash>-lucashs-projects.vercel.app rubyo.vercel.app`
- Stats começa zerado, popula com visitas novas (visitas antigas não retroagem)
- Roberto continua podendo editar conteúdo pelo painel — features novas: trocar foto inline (✏️ no avatar), excluir vídeos, reordenar com setinhas, ver tráfego em `/admin/stats`

## Sessão 2026-05-14 (parte 2)

**Ajustes finos:**
- **Carrossel do avatar** — seta foi pra fora da foto (`right: -42px`), auto-rotate **5s → 30s**, fade **0.6s → 2s** (Avatar.tsx + globals.css). Label do editor atualizado pra "30s"
- **Modal de vídeo centralizado na viewport** — `VideoModal` agora usa `createPortal(..., document.body)`. Sem isso o `transform` do `FadeIn` (Framer Motion) criava containing block e o `position: fixed` se ancorava ao card em vez da tela
- **Botão de lixeira inline em cada card de vídeo** — ícone vermelho ao lado da ✏️, só em `body.admin-mode`, `window.confirm` antes do DELETE. Antes a única opção era abrir o modal de edição
- **Fix: avatar voltou a ser circular** — `.avatar-container` precisava de `position: relative` pra ancorar os `.avatar-photo` absolutos. Sem isso eles ficavam relativos ao `.avatar-stage` e a foto vazava do círculo (parecia quadrada)
- **Hero h1 mais pesado** — `line-height 0.85 → 0.78`, `letter-spacing 1px → -0.05em`, `font-size max 6.5rem → 7.5rem`. Visual "cinematográfico bloco pesado"

**Dev local:**
- `.env` tinha `DATABASE_URL` apontando pra `localhost` (user `roberto`, Docker que não existe). Adicionado `DATABASE_URL` em **`.env.local`** apontando pro Neon prod via `neonctl`
- `.env.local` agora também tem `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL=http://localhost:3001`
- ⚠️ **Atenção**: dev local agora escreve direto no DB de prod. Cuidado ao editar via `/admin` em localhost

**Estado atual:**
- Último commit: `8850b27` (hero h1 pesado)
- Deploys + alias forçados manualmente após cada push (auto-alias da Vercel segue quebrado)
- Site público no ar em https://rubyo.vercel.app

**Fios soltos (parte 2):**
- Se o user quiser tirar a feature "dev local pisa no DB de prod", a saída limpa é: trocar `.env.local` por um branch do Neon (`neonctl branches create`) e apontar o `DATABASE_URL` local pra ele
- `.env` ainda tem URL inválida apontando pra `localhost` com user `roberto` — `.env.local` sobrescreve, mas vale limpar quando der

## Sessão 2026-05-20

**Contatos editáveis inline (CRUD completo + reordenação):**

Antes: `SocialIcons` (cartão de perfil + footer) e `ContactModal` (popup "LET'S TALK") renderizavam X/Discord/Gmail **hardcoded**. O ✏️ "EDITAR LINKS" só expunha o link do X e o email. Discord handle ficava chumbado no código (`"rubyroberto_editor"`).

Agora:
- **`SocialIcons` e `ContactModal` são data-driven** — iteram `profile.socials`. Adicionar/remover/reordenar reflete em todos os lugares automaticamente (cartão do hero, footer, video modal aberto, popup contato).
- **Editor inline "EDITAR LINKS" virou CRUD**: dropdown de ícone (x/discord/email/instagram/youtube/tiktok), label, URL, botão **×** pra remover, **+ ADICIONAR CONTATO** (limite 8 do schema). Email principal continua campo separado no topo.
- **Reordenação por setas ↑/↓** em cada linha (pontas desabilitam). Mesma ordem aparece nos 3 locais públicos.
- **Regras de URL por tipo:**
  - `discord` sem `http://` → copia handle ao clicar + toast
  - `discord` com `http://` → abre normal
  - `email` só endereço → abre Gmail compose (`mail.google.com/mail/?view=cm`)
  - `email` com `http://` ou `mailto:` → usa como tá
  - resto → abre URL em nova aba

**Cadeia de props refatorada** — `Hero/Footer/VideosGrid/VideoCard/VideoModal/page.tsx` passam `socials: SocialLink[]` em vez do antigo `xUrl: string`.

**Fix de UX:**
- Modal de edição cortava em telas menores. Adicionado `max-height: calc(100vh - 30px)` + `overflow-y: auto` só em `.edit-modal-content` (com scrollbar marrom 6px). **Não** mexer no `.modal-content` genérico — popup "LET'S TALK" não tem scroll por design (lista curta)

**Arquivos tocados:**
- `src/components/public/{SocialIcons,ContactModal,EditModal,Hero,Footer,VideoCard,VideoModal,VideosGrid}.tsx`
- `src/app/page.tsx`
- `src/app/globals.css` (scroll no edit-modal)

**Estado atual:**
- Mudanças commitadas em main local, **não pushadas ainda** — user encerrou pra continuar amanhã
- Build limpo (`npx tsc --noEmit` ok, `next build` ok)
- Validação local foi feita pelo user; aguardando aprovação pra push + alias Vercel

**Próximos passos / onde paramos:**
- Amanhã: `git push origin main`, esperar deploy ficar Ready (`vercel ls`), forçar alias com `vercel alias set <hash>-lucashs-projects.vercel.app rubyo.vercel.app`
- Possível polimento se o user pedir: drag-reorder (em vez de só setas), preview ao vivo do contato dentro do modal de edição
