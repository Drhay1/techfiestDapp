interface TransactionsIconProps {
  isActive?: boolean;
}

function TransactionsIcon({ isActive }: TransactionsIconProps) {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C12 4.10457 9.53757 5 6.5 5C3.46243 5 1 4.10457 1 3M12 3C12 1.89543 9.53757 1 6.5 1C3.46243 1 1 1.89543 1 3M12 3V7.45715C10.7785 7.82398 10 8.37893 10 9M1 3V15C1 16.1046 3.46243 17 6.5 17C7.82963 17 9.04906 16.8284 10 16.5429V9M1 7C1 8.10457 3.46243 9 6.5 9C7.82963 9 9.04906 8.82843 10 8.54285M1 11C1 12.1046 3.46243 13 6.5 13C7.82963 13 9.04906 12.8284 10 12.5429M21 9C21 10.1046 18.5376 11 15.5 11C12.4624 11 10 10.1046 10 9M21 9C21 7.89543 18.5376 7 15.5 7C12.4624 7 10 7.89543 10 9M21 9V17C21 18.1046 18.5376 19 15.5 19C12.4624 19 10 18.1046 10 17V9M21 13C21 14.1046 18.5376 15 15.5 15C12.4624 15 10 14.1046 10 13"
        stroke={isActive ? 'white' : '#1F2A37'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default TransactionsIcon;
