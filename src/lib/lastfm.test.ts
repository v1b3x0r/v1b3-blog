import { describe, expect, it } from 'vitest';
import {
  LISTENING_HEARTBEAT_MS,
  buildYouTubeSearchUrl,
  isListeningAlive,
  pickLargestArtwork,
  type LastFmState,
} from './lastfm';

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
