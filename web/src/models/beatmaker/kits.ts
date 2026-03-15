import type { Kit, TrackId } from './types';

const SAMPLE_VERSION = 'v1';

export const KITS: Record<Kit, Record<string, never>> = {
  '808': {},
  acoustic: {},
  lofi: {},
};

export function getSampleUrl(kit: Kit, trackId: TrackId): string {
  return `/assets/games/beatmaker/samples/${SAMPLE_VERSION}/${kit}/${trackId}.mp3`;
}
