export const LanguageSwitcherIcon = ({ isBooped }: { isBooped: boolean }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        className={
          (isBooped ? 'scale-70' : '') +
          ' ease-spring-boop origin-[6px_6px] transition-transform duration-1000'
        }
      >
        <path
          d="m 5 8
               6 6"
        />
        <path
          d="m 4 14
                 6 -6
                 2 -3"
        />
        <path
          d="M 2 5
               h 12"
        />
        <path
          d="M 7 2
               h 1"
        />
      </g>

      <g
        className={
          (isBooped ? 'scale-70' : '') +
          ' ease-spring-boop origin-[18px_18px] transition-transform delay-100 duration-1100'
        }
      >
        <path d="m22 22-5-10-5 10" />
        <path d="M14 18h6" />
      </g>
    </svg>
  );
};
