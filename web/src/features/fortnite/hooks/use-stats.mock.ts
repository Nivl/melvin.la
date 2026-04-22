import { fn } from "storybook/test";

// eslint-disable-next-line import/no-namespace
import * as actual from "./use-stats";

// eslint-disable-next-line oxc/no-barrel-file
export * from "./use-stats";
export const useStats = fn(actual.useStats).mockName("fortnite::useStats");
