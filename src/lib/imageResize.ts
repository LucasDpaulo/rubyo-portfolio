// Redimensiona uma imagem no cliente (canvas) e devolve base64 webp.
// Só funciona no browser (usa FileReader/Image/canvas) — importar de client components.
export async function resizeToBase64(
  file: File,
  maxSize: number,
): Promise<{ base64: string; mimeType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error("read"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode"));
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-context");
  ctx.drawImage(img, 0, 0, w, h);
  const mimeType = "image/webp";
  const out = canvas.toDataURL(mimeType, 0.88);
  const base64 = out.split(",")[1] ?? "";
  return { base64, mimeType };
}
