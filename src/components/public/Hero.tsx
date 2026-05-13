import type { HeroContent, ProfileContent } from "@/lib/validators";
import { SocialIcons } from "@/components/public/SocialIcons";
import { Avatar } from "@/components/public/Avatar";
import { EditButton } from "@/components/public/EditButton";

export function Hero({
  hero,
  profile,
  isAdmin = false,
}: {
  hero: HeroContent;
  profile: ProfileContent;
  isAdmin?: boolean;
}) {
  const line1 = hero.titleLine1 || profile.name || "ROBERTO";
  const line2 = (hero.titleLine2 || "EDITOR").replace(/\.$/, "");
  const bgId = (hero.bgVideoId ?? "").trim();
  const xUrl =
    profile.socials.find((s) => s.icon === "x")?.url || "https://x.com/rubyoroberto";

  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        {bgId && (
          <iframe
            className="hero-video"
            src={`https://www.youtube.com/embed/${bgId}?autoplay=1&mute=1&loop=1&playlist=${bgId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
            title="Vídeo de fundo"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
      <div className="hero-overlay" />

      {isAdmin && (
        <div className="hero-bg-edit">
          <EditButton payload={{ type: "bg", hero }} label="Editar vídeo de fundo" />
        </div>
      )}

      <div className="hero-container">
        <div className="profile-card">
          <Avatar name={profile.name} />

          <div className="editable-wrapper">
            <h2 className="p-name">{profile.name}</h2>
            {isAdmin && (
              <EditButton payload={{ type: "name", profile }} label="Editar nome" />
            )}
          </div>

          <div className="editable-wrapper">
            <p className="p-role">{profile.role || "Content Editor"}</p>
            {isAdmin && (
              <EditButton payload={{ type: "role", profile }} label="Editar cargo" />
            )}
          </div>

          <div className="editable-wrapper">
            <SocialIcons xUrl={xUrl} email={profile.email} />
            {isAdmin && (
              <EditButton payload={{ type: "socials", profile }} label="Editar links" />
            )}
          </div>
        </div>

        <div className="hero-content">
          <div className="editable-wrapper">
            <h1 id="main-hero-title">
              {line1}
              <br />
              <span>{line2}.</span>
            </h1>
            {isAdmin && (
              <EditButton payload={{ type: "titles", hero }} label="Editar títulos" />
            )}
          </div>

          <div className="editable-wrapper">
            <p>{hero.description}</p>
            {isAdmin && (
              <EditButton payload={{ type: "desc", hero }} label="Editar descrição" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
