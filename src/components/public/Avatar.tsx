import type { AvatarAdjustments } from "@/lib/validators";
import { DEFAULT_AVATAR_ADJUSTMENTS } from "@/lib/validators";

export function avatarFilter(adj: AvatarAdjustments): string {
  return [
    `brightness(${adj.brightness})`,
    `contrast(${adj.contrast})`,
    `saturate(${adj.saturation})`,
    `hue-rotate(${adj.hue}deg)`,
    `sepia(${adj.sepia})`,
    `grayscale(${adj.grayscale})`,
    `blur(${adj.blur}px)`,
  ].join(" ");
}

export function avatarImgStyle(adj: AvatarAdjustments): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${adj.zoom}) translate(${adj.offsetX}%, ${adj.offsetY}%)`,
    filter: avatarFilter(adj),
  };
}

export function Avatar({
  name,
  imageUrl,
  adjustments,
}: {
  name: string;
  imageUrl?: string;
  adjustments?: AvatarAdjustments;
}) {
  const initial = (name || "R").trim().charAt(0).toUpperCase();
  const adj = adjustments ?? DEFAULT_AVATAR_ADJUSTMENTS;
  return (
    <div className="avatar-container">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} style={avatarImgStyle(adj)} />
      ) : (
        <span className="avatar-text">{initial}</span>
      )}
    </div>
  );
}
