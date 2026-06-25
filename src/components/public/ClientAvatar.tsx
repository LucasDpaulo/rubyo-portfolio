import { avatarImgStyle } from "@/components/public/Avatar";
import { DEFAULT_AVATAR_ADJUSTMENTS } from "@/lib/validators";
import type { AvatarAdjustments } from "@/lib/validators";

// Ícone circular de um cliente (mesmo modelo do avatar do perfil: enquadramento + color grade).
export function ClientAvatar({
  name,
  logoUrl,
  adjustments,
  size = 72,
}: {
  name: string;
  logoUrl?: string;
  adjustments?: AvatarAdjustments;
  size?: number;
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const adj = adjustments ?? DEFAULT_AVATAR_ADJUSTMENTS;
  return (
    <span className="client-avatar" style={{ width: size, height: size }}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={name} style={avatarImgStyle(adj)} />
      ) : (
        <span className="client-avatar-fallback" style={{ fontSize: Math.round(size * 0.42) }}>
          {initial}
        </span>
      )}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <svg
      className="verified-badge"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-label="Verificado"
      role="img"
    >
      <path
        fill="currentColor"
        d="M12 1l2.6 1.9 3.2-.2 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3.1L2.6 16l1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.2L12 1z"
      />
      <path
        fill="var(--color-bg)"
        d="M10.6 14.6l-2.2-2.2-1.1 1.1 3.3 3.3 6-6-1.1-1.1z"
      />
    </svg>
  );
}
