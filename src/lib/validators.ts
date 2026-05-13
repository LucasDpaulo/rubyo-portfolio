import { z } from "zod";

export const videoCreateSchema = z.object({
  title: z.string().min(1).max(120),
  url: z.string().url(),
  aspectRatio: z.enum(["16:9", "9:16"]).default("16:9"),
  tag: z.string().max(40).optional().nullable(),
});

export const videoUpdateSchema = videoCreateSchema.partial();

export const videoReorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const heroSchema = z.object({
  titleLine1: z.string().max(40),
  titleLine2: z.string().max(40),
  titleLine3: z.string().max(40),
  description: z.string().max(400),
  bgVideoId: z.string().max(40).optional().default(""),
});

export const socialSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().min(1),
  icon: z.enum(["x", "discord", "email", "instagram", "youtube", "tiktok"]),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(60),
  role: z.string().max(60),
  socials: z.array(socialSchema).max(8),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().min(1).max(120),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export type HeroContent = z.infer<typeof heroSchema>;
export type ProfileContent = z.infer<typeof profileSchema>;
export type SocialLink = z.infer<typeof socialSchema>;
