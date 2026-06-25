import { Reveal } from "@/components/transitions/Reveal";
import { EditButton } from "@/components/public/EditButton";
import { ClientsCarousel } from "@/components/public/ClientsCarousel";
import type { ClientReview, SocialLink } from "@/lib/validators";
import type { Video } from "@prisma/client";

export function ClientsSection({
  clients,
  videos,
  socials,
  email,
  isAdmin = false,
}: {
  clients: ClientReview[];
  videos: Video[];
  socials: SocialLink[];
  email: string;
  isAdmin?: boolean;
}) {
  if (clients.length === 0 && !isAdmin) return null;

  return (
    <section id="clients" className="clients">
      <Reveal>
        <div className="section-header">
          <span className="section-label">Clientes</span>
          {isAdmin && (
            <div className="section-actions">
              <EditButton payload={{ type: "clients", clients, videos }} label="Editar clientes" />
            </div>
          )}
        </div>

        {clients.length > 0 ? (
          <ClientsCarousel clients={clients} videos={videos} socials={socials} email={email} />
        ) : (
          isAdmin && (
            <p className="clients-empty">
              Nenhum cliente ainda. Clique no ✏️ acima para adicionar canais (logo circular,
              inscritos, descrição) e marcar os vídeos feitos pra cada um.
            </p>
          )
        )}
      </Reveal>
    </section>
  );
}
