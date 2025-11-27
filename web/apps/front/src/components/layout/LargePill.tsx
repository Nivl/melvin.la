'use client';

import { X as DeleteIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { forwardRef, Ref, useEffect, useState } from 'react';

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

type Props = {
  item: { color: Color; content: React.ReactNode };
  onDelete: () => void;
};

export const LargePill = forwardRef(
  ({ item, onDelete }: Props, ref: Ref<HTMLDivElement>) => {
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
      <motion.div
        ref={ref}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, filter: 'blur(5px)' }}
          animate={reducedMotion ? false : { opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        >
          <div
            className={`${item.color} mt-4 flex justify-center gap-3 rounded-full p-7 text-black sm:p-4`}
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
        </motion.div>
      </motion.div>
    );
  },
);

LargePill.displayName = 'LargePill';
