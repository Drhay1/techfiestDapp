interface HackathonIconProps {
  isActive?: boolean;
}

function HackathonIcon({ isActive }: HackathonIconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12.9999L4.57465 19.2985C4.61893 19.4756 4.64107 19.5642 4.66727 19.6415C4.92317 20.397 5.60352 20.9282 6.39852 20.9933C6.4799 20.9999 6.5712 20.9999 6.75379 20.9999C6.98244 20.9999 7.09677 20.9999 7.19308 20.9906C8.145 20.8982 8.89834 20.1449 8.99066 19.193C9 19.0967 9 18.9823 9 18.7537V4.49991M17.5 12.4999C19.433 12.4999 21 10.9329 21 8.99991C21 7.06691 19.433 5.49991 17.5 5.49991M9.25 4.49991H5.5C3.01472 4.49991 0.999998 6.51463 1 8.99991C1 11.4852 3.01472 13.4999 5.5 13.4999H9.25C11.0164 13.4999 13.1772 14.4468 14.8443 15.3556C15.8168 15.8857 16.3031 16.1508 16.6216 16.1118C16.9169 16.0756 17.1402 15.943 17.3133 15.701C17.5 15.4401 17.5 14.9179 17.5 13.8736V4.1262C17.5 3.08191 17.5 2.55976 17.3133 2.2988C17.1402 2.05681 16.9169 1.92421 16.6216 1.88804C16.3031 1.84903 15.8168 2.11411 14.8443 2.64427C13.1772 3.55302 11.0164 4.49991 9.25 4.49991Z"
        stroke={isActive ? 'white' : '#1F2A37'}
        // stroke="#1D2939"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HackathonIcon;
