export default function Skeleton({ h = 16, w = "100%", className = "" }) {
  return <div className={`fin-skeleton ${className}`} style={{ height: h, width: w }} />;
}
