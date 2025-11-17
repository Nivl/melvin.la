'use client';

import { X as DeleteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '#hooks/usePrefersReducedMotion.ts';

export const colors = [
  'bg-pink-300',
  'bg-green-400',
  'bg-blue-400',
  'bg-amber-400',
  'bg-teal-300',
  'bg-sky-300',
  'bg-indigo-300',
  'bg-violet-300',
  'bg-rose-300',
] as const;

export type Color = (typeof colors)[number];

export const LargePill = ({
  item,
  onDelete,
}: {
  item: { color: Color; content: React.ReactNode };
  onDelete: () => void;
}) => {
  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsBooped(false);
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [isBooped]);

  return (
    <div
      className={`${item.color} flex justify-center gap-3 rounded-full p-7 text-black sm:p-4`}
    >
      <div>{item.content}</div>

      <button
        aria-label="Remove"
        className="cursor-pointer"
        onMouseEnter={() => {
          if (!reducedMotion) {
            setIsBooped(true);
          }
        }}
        onClick={() => {
          onDelete();
        }}
      >
        <DeleteIcon
          className={`cls-boop-animation ${isBooped ? 'rotate-15' : 'rotate-0'} h-full`}
        />
      </button>
    </div>
  );
};
