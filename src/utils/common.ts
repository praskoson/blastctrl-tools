export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const zipMap = <T, U, V>(
  left: T[],
  right: U[],
  fn: (t: T, u: U | null, i: number) => V
): V[] => left.map((t: T, index) => fn(t, right?.[index] ?? null, index));

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mimeTypeToCategory = (mimeType: string) => {
  return mimeType.startsWith("image")
    ? "image"
    : mimeType.startsWith("audio")
    ? "audio"
    : mimeType.startsWith("video")
    ? "video"
    : mimeType.startsWith("model")
    ? "vr"
    : mimeType.startsWith("text/html")
    ? "html"
    : mimeType.split("/")[0];
};

export function abbreviatedNumber(value: number, fixed = 1) {
  if (value < 1e3) return value;
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(fixed) + " K";
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(fixed) + " M";
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(fixed) + " G";
  if (value >= 1e12) return +(value / 1e12).toFixed(fixed) + "T";
}
