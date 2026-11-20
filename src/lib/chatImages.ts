// Chat photos are shrunk in the browser before they are uploaded: the hub keeps
// them in its database, where a full-size phone photo would not fit, and a
// smaller file keeps the chat light on classroom connections.
export const CHAT_IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
// Must match the worker's upload limit.
const MAX_UPLOAD_BYTES = 500 * 1024;
const MAX_EDGE = 1080;

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That photo could not be read."));
    };
    image.src = url;
  });
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the element loader for formats the browser cannot decode directly.
    }
  }
  return loadImageElement(file);
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function prepareChatImage(file: File): Promise<Blob> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Pick a PNG, JPG, WebP or GIF photo.");
  }
  // Small files go up untouched, which keeps transparent PNGs and GIFs intact.
  if (file.size <= MAX_UPLOAD_BYTES) return file;
  if (file.type === "image/gif") {
    throw new Error("That GIF is too large — keep it under 500 KB.");
  }

  const source = await loadImage(file);
  if (!source.width || !source.height) throw new Error("That photo could not be read.");

  const scale = Math.min(1, MAX_EDGE / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("That photo could not be read.");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  for (const quality of [0.82, 0.7, 0.58, 0.45]) {
    const blob = await encode(canvas, quality);
    if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob;
  }
  throw new Error("That photo is still too large — try a smaller one.");
}
