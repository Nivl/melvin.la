import { createElement } from 'react';

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
  }: Record<string, unknown>) {
    return createElement(tag, props as object, children as never);
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
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_, tag: string) => makeEl(tag),
  }),
  AnimatePresence,
  MotionConfig,
};
