// This is a test file
//eslint-disable only-export-components
import type { ComponentType } from "react";
import { createElement, useEffect, useState } from "react";

export const dynamicMock = {
  default: (factory: () => Promise<ComponentType<Record<string, unknown>>>) => {
    const Wrapper = (props: Record<string, unknown>) => {
      const [comp, setComp] = useState<ComponentType<Record<string, unknown>> | undefined>(
        undefined,
      );
      useEffect(() => {
        factory()
          .then((mod) => {
            setComp(() => mod);
          })
          .catch(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
      }, []);
      return comp ? createElement(comp, props) : undefined;
    };
    return Wrapper;
  },
};
