import { MusicSpecification, SongSection } from '@/types/music';

export interface ScaleDefinition {
  name: string;
  type: 'major' | 'minor' | 'modal' | 'pentatonic';
  intervals: number[]; // semitones from root
  description: string;
}

export const SCALES: Record<string, ScaleDefinition> = {
  'Major': {
    name: 'Major (Ionian)',
    type: 'major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    description: 'Bright, uplifting, triumphant, resolute',
  },
  'Natural Minor': {
    name: 'Natural Minor (Aeolian)',
    type: 'minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    description: 'Somber, melancholic, reflective, emotional',
  },
  'Harmonic Minor': {
    name: 'Harmonic Minor',
    type: 'minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    description: 'Exotic, dramatic, neoromantic, suspenseful',
  },
  'Melodic Minor': {
    name: 'Melodic Minor',
    type: 'minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    description: 'Sophisticated, jazz-infused, cinematic mystery',
  },
  'Dorian': {
    name: 'Dorian Mode',
    type: 'modal',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    description: 'Medieval, soulful, heroic, slightly hopeful minor',
  },
  'Phrygian': {
    name: 'Phrygian Mode',
    type: 'modal',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    description: 'Dark, tense, flamenco, metal, middle-eastern tension',
  },
  'Lydian': {
    name: 'Lydian Mode',
    type: 'modal',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    description: 'Dreamy, ethereal, sci-fi wonder, floating euphoria',
  },
  'Mixolydian': {
    name: 'Mixolydian Mode',
    type: 'modal',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    description: 'Bluesy, classic rock, optimistic drive with flat 7th',
  },
  'Locrian': {
    name: 'Locrian Mode',
    type: 'modal',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    description: 'Dissonant, unstable, dystopian, unresolved dread',
  },
  'Pentatonic Minor': {
    name: 'Pentatonic Minor',
    type: 'pentatonic',
    intervals: [0, 3, 5, 7, 10],
    description: 'Blues, rock, lo-fi, universally melodic simplicity',
  },
  'Blues': {
    name: 'Blues Scale',
    type: 'pentatonic',
    intervals: [0, 3, 5, 6, 7, 10],
    description: 'Expressive blue notes, gritty soul, emotional depth',
  },
};

export const CHORD_PROGRESSIONS_BY_GENRE: Record<string, string[][]> = {
  Cinematic: [
    ['Am', 'F', 'C', 'G'], // i - VI - III - VII (Epic Hans Zimmer style)
    ['Dm', 'Bb', 'Gm', 'A'], // i - VI - iv - V (Dramatic Tension)
    ['Cm', 'Ab', 'Eb', 'Bb'], // Epic Orchestral Journey
    ['Em', 'C', 'G', 'D'], // Heroic Resolution
  ],
  Electronic: [
    ['Am', 'G', 'F', 'Em'],
    ['Fm', 'Db', 'Eb', 'C'],
    ['Cm', 'Gm', 'Ab', 'Bb'],
  ],
  'Lo-fi': [
    ['Dm7', 'G7', 'Cmaj7', 'Am7'], // ii-V-I-vi (Smooth jazz)
    ['Fmaj7', 'Em7', 'Dm7', 'Cmaj7'],
    ['Abmaj7', 'Gm7', 'Fm7', 'Ebmaj7'],
  ],
  'Hip-Hop': [
    ['Am', 'Em', 'F', 'E7'],
    ['Cm', 'Fm', 'G7', 'Cm'],
    ['Dm', 'Am', 'Bb', 'Gm'],
  ],
  Classical: [
    ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'], // Pachelbel progression
    ['Am', 'Dm', 'E7', 'Am'],
    ['Dm', 'G7', 'C', 'Am'],
  ],
  Ambient: [
    ['Csus2', 'Gsus4', 'Am7', 'Fadd9'],
    ['Dmaj9', 'Bm7', 'Gmaj7', 'A6'],
  ],
  Rock: [
    ['E5', 'G5', 'A5', 'C5', 'D5'],
    ['Am', 'C', 'D', 'F'],
  ],
};

