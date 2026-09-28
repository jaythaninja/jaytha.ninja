// Shared with the code rain and the decode scramble. Ported from the mock.
export const RAIN_GLYPHS = "0123456789{}[]<>/\\=+*:;.-_#$%&@abcdefhjknrstuvxyz".split("");

export const randomGlyph = () => RAIN_GLYPHS[Math.floor(Math.random() * RAIN_GLYPHS.length)];
