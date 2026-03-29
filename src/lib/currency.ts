export function formatJPY(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    currency: "JPY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
