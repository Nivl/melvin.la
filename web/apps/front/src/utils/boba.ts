import { random, randomInt } from 'es-toolkit';

export type BobaCoordinate = {
  x: number;
  y: number;
  durationMs: number;
  shakeDelayMs: number;
  shakeOffset: number;
};

const bobaRadius = 65.5;
const bobaDiameter = bobaRadius * 2;
const separationDistance = 1.5 * bobaDiameter;
const bobaMinPositionX = 439;
const bobaMaxPositionX = 1300;
const bobaMinPositionY = 1800;
const bobaMaxPositionY = 2400;
const bobaMinAnimationDuration = 3000;
export const bobaMaxAnimationDuration = 5000;
export const bobaSoftShakeDuration = 800;
export const bobaDefaultShakeOffset = 25;

const randomDuration = () =>
  randomInt(bobaMinAnimationDuration, bobaMaxAnimationDuration);

const randomShakeOffset = () => randomInt(20, 30);
const randomShakeDelayMs = () => randomInt(0, 500);

// We hardcode everything to prevent hydration mismatches with SSR..
export const defaultBobaCoordinates: BobaCoordinate[] = [
  {
    x: 716.945,
    y: 2326.95,
    durationMs: 3784,
    shakeDelayMs: 56,
    shakeOffset: 25,
  },
  {
    x: 874.945,
    y: 2171.95,
    durationMs: 4357,
    shakeDelayMs: 383,
    shakeOffset: 21,
  },
  {
    x: 605.945,
    y: 2129.95,
    durationMs: 3194,
    shakeDelayMs: 399,
    shakeOffset: 26,
  },
  {
    x: 1010.95,
    y: 2319.95,
    durationMs: 4147,
    shakeDelayMs: 389,
    shakeOffset: 28,
  },
  {
    x: 1253.95,
    y: 2211.95,
    durationMs: 4981,
    shakeDelayMs: 365,
    shakeOffset: 26,
  },
  {
    x: 1075.95,
    y: 2106.95,
    durationMs: 4099,
    shakeDelayMs: 199,
    shakeOffset: 23,
  },
  {
    x: 439.945,
    y: 2254.95,
    durationMs: 3764,
    shakeDelayMs: 18,
    shakeOffset: 23,
  },
];

// roundOdd takes a number, rounds it, and ensures it's odd.
export const roundOdd = (n: number) => {
  const r = Math.round(n);
  return r % 2 === 1 ? r : r + 1;
};

// All the maths is AI generated because fuck doing this
// by hand.
//
// The code has been cleaned up by hand.
//
// Prompt was:
//
// Write a typescript function that does the following:
// We have a map, the X coordinate starts at 439 and ends at 1381.
// The Y coordinate starts at 1800 and ends at 2400.
//
// On this map we want to place 7 balls randomly.
// The balls radius is 65.5.
//
// - The balls should fully fit on the map
// - The balls should not overlap
// - It should avoid creating clusters
// - We need to be able to generate a full random array
// - We also need to be able to only update at a specific index of a given array
// - When updating a single ball, it should not overlap with its previous position and should be at least at a few "balls" distance away
const validSpot = (
  x: number,
  y: number,
  ignore: number,
  arr: BobaCoordinate[],
) => {
  for (const [i, element] of arr.entries()) {
    if (i === ignore) {
      continue;
    }

    const dx = element.x - x;
    const dy = element.y - y;

    if (dx * dx + dy * dy < separationDistance * separationDistance) {
      return false;
    }
  }
  return true;
};

export const generateBalls = () => {
  const balls: BobaCoordinate[] = [];

  for (let i = 0; i < 7; i++) {
    let x: number, y: number;
    let ok: boolean;
    let tries = 0;

    do {
      x = random(bobaMinPositionX + bobaRadius, bobaMaxPositionX - bobaRadius);
      y = random(bobaMinPositionY + bobaRadius, bobaMaxPositionY - bobaRadius);
      ok = validSpot(x, y, -1, balls);
    } while (!ok && ++tries < 5000);

    if (!ok) {
      let bestX = 0;
      let bestY = 0;
      let minOverlap = Infinity;

      for (let k = 0; k < 1000; k++) {
        const tx = random(
          bobaMinPositionX + bobaRadius,
          bobaMaxPositionX - bobaRadius,
        );
        const ty = random(
          bobaMinPositionY + bobaRadius,
          bobaMaxPositionY - bobaRadius,
        );
        let overlap = 0;

        for (const b of balls) {
          const dx = b.x - tx;
          const dy = b.y - ty;
          const d2 = dx * dx + dy * dy;

          if (d2 < bobaDiameter * bobaDiameter) {
            overlap += bobaDiameter - Math.sqrt(d2);
          }
        }

        if (overlap < minOverlap) {
          minOverlap = overlap;
          bestX = tx;
          bestY = ty;
        }
      }
      x = bestX;
      y = bestY;
    }
    balls.push({
      x,
      y,
      durationMs: randomDuration(),
      shakeDelayMs: randomShakeDelayMs(),
      shakeOffset: randomShakeOffset(),
    });
  }
  return balls;
};

export const updateBallAt = (index: number, balls: BobaCoordinate[]): void => {
  const original = balls[index];
  // not super useful, but that's a useful variable to have around
  // in case we need some tweaking
  const minDistance = 1 * separationDistance;
  let x: number;
  let y: number;
  let ok: boolean;
  let tries = 0;

  do {
    x = random(bobaMinPositionX + bobaRadius, bobaMaxPositionX - bobaRadius);
    y = random(bobaMinPositionY + bobaRadius, bobaMaxPositionY - bobaRadius);
    const dx = x - original.x;
    const dy = y - original.y;

    ok =
      validSpot(x, y, index, balls) &&
      dx * dx + dy * dy >= minDistance * minDistance;
  } while (!ok && ++tries < 5000);

  if (!ok) {
    let bestX = 0;
    let bestY = 0;
    let bestDist = 0;

    for (let k = 0; k < 2000; k++) {
      const tx = random(
        bobaMinPositionX + bobaRadius,
        bobaMaxPositionX - bobaRadius,
      );
      const ty = random(
        bobaMinPositionY + bobaRadius,
        bobaMaxPositionY - bobaRadius,
      );
      const dx = tx - original.x;
      const dy = ty - original.y;
      const dist2 = dx * dx + dy * dy;

      if (dist2 >= bestDist && validSpot(tx, ty, index, balls)) {
        bestDist = dist2;
        bestX = tx;
        bestY = ty;
      }
    }
    x = bestX;
    y = bestY;
  }
  balls[index] = {
    x,
    y,
    durationMs: randomDuration(),
    shakeDelayMs: randomShakeDelayMs(),
    shakeOffset: randomShakeOffset(),
  };
};
