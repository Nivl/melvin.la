// This is a test file
//eslint-disable only-export-components
import { createElement, type ReactNode } from "react";

const makeEl = (tag: string) => {
  function MotionComponent({
    children,
    initial: _i,
    animate: _a,
    exit: _e,
    transition: _t,
    layout: _l,
    layoutId: _li,
    ...props
  }: Record<string, unknown> & { children?: ReactNode }) {
    return createElement(tag, props, children);
  }
  return MotionComponent;
};

function AnimatePresence({ children }: { children: unknown }) {
  return children;
}

function MotionConfig({ children }: { children: unknown }) {
  return children;
}

export const motionMock = {
  motion: new Proxy<Record<string, unknown>>(
    {},
    {
      get: (_, tag: string) => makeEl(tag),
    },
  ),
  AnimatePresence,
  MotionConfig,
};
