export interface CustomIconProps {
  isActive?: boolean;
}

function DashboardIcon({ isActive }: CustomIconProps) {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 17V7M7 17V1M1 17V11"
        stroke={isActive ? 'white' : '#1F2A37'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export default DashboardIcon;
