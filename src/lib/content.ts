import { prisma } from "@/lib/db";
import type { HeroContent, ProfileContent } from "@/lib/validators";

export const DEFAULT_HERO: HeroContent = {
  titleLine1: "EDITOR",
  titleLine2: "DE VÍDEO",
  titleLine3: "& CONTEÚDO",
  description:
    "Especialista em criação de conteúdo para YouTube, Reels e TikTok. Do corte à colorização — foco total no resultado.",
  bgVideoId: "",
};

export const DEFAULT_PROFILE: ProfileContent = {
  name: "ROBERTO",
  role: "Editor · 1 ano",
  email: "roberto@gmail.com",
  socials: [
    { label: "@rubyoroberto", url: "https://x.com/rubyoroberto", icon: "x" },
    { label: "Discord", url: "#", icon: "discord" },
    { label: "roberto@gmail.com", url: "mailto:roberto@gmail.com", icon: "email" },
  ],
};

export async function getHero(): Promise<HeroContent> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: "hero" } });
    return (row?.value as HeroContent | undefined) ?? DEFAULT_HERO;
  } catch {
    return DEFAULT_HERO;
  }
}

export async function getProfile(): Promise<ProfileContent> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { key: "profile" } });
    return (row?.value as ProfileContent | undefined) ?? DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function getVideos() {
  try {
    return await prisma.video.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}
