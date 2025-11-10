type ChevronUpIconProps = React.SVGProps<SVGSVGElement>;
export default function ChevronUpIcon({
  className,
  ...props
}: ChevronUpIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <polyline
        points="6 15 12 9 18 15"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}