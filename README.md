# Portfólio Roberto · Editor de Vídeo

Site de portfólio com painel admin para gerenciar vídeos, hero e dados de perfil.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma · PostgreSQL · Auth.js (NextAuth v5) · Framer Motion.

## Rodando localmente

### 1. Pré-requisitos
- Node.js 20+
- Docker (para Postgres local) — ou Postgres rodando em outro lugar

### 2. Instalar dependências
```bash
npm install
```

### 3. Subir o Postgres local
```bash
docker compose up -d
```
Isso cria um Postgres em `localhost:5432` com user/pass/db `roberto`.

### 4. Variáveis de ambiente
Copie o exemplo e ajuste se quiser:
```bash
cp .env.example .env.local
```
Para produção, gere um secret forte:
```bash
openssl rand -base64 32
```
e coloque em `NEXTAUTH_SECRET` / `AUTH_SECRET`.

### 5. Migrar e popular o banco
```bash
npm run db:migrate    # cria as tabelas
npm run db:seed       # cria admin + conteúdo inicial
```
Login criado pelo seed: `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` do `.env.local`.

### 6. Rodar o dev server
```bash
npm run dev
```
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Deploy na Vercel

1. **Subir o código** para um repositório Git (GitHub/GitLab).
2. **Importar na Vercel**: https://vercel.com/new → seleciona o repo.
3. **Adicionar Postgres**: no projeto Vercel → tab _Storage_ → _Create Database_ → _Neon_ (Postgres). Isso preenche `DATABASE_URL` e `DIRECT_URL` automaticamente.
4. **Adicionar env vars**:
   - `NEXTAUTH_SECRET` → `openssl rand -base64 32`
   - `AUTH_SECRET` → mesmo valor acima
   - `NEXTAUTH_URL` → URL do site na Vercel (ex: `https://roberto.vercel.app`)
   - `ADMIN_EMAIL` → seu email
   - `ADMIN_INITIAL_PASSWORD` → senha forte (usada só uma vez pelo seed)
5. **Build command** na Vercel (Settings → Build & Development):
   ```
   prisma migrate deploy && next build
   ```
6. **Primeiro deploy** vai aplicar as migrations. Para rodar o seed na primeira vez, abra um terminal Vercel e execute:
   ```
   npm run db:seed
   ```
   Ou rode localmente apontando para o DB de produção via `DATABASE_URL`.

## Estrutura

```
src/
├── app/
│   ├── page.tsx              # Home pública
│   ├── admin/                # Painel protegido
│   └── api/
│       ├── auth/             # NextAuth handlers
│       └── admin/            # Rotas protegidas (videos, hero, profile)
├── components/
│   ├── public/               # Nav, Hero, VideosGrid, etc.
│   ├── admin/                # Editors + drag-and-drop
│   └── transitions/          # FadeIn + PageTransition
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── db.ts                 # Prisma singleton
│   ├── validators.ts         # Schemas Zod
│   ├── youtube.ts            # Parser YouTube/Vimeo
│   └── content.ts            # Helpers de leitura do conteúdo
└── middleware.ts             # Guard /admin/*
prisma/
├── schema.prisma
└── seed.ts
reference/
└── portfolio_roberto_v3.html # design original (referência visual)
```

## Segurança

- Senhas em `bcrypt` (cost 12).
- Sessão JWT em cookie `httpOnly` + `secure` + `sameSite=lax`.
- Middleware protege `/admin/*`.
- Todas as rotas `/api/admin/*` validam sessão server-side.
- Payloads validados com Zod (URLs precisam ser YouTube/Vimeo válidas).
- Headers de segurança em `next.config.ts`.

## Próximos passos sugeridos

- Rate limit no login (Upstash) contra brute force.
- Página `/admin/account` para Roberto trocar a senha.
- CDN cache do conteúdo via `revalidateTag` ao salvar admin.
