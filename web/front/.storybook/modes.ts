// /!\/!\/!\
//
// For every mode we enable, we will render every story for that mode.
// This means if we have 3 modes and 10 stories, we will render 30 stories
// everytime the CI runs.
//
// If we enable too many modes, we will run out of chromatic snapshots.
//
// As of 2025-06-28 we have a limit of 5k snapshots per month on chromatic
// See current limit here https://www.chromatic.com/pricing.
//
// With all the modes on, we run out of snapshots after a few weeks.
//
// /!\/!\/!\
export const supportedModes = {
  xsmall: {
    viewport: 'xsmall',
  },
  // small: {
  //   viewport: 'small',
  // },
  // medium: {
  //   viewport: 'medium',
  // },
  // large: {
  //   viewport: 'large',
  // },
  // xlarge: {
  //   viewport: 'xlarge',
  // },
  xxlarge: {
    viewport: 'xxlarge',
  },
  FourK: {
    viewport: 'FourK',
  },
  // dark: {
  //   theme: 'dark',
  // },
  // light: {
  //   theme: 'light',
  // },
  'light xsmall': {
    theme: 'light',
    viewport: 'xsmall',
  },
  // 'light small': {
  //   theme: 'light',
  //   viewport: 'small',
  // },
  // 'light medium': {
  //   theme: 'light',
  //   viewport: 'medium',
  // },
  // 'light large': {
  //   theme: 'light',
  //   viewport: 'large',
  // },
  // 'light xlarge': {
  //   theme: 'light',
  //   viewport: 'xlarge',
  // },
  'light xxlarge': {
    theme: 'light',
    viewport: 'xxlarge',
  },
  'light FourK': {
    theme: 'light',
    viewport: 'FourK',
  },
};
