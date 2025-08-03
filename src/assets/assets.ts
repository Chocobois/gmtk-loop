import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/battlefloor/grassyplains", "background_plains_0"),
	image("backgrounds/battlefloor/grassyplains_alt1", "background_plains_1"),
	image("backgrounds/battlefloor/grassyplains_alt2", "background_plains_2"),
	image("backgrounds/battlefloor/grassyplains_alt3", "background_plains_3"),
	image("backgrounds/battlefloor/grassyplains_alt4", "background_plains_4"),

	image("backgrounds/battlefloor/stone", "background_stone_0"),
	image("backgrounds/battlefloor/ice", "background_ice"),
	image("backgrounds/battlefloor/magma", "background_magma"),
	image("backgrounds/battlefloor/stone", "background_stone"),
	image("backgrounds/battlefloor/rock", "background_rock"),

	image("backgrounds/shelves", "background_shelves"),

	// Pearls
	image("pearls/shell_inner", "pearl_shell_inner"),
	image("pearls/shell_outer", "pearl_shell_outer"),
	image("pearls/none", "pearl_none"),
	image("pearls/coil", "pearl_coil"),
	image("pearls/fire", "pearl_fire"),
	image("pearls/psychic", "pearl_psychic"),
	image("pearls/rock", "pearl_rock"),
	image("pearls/water", "pearl_water"),

	// Sans
	image("characters/sans/enemy_1", "enemy_1"),	
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

	// Snail
	image("characters/snail/snailenemy", "escargot"),

	// Wolf
	image("characters/wolf/wolf", "wolf"),
	image("characters/wolf/iceberg", "iceberg"),
	image("characters/wolf/c1", "c1"),
	image("characters/wolf/c2", "c2"),
	image("characters/wolf/c3", "c3"),
	image("characters/wolf/c4", "c4"),

	// Snake
	image("characters/snake/snake", "snake"),

	// Mole
	image("characters/mole/boss_1", "mole_boss_1"),
	image("characters/mole/boss_2", "mole_boss_2"),
	image("characters/mole/fake_1", "mole_fake_1"),
	image("characters/mole/fake_2", "mole_fake_2"),
	image("characters/mole/dirt", "mole_dirt"),

	// Jester
	image("characters/jester/idle", "jester_idle"),
	image("characters/jester/charge", "jester_charge"),
	image("characters/jester/attack", "jester_attack"),
	image("characters/jester/stunned", "jester_stunned"),
	image("characters/jester/dead", "jester_dead"),
	image("characters/jester/card_heart", "jester_card_heart"),
	image("characters/jester/card_diamond", "jester_card_diamond"),
	image("characters/jester/card_club", "jester_card_club"),
	image("characters/jester/card_spade", "jester_card_spade"),

	// Abra
	image("characters/abra/idle", "abra_idle"),
	image("characters/abra/active", "abra_active"),
	image("characters/abra/hurt", "abra_hurt"),

	// Bat
	image("characters/bat/bat fly1", "bat_fly_1"),
	image("characters/bat/bat fly2", "bat_fly_2"),
	image("characters/bat/bat fly3", "bat_fly_3"),
	image("characters/bat/bat fly4", "bat_fly_4"),

	image("characters/bat/bat sit1", "bat_sit_1"),
	image("characters/bat/bat sit2", "bat_sit_2"),
	image("characters/bat/bat sit3", "bat_sit_3"),
	image("characters/bat/bat sit4", "bat_sit_4"),
	
	image("characters/bat/bat get up1", "bat_get_up_1"),
	image("characters/bat/bat get up2", "bat_get_up_2"),
	image("characters/bat/bat get up3", "bat_get_up_3"),
	image("characters/bat/bat get up4", "bat_get_up_4"),

	image("characters/bat/bat attack", "bat_attack"),

	// Badger
	image("characters/badger/badger idle1", "badger_idle_1"),
	image("characters/badger/badger idle2", "badger_idle_2"),
	image("characters/badger/badger idle3", "badger_idle_3"),
	image("characters/badger/badger idle4", "badger_idle_4"),
	
	image("characters/badger/badger dig1", "badger_dig_1"),
	image("characters/badger/badger dig2", "badger_dig_2"),
	image("characters/badger/badger dig3", "badger_dig_3"),
	image("characters/badger/badger dig4", "badger_dig_4"),
	
	image("characters/badger/badger hole", "badger_hole"),
	image("characters/badger/dirtmound", "dirtmound"),

	// Badger ice alt
	image("characters/badger/badger alt idle1", "badger_ice_idle_1"),
	image("characters/badger/badger alt idle2", "badger_ice_idle_2"),
	image("characters/badger/badger alt idle3", "badger_ice_idle_3"),
	image("characters/badger/badger alt idle4", "badger_ice_idle_4"),
	
	image("characters/badger/badger alt dig1", "badger_ice_dig_1"),
	image("characters/badger/badger alt dig2", "badger_ice_dig_2"),
	image("characters/badger/badger alt dig3", "badger_ice_dig_3"),
	image("characters/badger/badger alt dig4", "badger_ice_dig_4"),
	
	image("characters/badger/badger alt hole", "badger_ice_hole"),
	image("characters/badger/snowmound", "snowmound"),


	
	image("characters/enemyshadow", "enemy_shadow"),

	// Items
	image("items/pbullet", "pbullet"),
	// image("items/spellback", "spellback"),
	// image("items/spellhighlight", "spellhighlight"),

	// UI
	image("ui/cursor", "cursor"),
	image("ui/lose", "lose"),
	image("ui/win", "win"),
	image("ui/question", "question"),

	// World hub
	image("worldhub/level", "hub_level"),

	// Titlescreen
	image("titlescreen/sky", "title_sky"),
	image("titlescreen/grass", "title_background"),
	image("titlescreen/title3", "title_foreground"),
	image("titlescreen/dragon", "title_character"),

	// Particles
	image("particles/light", "light"),
	image("particles/circle", "circle"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("characters/sans/sansplane", "sansplane", 256, 196),
	spritesheet("characters/snail/snail", "snail", 256, 256),
	// spritesheet("characters/wolf_old", "wolf", 256, 256),
	spritesheet("effects/boom", "boom", 512, 512),

	// Particles
	spritesheet("particles/bubbles", "bubbles", 128, 128),
	spritesheet("particles/smoke3", "smoke", 128, 128),
	spritesheet("particles/sparkles", "sparkles", 128, 128),
	spritesheet("particles/flame3", "flame", 32, 32),
];

