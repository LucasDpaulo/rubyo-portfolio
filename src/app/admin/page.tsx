import Link from "next/link";
import { AnalyticsModal } from "@/components/admin/AnalyticsModal";

export default function AdminHome() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 font-display text-3xl tracking-[2px] text-white">
        BEM-VINDO
      </h1>
      <p className="mb-6 text-sm text-dim">
        Use as abas acima para editar o conteúdo do site.
      </p>

      <div className="mb-8">
        <AnalyticsModal />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          href="/admin/videos"
          title="Vídeos"
          desc="Adicionar, editar, reordenar e remover trabalhos"
        />
        <Card
          href="/admin/hero"
          title="Hero"
          desc="Editar título e descrição da home"
        />
        <Card
          href="/admin/profile"
          title="Perfil"
          desc="Nome, função, redes sociais e contato"
        />
        <Card
          href="/admin/conta"
          title="Conta"
          desc="Trocar senha do login admin"
        />
      </div>
    </div>
  );
}

function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block rounded border border-accent/15 bg-brown/40 p-5 transition-colors hover:border-accent"
    >
      <div className="mb-1 font-display text-lg tracking-[2px] text-white">
        {title}
      </div>
      <div className="text-xs leading-relaxed text-dim">{desc}</div>
    </Link>
  );
}
