export const LISTENING_HEARTBEAT_MS = 3 * 60 * 60 * 1000;

export interface LastFmImage {
  '#text': string;
  size?: string;
}

export interface LastFmTrack {
  artist: { '#text': string };
  name: string;
  album?: { '#text': string };
  image?: LastFmImage[];
  url?: string;
  date?: { uts: string };
  '@attr'?: { nowplaying?: string };
}

export interface ListeningRow {
  artist: string;
  title: string;
  artworkUrl: string | null;
  youtubeUrl: string;
  playedAt: number | null;
  nowPlaying: boolean;
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
  history: ListeningRow[];
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

function isSameTrack(a: ListeningRow, b: ListeningRow): boolean {
  const same = (left: string, right: string) =>
    left.trim().toLowerCase() === right.trim().toLowerCase();

  return same(a.artist, b.artist) && same(a.title, b.title);
}

function toListeningRow(track: LastFmTrack): ListeningRow {
  const artist = track.artist['#text'];
  const title = track.name;

  return {
    artist,
    title,
    artworkUrl: pickLargestArtwork(track.image),
    youtubeUrl: buildYouTubeSearchUrl(artist, title),
    playedAt: track.date ? parseInt(track.date.uts, 10) * 1000 : null,
    nowPlaying: track['@attr']?.nowplaying === 'true',
  };
}

export function toListeningRows(tracks: LastFmTrack[] | undefined): ListeningRow[] {
  const rows = (tracks ?? []).map(toListeningRow);

  // Last.fm scrobbles a track around halfway through, so the track it reports
  // as now-playing is often also the newest scrobble. Drop that one echo —
  // a genuine back-to-back repeat between scrobbles is real history and stays.
  if (rows[0]?.nowPlaying && rows[1] && isSameTrack(rows[0], rows[1])) {
    rows.splice(1, 1);
  }

  return rows;
}

export function formatPlayedAgo(
  playedAt: number | null,
  now = Date.now(),
): string | null {
  if (!playedAt) return null;

  const elapsed = Math.max(0, now - playedAt);
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
