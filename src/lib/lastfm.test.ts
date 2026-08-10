import { describe, expect, it } from 'vitest';
import {
  LISTENING_HEARTBEAT_MS,
  buildYouTubeSearchUrl,
  formatPlayedAgo,
  isListeningAlive,
  pickLargestArtwork,
  toListeningRows,
  type LastFmState,
  type LastFmTrack,
} from './lastfm';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const scrobble = (
  artist: string,
  title: string,
  overrides: Partial<LastFmTrack> = {},
): LastFmTrack => ({
  artist: { '#text': artist },
  name: title,
  ...overrides,
});

const nowPlaying = (artist: string, title: string): LastFmTrack =>
  scrobble(artist, title, { '@attr': { nowplaying: 'true' } });

const playedAt = (seconds: number): Pick<LastFmTrack, 'date'> => ({
  date: { uts: String(seconds) },
});

const state = (activityAt: number | null): LastFmState => ({
  track: 'Sleeping With Sirens — Save Me a Spark',
  artist: 'Sleeping With Sirens',
  title: 'Save Me a Spark',
  album: null,
  artworkUrl: null,
  lastfmUrl: null,
  youtubeUrl: null,
  playedAt: activityAt,
  activityAt,
  nowPlaying: false,
  history: [],
});

describe('Last.fm presentation helpers', () => {
  it('builds an encoded YouTube search for the same artist and title', () => {
    expect(buildYouTubeSearchUrl('Lamp', 'For Lovers')).toBe(
      'https://www.youtube.com/results?search_query=Lamp%20For%20Lovers',
    );
  });

  it('selects the largest non-empty artwork and upgrades it to https', () => {
    expect(pickLargestArtwork([
      { '#text': '', size: 'small' },
      { '#text': 'http://img.example/large.jpg', size: 'large' },
    ])).toBe('https://img.example/large.jpg');
  });

  it('keeps the listening heartbeat alive for three hours', () => {
    const now = 10 * LISTENING_HEARTBEAT_MS;
    expect(isListeningAlive(state(now - LISTENING_HEARTBEAT_MS), now)).toBe(true);
    expect(isListeningAlive(state(now - LISTENING_HEARTBEAT_MS - 1), now)).toBe(false);
  });
});

describe('toListeningRows', () => {
  it('carries artist, title, timestamp and a YouTube search across each row', () => {
    const rows = toListeningRows([
      scrobble('Penguin Villa', 'เศษหนึ่งส่วนใด', playedAt(1_700_000_000)),
    ]);

    expect(rows).toEqual([
      {
        artist: 'Penguin Villa',
        title: 'เศษหนึ่งส่วนใด',
        artworkUrl: null,
        youtubeUrl: buildYouTubeSearchUrl('Penguin Villa', 'เศษหนึ่งส่วนใด'),
        playedAt: 1_700_000_000_000,
        nowPlaying: false,
      },
    ]);
  });

  it('marks the now-playing track and leaves it without a timestamp', () => {
    const [row] = toListeningRows([nowPlaying('Lamp', 'For Lovers')]);

    expect(row.nowPlaying).toBe(true);
    expect(row.playedAt).toBeNull();
  });

  it('drops the scrobble that repeats the track already playing', () => {
    const rows = toListeningRows([
      nowPlaying('Lamp', 'For Lovers'),
      scrobble('lamp', '  For Lovers ', playedAt(1_700_000_000)),
      scrobble('Hitsujibungaku', 'ハロー、ムーン', playedAt(1_699_999_000)),
    ]);

    expect(rows.map((row) => row.title)).toEqual(['For Lovers', 'ハロー、ムーン']);
  });

  it('keeps a genuine back-to-back repeat when nothing is playing', () => {
    const rows = toListeningRows([
      scrobble('Lamp', 'For Lovers', playedAt(1_700_000_000)),
      scrobble('Lamp', 'For Lovers', playedAt(1_699_999_000)),
    ]);

    expect(rows).toHaveLength(2);
  });

  it('prefers the largest artwork and tolerates a feed with none', () => {
    const [withArt, withoutArt] = toListeningRows([
      scrobble('Lamp', 'For Lovers', {
        ...playedAt(1_700_000_000),
        image: [
          { '#text': '', size: 'small' },
          { '#text': 'http://img.example/large.jpg', size: 'large' },
        ],
      }),
      scrobble('Hitsujibungaku', 'ハロー、ムーン', playedAt(1_699_999_000)),
    ]);

    expect(withArt.artworkUrl).toBe('https://img.example/large.jpg');
    expect(withoutArt.artworkUrl).toBeNull();
  });

  it('returns nothing for an absent or empty feed', () => {
    expect(toListeningRows(undefined)).toEqual([]);
    expect(toListeningRows([])).toEqual([]);
  });
});

describe('formatPlayedAgo', () => {
  const now = 1_700_000_000_000;

  it('has no label for a track that is playing right now', () => {
    expect(formatPlayedAgo(null, now)).toBeNull();
  });

  it('reads the first minute as just now', () => {
    expect(formatPlayedAgo(now - 59 * 1000, now)).toBe('just now');
  });

  it('counts whole minutes up to the hour', () => {
    expect(formatPlayedAgo(now - MINUTE, now)).toBe('1 min ago');
    expect(formatPlayedAgo(now - 14 * MINUTE, now)).toBe('14 min ago');
    expect(formatPlayedAgo(now - 59 * MINUTE, now)).toBe('59 min ago');
  });

  it('counts whole hours up to the day', () => {
    expect(formatPlayedAgo(now - HOUR, now)).toBe('1 hr ago');
    expect(formatPlayedAgo(now - 23 * HOUR, now)).toBe('23 hr ago');
  });

  it('counts whole days beyond that', () => {
    expect(formatPlayedAgo(now - DAY, now)).toBe('1 day ago');
    expect(formatPlayedAgo(now - 3 * DAY, now)).toBe('3 days ago');
  });

  it('never reports a future scrobble as negative time', () => {
    expect(formatPlayedAgo(now + 5 * MINUTE, now)).toBe('just now');
  });
});
