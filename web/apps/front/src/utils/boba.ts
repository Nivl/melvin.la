import { random, randomInt } from 'es-toolkit';

export type BobaCoordinate = {
  x: number;
  y: number;
  durationMs: number;
  shakeDelayMs?: number;
  shakeOffset?: number;
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

const X_MIN = bobaMinPositionX,
  X_MAX = bobaMaxPositionX,
  Y_MIN = bobaMinPositionY,
  Y_MAX = bobaMaxPositionY,
  R = bobaRadius,
  D = bobaDiameter,
  SD = separationDistance;

const randomDuration = () =>
  randomInt(bobaMinAnimationDuration, bobaMaxAnimationDuration);

export const defaultBobaCoordinates: BobaCoordinate[] = [
  {
    x: 716.945,
    y: 2326.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 874.945,
    y: 2171.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 605.945,
    y: 2129.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 1010.95,
    y: 2319.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 1253.95,
    y: 2211.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 1075.95,
    y: 2106.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
  },
  {
    x: 439.945,
    y: 2254.95,
    durationMs: randomDuration(),
    shakeDelayMs: randomInt(0, 500),
    shakeOffset: randomInt(20, 50),
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
function validSpot(
  x: number,
  y: number,
  ignore: number,
  arr: BobaCoordinate[],
): boolean {
  for (const [i, element] of arr.entries()) {
    if (i === ignore) continue;
    const dx = element.x - x,
      dy = element.y - y;
    if (dx * dx + dy * dy < SD * SD) return false;
  }
  return true;
}

export function generateBalls() {
  const balls: BobaCoordinate[] = [];
  for (let i = 0; i < 7; i++) {
    let x: number,
      y: number,
      ok: boolean,
      tries = 0;
    do {
      x = random(X_MIN + R, X_MAX - R);
      y = random(Y_MIN + R, Y_MAX - R);
      ok = validSpot(x, y, -1, balls);
    } while (!ok && ++tries < 5000);
    if (!ok) {
      let bestX = 0,
        bestY = 0,
        minOverlap = Infinity;
      for (let k = 0; k < 1000; k++) {
        const tx = random(X_MIN + R, X_MAX - R);
        const ty = random(Y_MIN + R, Y_MAX - R);
        let overlap = 0;
        for (const b of balls) {
          const dx = b.x - tx,
            dy = b.y - ty;
          const d2 = dx * dx + dy * dy;
          if (d2 < D * D) overlap += D - Math.sqrt(d2);
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
    balls.push({ x, y, durationMs: randomDuration() });
  }
  return balls;
}

export function updateBallAt(index: number, balls: BobaCoordinate[]): void {
  const original = balls[index];
  const MIN_DIST = 1 * SD;
  let x: number,
    y: number,
    ok: boolean,
    tries = 0;

  do {
    x = random(X_MIN + R, X_MAX - R);
    y = random(Y_MIN + R, Y_MAX - R);
    const dx = x - original.x,
      dy = y - original.y;
    ok =
      validSpot(x, y, index, balls) && dx * dx + dy * dy >= MIN_DIST * MIN_DIST;
  } while (!ok && ++tries < 5000);

  if (!ok) {
    let bestX = 0,
      bestY = 0,
      bestDist = 0;
    for (let k = 0; k < 2000; k++) {
      const tx = random(X_MIN + R, X_MAX - R);
      const ty = random(Y_MIN + R, Y_MAX - R);
      const dx = tx - original.x,
        dy = ty - original.y;
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
  balls[index] = { x, y, durationMs: randomDuration() };
}
