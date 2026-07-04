export interface AmbientTrack {
  id: string;
  title: string;
  artist: string;
  src: `/audio/${string}.mp3`;
  sourceUrl: `https://${string}`;
  license: 'CC0-1.0';
  vocals: boolean;
  mood: readonly string[];
}

export const AMBIENT_TRACKS = [
  {
    id: 'please-dont-go',
    title: "Please Don't Go",
    artist: 'HoliznaCC0',
    src: '/audio/please-dont-go.mp3',
    sourceUrl: 'https://freemusicarchive.org/index.php/music/holiznacc0/be-happy-with-who-you-are/please-dont-go-1/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['melancholy', 'lo-fi', 'late-night'],
  },
  {
    id: 'busted-jazz',
    title: 'Busted Jazz',
    artist: 'HoliznaCC0',
    src: '/audio/busted-jazz.mp3',
    sourceUrl: 'https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/busted-jazz/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['jazzy', 'dusty', 'warm'],
  },
  {
    id: 'coldness',
    title: 'Coldness',
    artist: 'The Wanderer',
    src: '/audio/coldness.mp3',
    sourceUrl: 'https://freemusicarchive.org/music/stranger/seven-elements/coldness/',
    license: 'CC0-1.0',
    vocals: false,
    mood: ['melancholy', 'piano', 'cinematic'],
  },
] as const satisfies readonly AmbientTrack[];
