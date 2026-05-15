import logo from "../assets/metricbrief-logo.png";

export function BrandLogo({
  width = 176,
  className = "",
}: {
  width?: number;
  className?: string;
}) {
  return (
    <img
      src={logo}
      alt="MetricBrief"
      width={width}
      className={className}
    />
  );
}
