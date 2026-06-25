import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { ClientsSection } from "@/components/public/ClientsSection";
import { VideosGrid } from "@/components/public/VideosGrid";
import { Footer } from "@/components/public/Footer";
import { ContactModal } from "@/components/public/ContactModal";
import { LoginModal } from "@/components/public/LoginModal";
import { EditModal } from "@/components/public/EditModal";
import { AdminModeProvider } from "@/components/public/AdminModeProvider";
import { getHero, getProfile, getVideos, getClients } from "@/lib/content";
import { auth } from "@/lib/auth";

export const revalidate = 30;

export default async function HomePage() {
  const [hero, profile, videos, clients, session] = await Promise.all([
    getHero(),
    getProfile(),
    getVideos(),
    getClients(),
    auth(),
  ]);

  const isAdmin = !!session;

  return (
    <>
      <AdminModeProvider isAdmin={isAdmin} />
      <Nav logo={profile.name} isAdmin={isAdmin} />
      <Hero hero={hero} profile={profile} isAdmin={isAdmin} />
      <VideosGrid
        videos={videos}
        isAdmin={isAdmin}
        socials={profile.socials}
        email={profile.email}
        middleSlot={
          <ClientsSection
            clients={clients.items}
            videos={videos}
            socials={profile.socials}
            email={profile.email}
            isAdmin={isAdmin}
          />
        }
      />
      <Footer profile={profile} />
      <ContactModal profile={profile} />
      <LoginModal />
      {isAdmin && <EditModal />}
    </>
  );
}
