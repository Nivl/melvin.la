// This is a test file
//eslint-disable only-export-components
import type { ReactNode } from "react";
import { createElement } from "react";

const makeEl = (tag: string) => {
  const MotionComponent = ({
    children,
    initial: _i,
    animate: _a,
    exit: _e,
    transition: _t,
    layout: _l,
    layoutId: _li,
    ...props
  }: Record<string, unknown> & { children?: ReactNode }) => createElement(tag, props, children);
  return MotionComponent;
};

const AnimatePresence = ({ children }: { children: unknown }) => children;

const MotionConfig = ({ children }: { children: unknown }) => children;

export const motionMock = {
  AnimatePresence,
  MotionConfig,
  motion: new Proxy<Record<string, unknown>>(
    {},
    {
      get: (_, tag: string) => makeEl(tag),
    },
  ),
};
