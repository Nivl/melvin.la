"use client";

import { CloseButton } from "@heroui/react";
import { X as DeleteIcon } from "lucide-react";
import { motion } from "motion/react";
import { forwardRef, Ref, useEffect, useState } from "react";

import { usePrefersReducedMotion } from "#shared/hooks/use-prefers-reduced-motion";

import { Color } from "./types";

type Props = {
  item: { color: Color; content: React.ReactNode };
  onDelete: () => void;
};

export const LargePill = forwardRef(({ item, onDelete }: Props, ref: Ref<HTMLDivElement>) => {
  const [isBooped, setIsBooped] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!isBooped) {
      return undefined;
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
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
    >
      <motion.div
        initial={reducedMotion ? false : { filter: "blur(5px)", opacity: 0 }}
        animate={reducedMotion ? false : { filter: "blur(0px)", opacity: 1 }}
        exit={{ filter: "blur(5px)", opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
      >
        <div
          className={`${item.color} mt-4 flex items-center justify-center gap-3 rounded-full p-7 text-black sm:p-4`}
        >
          <div className="ml-auto">{item.content}</div>

          <CloseButton
            aria-label="Remove"
            className="ml-auto"
            onMouseEnter={() => {
              if (!reducedMotion) {
                setIsBooped(true);
              }
            }}
            onPress={() => {
              onDelete();
            }}
          >
            <DeleteIcon
              className={`cls-boop-animation ${isBooped ? "rotate-15" : "rotate-0"} h-full`}
            />
          </CloseButton>
        </div>
      </motion.div>
    </motion.div>
  );
});

LargePill.displayName = "large-pill";
