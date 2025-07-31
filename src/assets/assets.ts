import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/background", "background"),
	image("backgrounds/bz", "bz"),
	
	// Biomes, combat background
	image("backgrounds/battlefloor/grassyplains", "background_plains_0"),
	image("backgrounds/battlefloor/grassyplains_alt1", "background_plains_1"),
	image("backgrounds/battlefloor/grassyplains_alt2", "background_plains_2"),
	image("backgrounds/battlefloor/grassyplains_alt3", "background_plains_3"),
	image("backgrounds/battlefloor/grassyplains_alt4", "background_plains_4"),

	image("backgrounds/battlefloor/stone", "background_stone_0"),

	// Characters
	image("characters/player", "player"),

	//Runes
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

	// Monsters
	// Planning on making monsters a 1 file spritesheet
	
	image("characters/enemy/placeholder_enemy", "enemy_placeholder"),
		// Attacks
	image("characters/hazards/placeholder_attack", "projectile_placeholder"),
		// Hazards (spritesheets 512px * Y (how many frames))
	image("characters/hazards/placeholder_hazard", "hazard_placeholder"), 

	// Items
	image("items/coin", "coin"),
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
];

/* Fonts */
await loadFont("Sketch", "Game Font");

export { images, spritesheets, audios };
