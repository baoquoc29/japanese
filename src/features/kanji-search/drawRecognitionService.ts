import type { Kanji } from '../../types';

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

/**
 * Intelligent handwriting recognition utilizing Google Input Tools Japanese Handwriting API.
 * Falls back to stroke count matching if offline or if the API fails.
 */
export async function recognizeHandwriting(
  strokes: DrawStroke[],
  kanjiList: Kanji[],
  maxResults: number = 12
): Promise<Kanji[]> {
  const drawnCount = strokes.length;
  if (drawnCount === 0) return [];

  try {
    // Map strokes to Google IME coordinate format:
    // [[[x1, x2, ...], [y1, y2, ...]], [[x1, x2, ...], [y1, y2, ...]]]
    const ink = strokes.map(stroke => [
      stroke.points.map(p => Math.round(p.x)),
      stroke.points.map(p => Math.round(p.y))
    ]);

    const requestBody = {
      app: 'translate',
      itc: 'ja-t-i0-handwrit',
      ink: ink,
      device: 'desktop',
      screen_width: 800,
      screen_height: 600
    };

    const response = await fetch('https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Google IME API error');
    }

    const data = await response.json();
    if (data && data[0] === 'SUCCESS') {
      const candidates: string[] = data[1][0][1];
      if (candidates && candidates.length > 0) {
        const results: Kanji[] = [];
        const processedChars = new Set<string>();

        // 1. First extract and match N5-N1 characters in the local dictionary database
        for (const char of candidates) {
          const matched = kanjiList.find(k => k.character === char);
          if (matched) {
            results.push(matched);
            processedChars.add(char);
          }
        }

        // 2. Map other recognized characters as premium standalone Kanji cards so the handwriting responds perfectly to user inputs
        for (const char of candidates) {
          if (!processedChars.has(char) && results.length < maxResults) {
            // Validate that this is a single character
            if (char.length === 1) {
              results.push({
                character: char,
                meanings_vi: ['Chữ ngoài N5-N1'],
                meanings_en: [],
                on_readings: [],
                kun_readings: [],
                stroke_count: drawnCount,
                jlpt: 'N1', // Display badge as N1 or handle gracefully in card UI
                unicode: char.charCodeAt(0).toString(16).toUpperCase(),
                examples: []
              });
            }
          }
        }

        if (results.length > 0) {
          return results.slice(0, maxResults);
        }
      }
    }
  } catch (error) {
    console.warn('Handwriting API fetch failed. Using stroke count heuristic fallback.', error);
  }

  // Graceful fallback to the offline stroke count algorithm
  return recognizeByStrokeCount(strokes, kanjiList, maxResults);
}

export type { DrawStroke };
