type CircleArrowIconProps = React.SVGProps<SVGSVGElement> & {
  circleFill?: string;
  arrowColor?: string;
};

export default function CircleArrowIcon({
  className,
  circleFill = "#ffffff",
  arrowColor = "#203C77",
  ...props
}: CircleArrowIconProps) {
  return (
    <svg
      viewBox="0 0 35 33"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect width="35" height="32.766" rx="16.383" fill={circleFill} />
      <path
        d="M14.8936 11.1703L20.8511 16.7554L14.8936 22.3405"
        fill="none"
        stroke={arrowColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
