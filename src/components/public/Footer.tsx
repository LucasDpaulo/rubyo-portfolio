import type { ProfileContent } from "@/lib/validators";
import { SocialIcons } from "@/components/public/SocialIcons";
import { EditButton } from "@/components/public/EditButton";

export function Footer({
  profile,
  isAdmin = false,
}: {
  profile: ProfileContent;
  isAdmin?: boolean;
}) {
  const year = new Date().getFullYear();
  const role = (profile.role || "Content Editor").toUpperCase();
  const text =
    profile.footerText && profile.footerText.trim()
      ? profile.footerText
      : `© ${year} · ${profile.name.toUpperCase()} · ${role}`;

  // Sem Reveal aqui de propósito: é o último elemento da página e não consegue
  // chegar à zona de gatilho (~60% da tela), então ficaria invisível.
  return (
    <footer id="contact" className="site-footer">
      <SocialIcons variant="footer" socials={profile.socials} email={profile.email} />
      <div className="editable-wrapper footer-edit-wrap">
        <p className="footer-text">{text}</p>
        {isAdmin && <EditButton payload={{ type: "footer", profile }} label="Editar rodapé" />}
      </div>
    </footer>
  );
}
