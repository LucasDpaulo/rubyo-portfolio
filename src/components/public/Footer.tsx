import type { ProfileContent } from "@/lib/validators";
import { SocialIcons } from "@/components/public/SocialIcons";
import { Reveal } from "@/components/transitions/Reveal";

export function Footer({ profile }: { profile: ProfileContent }) {
  const year = new Date().getFullYear();
  const xUrl =
    profile.socials.find((s) => s.icon === "x")?.url || "https://x.com/rubyoroberto";
  const role = (profile.role || "Content Editor").toUpperCase();

  return (
    <footer id="contact" className="site-footer">
      <Reveal>
        <SocialIcons variant="footer" xUrl={xUrl} email={profile.email} />
        <p className="footer-text">
          © {year} · {profile.name.toUpperCase()} · {role}
        </p>
      </Reveal>
    </footer>
  );
}
