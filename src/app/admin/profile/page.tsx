import { getProfile } from "@/lib/content";
import { ProfileEditor } from "@/components/admin/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();
  return <ProfileEditor initial={profile} />;
}
