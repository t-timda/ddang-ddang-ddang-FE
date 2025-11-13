type CheckIconProps = React.SVGProps<SVGSVGElement>;

export default function CheckIcon({
  className,
  ...props
}: CheckIconProps) {
  return (
    <svg
      viewBox="0 0 20 15"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <polyline
        points="1.5 7.5 7.5 13.5 18.5 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