export const GENRE_PRESETS: Record<string, {
  bpm: number;
  key: string;
  instruments: string[];
  effects: string[];
  dynamics: string[];
  timeSignature: string;
}> = {
  Cinematic: {
    bpm: 88,
    key: 'A minor',
    instruments: ['Grand Piano', 'Violin Section', 'Cello', 'Orchestral Percussion', 'Brass Horns', 'Sub Bass', 'Ambient Choir'],
    effects: ['Cathedral Reverb', 'Tape Saturation', 'Dynamic Stereo Width', 'Parallel Compression'],
    dynamics: ['Pianissimo', 'Crescendo', 'Fortissimo'],
    timeSignature: '4/4',
  },
  Electronic: {
    bpm: 126,
    key: 'F minor',
    instruments: ['Analog Synth Lead', '808 Bass', 'Electronic Drums', 'Pluck Synth', 'Wavetable Pad', 'Riser FX'],
    effects: ['Sidechain Compression', 'Ping-Pong Delay', 'High-Pass Filter', 'Limiter'],
    dynamics: ['Mezzo Forte', 'Forte'],
    timeSignature: '4/4',
  },
  'Lo-fi': {
    bpm: 78,
    key: 'C Major',
    instruments: ['Fender Rhodes', 'Acoustic Guitar', 'Vinyl Crackle Drums', 'Warm Muted Bass', 'Ambient Tape Hiss'],
    effects: ['Tape Saturation', 'Vinyl EQ Filter', 'Spring Reverb', 'Gentle Chorus'],
    dynamics: ['Mezzo Piano', 'Piano'],
    timeSignature: '4/4',
  },
  'Hip-Hop': {
    bpm: 140,
    key: 'C Minor',
    instruments: ['Sub 808 Bass', 'Trap Snare', 'Rolling Hi-Hats', 'Dark Piano Melodic Loop', 'Vocal Chants'],
    effects: ['Soft Clipper', 'Sidechain', 'Low-End EQ Boost', 'Distortion'],
    dynamics: ['Forte', 'Fortissimo'],
    timeSignature: '4/4',
  },
  Ambient: {
    bpm: 60,
    key: 'D Major',
    instruments: ['Granular Ambient Pad', 'Gentle Felt Piano', 'Shimmer Strings', 'Deep Atmospheric Drone'],
    effects: ['Infinite Reverb', 'Ethereal Delay', 'Stereo Widener', 'Low-Pass Filter Sweep'],
    dynamics: ['Pianissimo', 'Piano'],
    timeSignature: '4/4',
  },
  Orchestral: {
    bpm: 96,
    key: 'D Minor',
    instruments: ['Full Strings', 'French Horns', 'Timpani', 'Concert Flute', 'Oboe', 'Bass Drum'],
    effects: ['Concert Hall Reverb', 'Multi-band Dynamics', 'Master Limiter'],
    dynamics: ['Mezzo Piano', 'Crescendo', 'Fortissimo'],
    timeSignature: '4/4',
  },
  House: {
    bpm: 124,
    key: 'G Minor',
    instruments: ['Four-on-the-Floor Kick', 'Clap & Shaker', 'M1 Piano', 'Deep Synth Bassline', 'Soulful Vocal Chop'],
    effects: ['Heavy Sidechain', 'Tape Delay', 'Room Reverb'],
    dynamics: ['Forte'],
    timeSignature: '4/4',
  },
};

/**
 * Parses natural language prompt into deep musical intention and structured specification.
 */
