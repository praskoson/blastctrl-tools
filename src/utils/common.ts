export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const zipMap = <T, U, V>(
  left: T[],
  right: U[],
  fn: (t: T, u: U | null, i: number) => V
): V[] => left.map((t: T, index) => fn(t, right?.[index] ?? null, index));

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mimeTypeToCategory = (file: File) => {
  const extension = file.name.split(".")[1];
  const isModel = extension === "glb" || extension === "gltf";
  const type = file.type ? file.type : isModel ? "model/gltf-binary" : "";

  if (type) {
    return type.startsWith("image")
      ? "image"
      : type.startsWith("audio")
      ? "audio"
      : type.startsWith("video")
      ? "video"
      : type.startsWith("model")
      ? "vr"
      : type.startsWith("text/html")
      ? "html"
      : type.split("/")[0];
  } else {
    return "";
  }
};

export const userLocale =
  typeof window !== "undefined"
    ? navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language
    : "en-US";

export const numberFormatter = new Intl.NumberFormat(userLocale, {
  style: "decimal",
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 9,
});

export const formatNumber = {
  format: (val?: number, precision?: number) => {
    if (!val && val !== 0) {
      return "--";
    }

    if (precision !== undefined) {
      return numberFormatter.format(
        Math.round((val + Number.EPSILON) * 10 ** precision) / 10 ** precision
      );
    } else {
      return numberFormatter.format(val);
    }
  },
};

export function abbreviatedNumber(value: number, fixed = 1) {
  if (value < 1e3) return value;
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(fixed) + " K";
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(fixed) + " M";
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(fixed) + " G";
  if (value >= 1e12) return +(value / 1e12).toFixed(fixed) + "T";
}

export function roundTo(number: number, decimals: number) {
  const exp = 10 ** decimals;
  return Math.round((number + Number.EPSILON) * exp) / exp;
}
