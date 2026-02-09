import { useId } from 'react';

export const ObjectiveC = ({ className }: { className: string }) => {
  const aId = useId();

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2500 2500"
    >
      <linearGradient
        id={aId}
        gradientUnits="userSpaceOnUse"
        x1="2001.763"
        y1="-53.03"
        x2="497.728"
        y2="2552.035"
      >
        <stop offset="0" stop-color="#14e8fe" />
        <stop offset="1" stop-color="#1955f1" />
      </linearGradient>
      <path
        d="M553.3 0h1384.8c67.4 0 132.8 10.7 196.3 33.2 91.8 33.2 174.8 91.8 237.3 168 63.5 76.2 105.5 169.9 120.1 267.6 5.9 36.1 6.8 72.3 6.8 108.4v1350.6c0 43-2 86.9-10.7 128.9-19.5 96.7-65.4 187.5-131.8 260.7-65.4 73.2-151.4 127.9-244.1 157.2-56.6 17.6-115.2 25.4-174.8 25.4-26.4 0-1387.7 0-1408.2-1-99.6-4.9-198.2-37.1-281.3-92.8-81.1-54.7-147.5-130.9-190.4-218.8-37.1-75.2-55.7-159.2-55.7-243.2V555.7c-2-83 15.6-165 51.8-239.3 42-87.9 107.4-165 188.5-219.7C324.8 40 422.4 6.8 522 2c9.8-2 20.6-2 31.3-2"
        fill={`url(#${aId})`}
      />
      <text
        transform="translate(205.981 1451.148)"
        fontSize="700"
        fontFamily="OpenSans-Semibold"
        fill="#fff"
      >
        [ObjC]
      </text>
    </svg>
  );
};
