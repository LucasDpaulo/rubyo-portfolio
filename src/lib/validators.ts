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

export const avatarAdjustmentsSchema = z.object({
  brightness: z.number().min(0).max(2).default(1),
  contrast: z.number().min(0).max(2).default(1),
  saturation: z.number().min(0).max(2).default(1),
  hue: z.number().min(-180).max(180).default(0),
  sepia: z.number().min(0).max(1).default(0),
  grayscale: z.number().min(0).max(1).default(0),
  blur: z.number().min(0).max(20).default(0),
  zoom: z.number().min(1).max(4).default(1),
  offsetX: z.number().min(-100).max(100).default(0),
  offsetY: z.number().min(-100).max(100).default(0),
});

export const profileSchema = z.object({
  name: z.string().min(1).max(60),
  role: z.string().max(60),
  socials: z.array(socialSchema).max(8),
  email: z.string().email(),
  avatarUrl: z.string().max(500).optional().default(""),
  avatarUrl2: z.string().max(500).optional().default(""),
  avatarAdjustments: avatarAdjustmentsSchema.optional(),
  footerText: z.string().max(120).optional().default(""),
  footerSize: z.enum(["sm", "md", "lg"]).optional().default("sm"),
  footerBold: z.boolean().optional().default(false),
  footerItalic: z.boolean().optional().default(false),
  iconSize: z.enum(["sm", "md", "lg"]).optional().default("md"),
});

export const clientReviewSchema = z.object({
  logoUrl: z.string().max(500).optional().default(""),
  logoAdjustments: avatarAdjustmentsSchema.optional(),
  name: z.string().max(80).optional().default(""),
  handle: z.string().max(60).optional().default(""),
  verified: z.boolean().optional().default(false),
  description: z.string().max(1000).optional().default(""),
  subscribers: z.string().max(40).optional().default(""),
  videos: z.string().max(40).optional().default(""),
  channelUrl: z.string().max(300).optional().default(""),
  videoIds: z.array(z.string().min(1)).max(100).optional().default([]),
});

export const clientsContentSchema = z.object({
  items: z.array(clientReviewSchema).max(50).default([]),
});

export const uploadRequestSchema = z.object({
  contentType: z.string().regex(/^image\/(png|jpe?g|webp|gif)$/),
  base64: z.string().min(8).max(4_000_000),
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
export type AvatarAdjustments = z.infer<typeof avatarAdjustmentsSchema>;
export type ClientReview = z.infer<typeof clientReviewSchema>;
export type ClientsContent = z.infer<typeof clientsContentSchema>;

export const DEFAULT_AVATAR_ADJUSTMENTS: AvatarAdjustments = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  hue: 0,
  sepia: 0,
  grayscale: 0,
  blur: 0,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};
