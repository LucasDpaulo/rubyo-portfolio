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

  return (
    <>
      <AdminModeProvider isAdmin={isAdmin} />
      <Nav logo={profile.name} isAdmin={isAdmin} />
      <Hero hero={hero} profile={profile} isAdmin={isAdmin} />
      <VideosGrid videos={videos} isAdmin={isAdmin} socials={profile.socials} email={profile.email} />
      <Footer profile={profile} />
      <ContactModal profile={profile} />
      <LoginModal />
      {isAdmin && <EditModal />}
    </>
  );
}
