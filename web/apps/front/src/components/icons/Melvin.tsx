'use client';
import { motion } from 'motion/react';
import { useEffect, useId, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';
import {
  BobaCoordinate,
  bobaMaxAnimationDuration,
  defaultBobaCoordinates,
  generateBalls,
  roundOdd,
  updateBallAt,
} from '#utils/boba.ts';

const bobaSoftShakeDuration = 400;

const generateBobaCoordinates = () => {
  return generateBalls();
};

export const Melvin = ({ className }: { className: string }) => {
  const [isAnimationStopping, setIsAnimationStopping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bobaCoordinates, setBobaCoordinates] = useState<BobaCoordinate[]>([
    ...defaultBobaCoordinates,
  ]);
  const strawMaskId = useId();
  const reducedMotion = usePrefersReducedMotion();

  if (bobaCoordinates.length !== defaultBobaCoordinates.length) {
    throw new Error('The amount of coordinates must be static');
  }

  for (const [i, boba] of bobaCoordinates.entries()) {
    // This is inside the loop on purpose to capture each boba correctly
    // This is weird and unconventional, but as long as we make sure
    // to keep the amount of boba static and in order, it's ok.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!isAnimating) {
        return;
      }

      const interval = setInterval(() => {
        setBobaCoordinates(coordinates => {
          const updatedCoordinates = [...coordinates];
          updateBallAt(i, updatedCoordinates);
          return updatedCoordinates;
        });
      }, boba.durationMs);
      return () => {
        clearInterval(interval);
      };
    }, [isAnimating, boba, i]);
  }

  useEffect(() => {
    if (!isAnimationStopping) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsAnimationStopping(false);
    }, bobaMaxAnimationDuration);

    return () => {
      clearTimeout(timeout);
    };
  }, [isAnimationStopping]);

  return (
    <svg
      className={twMerge(
        (isAnimating ? `motion-safe:animate-shake ` : ` `) + className,
      )}
      width="1684"
      height="2532"
      viewBox="0 0 1684 2532"
      fill="none"
      onClick={() => {
        if (reducedMotion) {
          return;
        }

        if (isAnimating) {
          setBobaCoordinates([...defaultBobaCoordinates]);
          setIsAnimationStopping(true);
        } else {
          setBobaCoordinates(generateBobaCoordinates());
        }

        setIsAnimating(!isAnimating);
      }}
    >
      <defs>
        {/*
          This is the actual straw, that we use as mask for the lid
          So we can hide the part of the lid that is behind the straw
         */}
        <mask id={strawMaskId}>
          <rect width="1684" height="2532" fill="white" />
          <path
            d="M 680.016 104.739
            L 956.016 825.451
            C 964.516 890.451 766.516 904.451 745.016 858.24
            L 479.516 169.739
            C 473.3 134.037 473.018 73.7374 547.018 47.9552
            C 621.018 22.1729 662.172 68.658 680.016 104.739Z"
            stroke="currentColor"
            strokeLinecap="round"
            fill="black"
          />
        </mask>
      </defs>

      {/* Left Eye */}
      <path
        d="M 591.445 1493.95
          C 634.803 1493.95 669.945 1528.88 669.945 1571.95
          C 669.945 1615.03 634.803 1649.95 591.445 1649.95
          C 548.088 1649.95 512.945 1615.03 512.945 1571.95
          C 512.945 1528.88 548.088 1493.95 591.445 1493.95
          Z"
        className="fill-accent"
      />

      {/* Right Eye */}
      <path
        d="M1075.45 1493.95
        C 1118.8 1493.95 1153.95 1528.88 1153.95 1571.95
        C 1153.95 1615.03 1118.8 1649.95 1075.45 1649.95
        C 1032.09 1649.95 996.945 1615.03 996.945 1571.95
        C 996.945 1528.88 1032.09 1493.95 1075.45 1493.95Z"
        className="fill-accent"
      />

      {/* Mouth */}

      <motion.path
        initial={false}
        strokeWidth="81"
        strokeLinecap="round"
        className={`stroke-accent`}
        transition={{ ease: 'easeInOut', duration: 0.2, delay: 0 }}
        animate={{
          d: isAnimating
            ? `
              M 739.109 1718.45
              C 784.109 1793.45 891.109 1794.95 940.109 1718.45
              M 739.109 1718.45
              L 940.109 1718.45
            `
            : `
              M 759.109 1718.45
              C 784.109 1773.45 891.109 1774.95 920.109 1718.45
              M 840 1760
              L 840 1760
            `,
        }}
      />

      {/* Bobas */}
      {bobaCoordinates.map((boba, index) => (
        <circle
          // It's important to use the index as key here
          // to make sure that updating the coordinates
          // doesn't create a brand new elements.
          // Otherwise the animation won't work.
          key={index}
          cx={boba.x}
          cy={boba.y}
          r="65.5"
          fill="currentColor"
          style={
            {
              '--boba-moving-duration': `${boba.durationMs.toString()}ms`,
              '--boba-soft-shake-duration': `${bobaSoftShakeDuration.toString()}ms`,
              '--boba-soft-shake-offset': `${(boba.shakeOffset ?? 30)?.toString()}px`,
              '--boba-soft-shake-iterations': roundOdd(
                boba.durationMs / bobaSoftShakeDuration,
              ),
            } as React.CSSProperties
          }
          className={
            (isAnimating
              ? `motion-safe:animate-boba-hard-shake`
              : isAnimationStopping
                ? `boba-soft-shake`
                : '') + ' boba-animation'
          }
        />
      ))}

      {/* Cup Body */}
      <path
        d="M 1576.7 984.002
          C 1599.07 984.388 1616.88 1002.83 1616.5 1025.2
          C 1613.13 1220.09 1590.91 1510.68 1552.13 1773.22
          C 1532.74 1904.48 1509.08 2029.63 1481.29 2132.71
          C 1454.84 2230.86 1423.04 2315.55 1383.51 2364.49
          C 1378.1 2374.5 1370.57 2383.34 1362.91 2390.85
          C 1353.25 2400.31 1341.3 2409.68 1327.56 2418.76
          C 1300.05 2436.93 1263.22 2455.38 1217.92 2471.9
          C 1127.15 2505 999.961 2531.29 839.819 2531.29
          C 837.622 2531.29 835.466 2531.11 833.364 2530.77
          C 676.109 2530.11 551.008 2504.08 461.409 2471.4
          C 416.108 2454.88 379.28 2436.43 351.769 2418.26
          C 338.027 2409.18 326.074 2399.81 316.42 2390.35
          C 308.752 2382.83 301.229 2374 295.811 2363.99
          C 256.22 2314.95 225.08 2230.49 199.545 2132.86
          C 172.721 2030.29 150.347 1905.87 132.238 1775.37
          C 96.0102 1514.31 76.3663 1225.33 73.0062 1030.7
          C 72.6201 1008.33 90.437 989.888 112.801 989.502
          C 135.165 989.116 153.608 1006.93 153.994 1029.3
          C 157.301 1220.83 176.71 1506.55 212.469 1764.24
          C 230.353 1893.11 252.205 2014.08 277.909 2112.36
          C 304.183 2212.82 332.832 2282.66 360.831 2315.52
          L 364.843 2320.22
          L 367.158 2325.65
          C 367.094 2325.47 368.345 2327.82 373.111 2332.49
          C 378.186 2337.47 385.82 2343.67 396.422 2350.68
          C 417.6 2364.67 448.495 2380.47 489.162 2395.3
          C 570.335 2424.9 688.06 2449.79 839.508 2449.79
          C 841.645 2449.79 843.742 2449.95 845.789 2450.27
          C 994.363 2449.63 1110.06 2425.01 1190.16 2395.8
          C 1230.83 2380.97 1261.73 2365.17 1282.9 2351.18
          C 1293.51 2344.17 1301.14 2337.97 1306.22 2332.99
          C 1310.98 2328.32 1312.23 2325.96 1312.17 2326.15
          L 1314.48 2320.72L1318.5 2316.02
          C 1346.6 2283.04 1375.85 2212.68 1403.09 2111.63
          C 1429.74 2012.75 1452.85 1891 1472 1761.39
          C 1510.29 1502.17 1532.21 1215.07 1535.51 1023.8
          C 1535.89 1001.43 1554.34 983.616 1576.7 984.002
          Z"
        fill="currentColor"
        stroke="currentColor"
      />
      {/* Lid */}
      <g mask={`url(#${strawMaskId})`}>
        <path
          d="M 842 425.996
            C 1068.96 425.996 1272.44 477.107 1417.74 557.694
            C 1564.43 639.051 1643.5 744.959 1643.5 852.496
            C 1643.5 960.033 1564.43 1065.94 1417.74 1147.3
            C 1272.44 1227.89 1068.96 1279 842 1279
            C 615.035 1279 411.559 1227.89 266.26 1147.3
            C 119.574 1065.94 40.5 960.033 40.5 852.496
            C 40.5 744.959 119.574 639.051 266.26 557.694
            C 411.559 477.107 615.035 425.996 842 425.996
            Z"
          stroke="currentColor"
          strokeWidth="81"
        />
      </g>
      {/* Straw */}
      <path
        d="M 680.016 104.739
          L 956.016 825.451
          C 964.516 890.451 766.516 904.451 745.016 858.24
          L 479.516 169.739
          C 473.3 134.037 473.018 73.7374 547.018 47.9552
          C 621.018 22.1729 662.172 68.658 680.016 104.739
          Z"
        stroke="currentColor"
        strokeWidth="81"
        strokeLinecap="round"
      />
      {/* Top of straw */}
      <path
        d="M 687.516 128.953
          C 687.516 156.953 692.016 203.05 624.016 234.453
          C 587.557 251.29 507.016 255.453 483.016 181.953"
        stroke="currentColor"
        strokeWidth="81"
        strokeLinecap="round"
      />
    </svg>
  );
};
