import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { VideosGrid } from "@/components/public/VideosGrid";
import { Footer } from "@/components/public/Footer";
import { ContactModal } from "@/components/public/ContactModal";
import { LoginModal } from "@/components/public/LoginModal";
import { EditModal } from "@/components/public/EditModal";
import { AdminModeProvider } from "@/components/public/AdminModeProvider";
import { getHero, getProfile, getVideos } from "@/lib/content";
import { auth } from "@/lib/auth";

export const revalidate = 30;

export default async function HomePage() {
  const [hero, profile, videos, session] = await Promise.all([
    getHero(),
    getProfile(),
    getVideos(),
    auth(),
  ]);

  const isAdmin = !!session;
  const xUrl =
    profile.socials.find((s) => s.icon === "x")?.url || "https://x.com/rubyoroberto";

  return (
    <>
      <AdminModeProvider isAdmin={isAdmin} />
      <Nav logo={profile.name} isAdmin={isAdmin} />
      <Hero hero={hero} profile={profile} isAdmin={isAdmin} />
      <VideosGrid videos={videos} isAdmin={isAdmin} xUrl={xUrl} email={profile.email} />
      <Footer profile={profile} />
      <ContactModal profile={profile} />
      <LoginModal />
      {isAdmin && <EditModal />}
    </>
  );
}
