import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/background", "background"),
	image("backgrounds/bz", "bz"),

	// Characters
	image("characters/player", "player"),
	image("characters/enemy_1", "enemy_1"),
	image("characters/runes/r0", "r0"),
	image("characters/runes/r1", "r1"),
	image("characters/runes/r2", "r2"),
	image("characters/runes/r3", "r3"),
	image("characters/runes/r4", "r4"),
	image("characters/runes/r5", "r5"),
	image("characters/runes/r6", "r6"),
	image("characters/runes/r7", "r7"),
	image("characters/runes/r8", "r8"),
	image("characters/runes/r9", "r9"),

	// Items
	image("items/coin", "coin"),
	image("items/pbullet", "pbullet"),
	image("items/spellback", "spellback"),
	image("items/spellhighlight", "spellhighlight"),

	// UI
	image("ui/hud", "hud"),
	image("ui/cursor", "cursor"),

	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/background", "title_background"),
	image("titlescreen/foreground", "title_foreground"),
	image("titlescreen/character", "title_character"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [];

/* Audios */
const audios: Audio[] = [
	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
	sound("tree/machinegun", "machinegun", 0.5),
];

/* Fonts */
await loadFont("Sketch", "Game Font");

export { images, spritesheets, audios };