export function interpretPrompt(prompt: string, overrides: Partial<MusicSpecification> = {}): MusicSpecification {
  const p = prompt.toLowerCase();

  // 1. Detect Genre
  let genre = 'Cinematic';
  if (p.includes('lo-fi') || p.includes('lofi') || p.includes('chillhop')) genre = 'Lo-fi';
  else if (p.includes('orchestral') || p.includes('symphon')) genre = 'Orchestral';
  else if (p.includes('techno') || p.includes('club') || p.includes('berlin')) genre = 'Techno';
  else if (p.includes('house') || p.includes('deep house') || p.includes('disco')) genre = 'House';
  else if (p.includes('trap') || p.includes('808')) genre = 'Trap';
  else if (p.includes('hip-hop') || p.includes('hip hop') || p.includes('boom bap')) genre = 'Hip-Hop';
  else if (p.includes('ambient') || p.includes('drone') || p.includes('meditation')) genre = 'Ambient';
  else if (p.includes('rock') || p.includes('metal') || p.includes('guitar solo')) genre = 'Rock';
  else if (p.includes('classical') || p.includes('bach') || p.includes('beethoven')) genre = 'Classical';
  else if (p.includes('jazz') || p.includes('swing') || p.includes('bebop')) genre = 'Jazz';
  else if (p.includes('edm') || p.includes('dance') || p.includes('festival')) genre = 'EDM';
  else if (p.includes('electronic') || p.includes('synthwave') || p.includes('cyberpunk')) genre = 'Electronic';
  else if (p.includes('r&b') || p.includes('soul')) genre = 'R&B';
  else if (p.includes('folk') || p.includes('acoustic')) genre = 'Acoustic';

  // 2. Detect Moods
  const detectedMoods: string[] = [];
  const moodMap: Record<string, string[]> = {
    'Dark': ['dark', 'shadow', 'sinister', 'menacing', 'grim', 'dystopian', 'evil'],
    'Emotional': ['emotional', 'heartfelt', 'touching', 'moving', 'soulful'],
    'Epic': ['epic', 'monumental', 'heroic', 'grand', 'trailer', 'massive'],
    'Mysterious': ['mysterious', 'enigmatic', 'curious', 'fog', 'intriguing'],
    'Peaceful': ['peaceful', 'calm', 'serene', 'tranquil', 'soothing', 'gentle'],
    'Melancholic': ['sad', 'melanchol', 'sorrow', 'grief', 'tearful', 'mournful'],
    'Suspenseful': ['tension', 'suspense', 'thriller', 'nervous', 'ominous'],
    'Dreamy': ['dream', 'floating', 'ethereal', 'cloud', 'lucid'],
    'Aggressive': ['aggressive', 'hard', 'punchy', 'heavy', 'brutal'],
    'Triumphant': ['triumph', 'victory', 'glory', 'climactic', 'conquest'],
  };

  for (const [mood, keywords] of Object.entries(moodMap)) {
    if (keywords.some((kw) => p.includes(kw))) {
      detectedMoods.push(mood);
    }
  }
  if (detectedMoods.length === 0) detectedMoods.push('Emotional', 'Cinematic');

  // 3. Detect BPM
  let bpm = GENRE_PRESETS[genre]?.bpm || 100;
  const bpmMatch = prompt.match(/(\d{2,3})\s*(?:bpm|tempo)/i);
  if (bpmMatch && bpmMatch[1]) {
    const val = parseInt(bpmMatch[1], 10);
    if (val >= 40 && val <= 240) bpm = val;
  } else if (p.includes('slow')) {
    bpm = Math.max(60, Math.floor(bpm * 0.8));
  } else if (p.includes('fast') || p.includes('energetic')) {
    bpm = Math.min(160, Math.floor(bpm * 1.25));
  }

  // 4. Detect Musical Key
  let key = GENRE_PRESETS[genre]?.key || 'A minor';
  const keyMatches = [
    'c major', 'd major', 'e major', 'f major', 'g major', 'a major', 'b major',
    'c minor', 'd minor', 'e minor', 'f minor', 'g minor', 'a minor', 'b minor',
    'bb major', 'eb major', 'ab major', 'db major', 'f# minor', 'c# minor'
  ];
  for (const km of keyMatches) {
    if (p.includes(km)) {
      // capitalize
      key = km.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // 5. Detect Instruments
  const instrumentCandidates = [
    { name: 'Grand Piano', kws: ['piano', 'keys', 'grand piano'] },
    { name: 'Strings', kws: ['string', 'violin', 'cello', 'viola', 'orchestral strings'] },
    { name: 'Orchestral Percussion', kws: ['percussion', 'timpani', 'taiko', 'cinematic drums'] },
    { name: '808 Bass', kws: ['808', 'sub bass', 'sub-bass', 'deep bass'] },
    { name: 'Acoustic Drums', kws: ['acoustic drum', 'live drum', 'drum kit'] },
    { name: 'Electronic Drums', kws: ['electronic drum', 'synth drums', 'hi-hat', 'kick and snare'] },
    { name: 'Brass & Horns', kws: ['brass', 'horn', 'trumpet', 'french horn'] },
    { name: 'Synthesizer', kws: ['synth', 'synthesizer', 'arpeggio', 'saw lead'] },
    { name: 'Ambient Pads', kws: ['pad', 'ambient pad', 'textures', 'drone'] },
    { name: 'Choir & Vocals', kws: ['choir', 'vocal', 'voice', 'singing'] },
    { name: 'Acoustic Guitar', kws: ['acoustic guitar', 'guitar strum', 'fingerstyle'] },
    { name: 'Electric Guitar', kws: ['electric guitar', 'distorted guitar', 'riff'] },
  ];

  const instruments: string[] = [];
  for (const inst of instrumentCandidates) {
    if (inst.kws.some(k => p.includes(k))) {
      instruments.push(inst.name);
    }
  }
  if (instruments.length === 0) {
    instruments.push(...(GENRE_PRESETS[genre]?.instruments.slice(0, 4) || ['Grand Piano', 'Strings', 'Bass']));
  }

  // 6. Chord progression selection based on mood & genre
  const genreProgList = CHORD_PROGRESSIONS_BY_GENRE[genre] || CHORD_PROGRESSIONS_BY_GENRE['Cinematic'];
  const chordProgression = genreProgList[0];

  // 7. Song Structure & Dynamics
  const structure: SongSection[] = [
    { name: 'Intro', bars: 4, description: 'Atmospheric opening with sparse piano voicings and subtle room reverb', intensity: 2 },
    { name: 'Build-Up', bars: 8, description: 'Introduction of rhythmic ostinato, swelling string section, rising tension', intensity: 5 },
    { name: 'Climax / Peak', bars: 8, description: 'Explosive orchestral percussion, soaring melodic themes, full harmonic density', intensity: 9 },
    { name: 'Resolution / Outro', bars: 4, description: 'Gentle decrescendo, lingering piano sustain, decaying cinematic sub-bass', intensity: 3 },
  ];

  const defaultSpec: MusicSpecification = {
    genre,
    subgenre: genre === 'Cinematic' ? 'Hollywood Epic Trailer' : `${genre} Modern`,
    mood: detectedMoods,
    bpm,
    key,
    time_signature: overrides.time_signature || '4/4',
    instruments: Array.from(new Set(instruments)),
    chord_progression: chordProgression,
    melodic_style: 'Cantabile, lyrical motif with dynamic contouring and interval leaps',
    rhythm_style: 'Driving cinematic pulse with accented polyrhythmic syncopations',
    song_structure: structure,
    dynamics: ['Pianissimo (Intro)', 'Crescendo (Build)', 'Fortissimo (Climax)', 'Decrescendo (Outro)'],
    production_effects: ['Concert Hall Reverb', 'Tape Saturation', 'Parallel Bus Compression', 'Stereo Imaging'],
    vocal_style: p.includes('vocal') || p.includes('lyric') ? 'Ethereal cinematic soprano vocalizations' : 'None (Instrumental)',
    duration: '2:15',
    generation_instructions: `Compose a production-grade ${genre} piece in ${key} at ${bpm} BPM. Begin with quiet evocative ${instruments[0] || 'piano'}, layer emotional harmonies, build dynamic intensity into an explosive cinematic climax with ${instruments.join(', ')}, and conclude with a reflective release.`,
    ...overrides,
  };

  return defaultSpec;
}

/**
 * Enhances a user's basic prompt with professional music theory and production phrasing.
 */
export function enhancePrompt(prompt: string, currentSpec?: Partial<MusicSpecification>): string {
  const spec = interpretPrompt(prompt, currentSpec);
  const instrumentsStr = spec.instruments.join(', ');
  const moodStr = spec.mood.join(', ').toLowerCase();

  return `Create a masterfully produced ${spec.genre} composition (${spec.subgenre}) set in ${spec.key} at an exact tempo of ${spec.bpm} BPM. Evoke an atmosphere that is deeply ${moodStr}. Instrumentation prominently features ${instrumentsStr}. Establish an evocative, nuanced introduction, gradually elevating harmonic density and polyphonic counterpoint into a breathtaking, dynamic climax, finished with an immersive cinematic acoustic tail.`;
}

/**
 * Generates an inspiring random musical prompt for the user.
 */
export const INSPIRATION_PROMPTS: string[] = [
  'A dark cinematic orchestral soundtrack with emotional piano, atmospheric strings, deep cinematic percussion, a slow build-up, dramatic tension, and an explosive orchestral climax. Use A minor, 90 BPM, and a powerful Hollywood-style sound.',
  'An ethereal cyberpunk synthwave journey with shimmering analog arpeggios, nostalgic DX7 synth leads, driving 808 sidechained bassline, and punchy LinnDrum percussion. 118 BPM, F minor.',
  'A warm, rain-soaked lo-fi hip hop groove with vintage Rhodes electric piano chords, dusty vinyl crackle, mellow acoustic bassline, tape warble, and relaxed unquantized drum swing. 78 BPM, C Major.',
  'An epic fantasy adventure soundtrack featuring soaring Celtic flute melodies, sweeping string ensembles, heroic French horn fanfares, and thunderous tribal war drums. 110 BPM, D Dorian.',
  'Deep hypnotic melodic techno with warm analog modular basslines, intricate percussion layers, atmospheric reverb washes, and a hypnotic rolling groove. 124 BPM, G minor.',
  'A haunting acoustic folk ballad with delicate fingerpicked acoustic guitar, intimate cello counter-melodies, and soft ambient room reverberation. 72 BPM, E minor.',
];
