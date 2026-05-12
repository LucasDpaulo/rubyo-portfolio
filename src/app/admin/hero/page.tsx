import { getHero } from "@/lib/content";
import { HeroEditor } from "@/components/admin/HeroEditor";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const hero = await getHero();
  return <HeroEditor initial={hero} />;
}
