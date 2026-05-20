/**
 * Service to load and cache KanjiVG SVG files from high-availability CDN mirrors.
 */

class StrokeOrderService {
  // In-memory cache to store fetched SVG strings
  private svgCache: Map<string, string> = new Map();

  /**
   * Converts a character into its lowercase, 5-digit padded hexadecimal unicode representation.
   * Example: '日' -> U+65E5 -> '065e5'
   */
  getKanjiVgHex(char: string): string {
    if (!char) return '';
    const codePoint = char.codePointAt(0) || char.charCodeAt(0);
    return codePoint.toString(16).toLowerCase().padStart(5, '0');
  }

  /**
   * Fetches the KanjiVG SVG content for a given character with dynamic CDN fallback.
   */
  async fetchKanjiVgSvg(char: string): Promise<string> {
    if (!char) {
      throw new Error('Character is required');
    }

    // Check cache first
    if (this.svgCache.has(char)) {
      return this.svgCache.get(char)!;
    }

    const hex = this.getKanjiVgHex(char);
    const primaryUrl = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${hex}.svg`;
    const secondaryUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;

    try {
      // Attempt fetching from primary jsDelivr mirror
      const response = await fetch(primaryUrl);
      if (!response.ok) {
        throw new Error(`Failed to load from primary CDN: ${response.statusText}`);
      }
      const svgText = await response.text();
      this.svgCache.set(char, svgText);
      return svgText;
    } catch (primaryErr) {
      console.warn(`Primary CDN failed for '${char}' (${hex}), trying fallback...`, primaryErr);
      
      try {
        // Attempt fetching from fallback GitHub Raw CDN
        const response = await fetch(secondaryUrl);
        if (!response.ok) {
          throw new Error(`Failed to load from secondary CDN: ${response.statusText}`);
        }
        const svgText = await response.text();
        this.svgCache.set(char, svgText);
        return svgText;
      } catch (secondaryErr) {
        console.error(`Both CDNs failed to load stroke data for '${char}' (${hex})`, secondaryErr);
        throw new Error(`Không tìm thấy dữ liệu nét vẽ cho chữ '${char}'`);
      }
    }
  }
}

export const strokeOrderService = new StrokeOrderService();
export default strokeOrderService;