/* Audios */
const audios: Audio[] = [
	music("title", "m_main_menu"),
	music("first", "m_first"),
	music("lightfast", "m_lightfast"),

	music("fight", "m_fight"),
	music("map", "m_map"),

	sound("machinegun", "machinegun", 0.5),
	sound("game_over", "game_over", 0.5),
	sound("victory", "victory", 0.5),

	sound("tree/rustle", "t_rustle", 0.5),
	sound("drawing/sine", "d_sine", 0.3),
	sound("drawing/brush", "d_brush"),
	sound("drawing/raise", "d_raise"),
	sound("drawing/tap", "d_tap"),
	sound("drawing/break", "d_break"),

	sound("combo/combo1", "d_combo_1"),
	sound("combo/combo2", "d_combo_2"),
	sound("combo/combo3", "d_combo_3"),
	sound("combo/combo4", "d_combo_4"),
	sound("combo/combo5", "d_combo_5"),
	sound("combo/combo6", "d_combo_6"),
	sound("combo/combo7", "d_combo_7"),
	sound("combo/combo_lost", "d_combo_lost"),

	sound("ui/screen_transition", "u_level_enter"),
	sound("ui/what", "u_question"),
	sound("ui/disabled", "u_disabled"),

	sound("hub/map_select", "h_map_select"),
	sound("hub/map_select_evil", "h_map_select_multiple"),

	// Todo: play extra hitsounds based on what pearl is equipped
	sound("pearl/pearl_fire", "p_fire"),
	sound("pearl/pearl_coil", "p_coil"),
	sound("pearl/pearl_psychic", "p_psychic"),
	sound("pearl/pearl_rock", "p_rock"),
	sound("pearl/pearl_water", "p_water"),

	sound("enemy/hurt", "e_hit_generic"),
	sound("enemy/snail_shell", "e_snail_shell"),
	sound("tele", "tele"),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
