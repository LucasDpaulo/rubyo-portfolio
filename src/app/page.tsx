import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { VideosGrid } from "@/components/public/VideosGrid";
import { About } from "@/components/public/About";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";
import { getHero, getProfile, getVideos } from "@/lib/content";

export const revalidate = 30;

export default async function HomePage() {
  const [hero, profile, videos] = await Promise.all([
    getHero(),
    getProfile(),
    getVideos(),
  ]);

  return (
    <>
      <Nav logo={profile.name} />
      <Hero hero={hero} profile={profile} />
      <VideosGrid videos={videos} />
      <About profile={profile} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </>
  );
}
