import type { Kanji } from '../types';

interface DrawStroke {
  points: { x: number; y: number }[];
  createdAt: number;
}

/**
 * Fallback recognition: matches drawn strokes count against kanji stroke_count.
 * Sorts by proximity and returns top candidates.
 */
export function recognizeByStrokeCount(
  strokes: DrawStroke[],
  kanjiList: Kanji[],
  maxResults: number = 12
): Kanji[] {
  const drawnCount = strokes.length;
  if (drawnCount === 0) return [];

  const scored = kanjiList.map(k => ({
    kanji: k,
    distance: Math.abs(k.stroke_count - drawnCount),
  }));

  scored.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    // Same distance => prefer lower JLPT number (N5 first)
    const jlptOrder: Record<string, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };
    return (jlptOrder[a.kanji.jlpt] ?? 5) - (jlptOrder[b.kanji.jlpt] ?? 5);
  });

  return scored.slice(0, maxResults).map(s => s.kanji);
}

export type { DrawStroke };
