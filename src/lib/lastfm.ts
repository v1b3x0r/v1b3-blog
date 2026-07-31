export const LISTENING_HEARTBEAT_MS = 3 * 60 * 60 * 1000;

export interface LastFmImage {
  '#text': string;
  size?: string;
}

export interface LastFmState {
  track: string | null;
  artist: string | null;
  title: string | null;
  album: string | null;
  artworkUrl: string | null;
  lastfmUrl: string | null;
  youtubeUrl: string | null;
  playedAt: number | null;
  activityAt: number | null;
  nowPlaying: boolean;
}

export function buildYouTubeSearchUrl(artist: string, title: string): string {
  const query = `${artist} ${title}`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function pickLargestArtwork(images?: LastFmImage[]): string | null {
  const artwork = images
    ?.map((image) => image['#text'].trim())
    .filter(Boolean)
    .at(-1);

  return artwork ? artwork.replace(/^http:/, 'https:') : null;
}

export function isListeningAlive(
  state: LastFmState | null | undefined,
  now = Date.now(),
): boolean {
  if (!state?.track || !state.activityAt) return false;
  return now - state.activityAt <= LISTENING_HEARTBEAT_MS;
}
