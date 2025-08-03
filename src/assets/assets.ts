import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/battlefloor/grassyplains.jpg", "background_plains_0"),
	image("backgrounds/battlefloor/grassyplains_alt1.jpg", "background_plains_1"),
	image("backgrounds/battlefloor/grassyplains_alt2.jpg", "background_plains_2"),
	image("backgrounds/battlefloor/grassyplains_alt3.jpg", "background_plains_3"),
	image("backgrounds/battlefloor/grassyplains_alt4.jpg", "background_plains_4"),

	image("backgrounds/battlefloor/snow.jpg", "background_snow"),
	image("backgrounds/battlefloor/ice.jpg", "background_ice"),
	image("backgrounds/battlefloor/magma.jpg", "background_magma"),
	image("backgrounds/battlefloor/stone.jpg", "background_stone"),
	image("backgrounds/battlefloor/rock.jpg", "background_rock"),

	image("backgrounds/shelves.png", "background_shelves"),

	// Pearls
	image("pearls/shell_inner.png", "pearl_shell_inner"),
	image("pearls/shell_outer.png", "pearl_shell_outer"),
	image("pearls/none.png", "pearl_none"),
	image("pearls/coil.png", "pearl_coil"),
	image("pearls/fire.png", "pearl_fire"),
	image("pearls/ice.png", "pearl_ice"),
	image("pearls/psychic.png", "pearl_psychic"),
	image("pearls/rock.png", "pearl_rock"),
	image("pearls/water.png", "pearl_water"),

	// Sans
	image("characters/sans/enemy_1.png", "enemy_1"),	
	image("characters/runes/r0.png", "r0"),
	image("characters/runes/r1.png", "r1"),
	image("characters/runes/r2.png", "r2"),
	image("characters/runes/r3.png", "r3"),
	image("characters/runes/r4.png", "r4"),
	image("characters/runes/r5.png", "r5"),
	image("characters/runes/r6.png", "r6"),
	image("characters/runes/r7.png", "r7"),
	image("characters/runes/r8.png", "r8"),
	image("characters/runes/r9.png", "r9"),

	// Snail
	image("characters/snail/snailenemy.png", "escargot"),

	// Wolf
	image("characters/wolf/wolf.png", "wolf"),
	image("characters/wolf/iceberg.png", "iceberg"),
	image("characters/wolf/c1.png", "c1"),
	image("characters/wolf/c2.png", "c2"),
	image("characters/wolf/c3.png", "c3"),
	image("characters/wolf/c4.png", "c4"),

	// Snake
	image("characters/snake/snake.png", "snake"),

	// Mole
	image("characters/mole/boss_1.png", "mole_boss_1"),
	image("characters/mole/boss_2.png", "mole_boss_2"),
	image("characters/mole/fake_1.png", "mole_fake_1"),
	image("characters/mole/fake_2.png", "mole_fake_2"),
	image("characters/mole/dirt.png", "mole_dirt"),

	// Jester
	image("characters/jester/idle.png", "jester_idle"),
	image("characters/jester/charge.png", "jester_charge"),
	image("characters/jester/attack.png", "jester_attack"),
	image("characters/jester/stunned.png", "jester_stunned"),
	image("characters/jester/dead.png", "jester_dead"),
	image("characters/jester/card_heart.png", "jester_card_heart"),
	image("characters/jester/card_diamond.png", "jester_card_diamond"),
	image("characters/jester/card_club.png", "jester_card_club"),
	image("characters/jester/card_spade.png", "jester_card_spade"),

	// Abra
	image("characters/abra/idle.png", "abra_idle"),
	image("characters/abra/active.png", "abra_active"),
	image("characters/abra/hurt.png", "abra_hurt"),

	// Bat
	image("characters/bat/bat fly1.png", "bat_fly_1"),
	image("characters/bat/bat fly2.png", "bat_fly_2"),
	image("characters/bat/bat fly3.png", "bat_fly_3"),
	image("characters/bat/bat fly4.png", "bat_fly_4"),

	image("characters/bat/bat sit1.png", "bat_sit_1"),
	image("characters/bat/bat sit2.png", "bat_sit_2"),
	image("characters/bat/bat sit3.png", "bat_sit_3"),
	image("characters/bat/bat sit4.png", "bat_sit_4"),
	
	image("characters/bat/bat get up1.png", "bat_get_up_1"),
	image("characters/bat/bat get up2.png", "bat_get_up_2"),
	image("characters/bat/bat get up3.png", "bat_get_up_3"),
	image("characters/bat/bat get up4.png", "bat_get_up_4"),

	image("characters/bat/bat attack.png", "bat_attack"),

	// Badger
	image("characters/badger/badger idle1.png", "badger_idle_1"),
	image("characters/badger/badger idle2.png", "badger_idle_2"),
	image("characters/badger/badger idle3.png", "badger_idle_3"),
	image("characters/badger/badger idle4.png", "badger_idle_4"),
	
	image("characters/badger/badger dig1.png", "badger_dig_1"),
	image("characters/badger/badger dig2.png", "badger_dig_2"),
	image("characters/badger/badger dig3.png", "badger_dig_3"),
	image("characters/badger/badger dig4.png", "badger_dig_4"),
	
	image("characters/badger/badger hole.png", "badger_hole"),
	image("characters/badger/dirtmound.png", "dirtmound"),

	// Badger ice alt
	image("characters/badger/badger alt idle1.png", "badger_ice_idle_1"),
	image("characters/badger/badger alt idle2.png", "badger_ice_idle_2"),
	image("characters/badger/badger alt idle3.png", "badger_ice_idle_3"),
	image("characters/badger/badger alt idle4.png", "badger_ice_idle_4"),
	
	image("characters/badger/badger alt dig1.png", "badger_ice_dig_1"),
	image("characters/badger/badger alt dig2.png", "badger_ice_dig_2"),
	image("characters/badger/badger alt dig3.png", "badger_ice_dig_3"),
	image("characters/badger/badger alt dig4.png", "badger_ice_dig_4"),
	
	image("characters/badger/badger alt hole.png", "badger_ice_hole"),
	image("characters/badger/snowmound.png", "snowmound"),


	
	image("characters/enemyshadow.png", "enemy_shadow"),

	// Items
	image("items/pbullet.png", "pbullet"),
	// image("items/spellback.png", "spellback"),
	// image("items/spellhighlight.png", "spellhighlight"),

	// UI
	image("ui/cursor.png", "cursor"),
	image("ui/lose.png", "lose"),
	image("ui/win.png", "win"),
	image("ui/question.png", "question"),

	// World hub
	image("worldhub/level.png", "hub_level"),
	image("worldhub/menu.png", "hub_foreground"),

	// Titlescreen
	image("titlescreen/sky.png", "title_sky"),
	image("titlescreen/loop.png", "title_loop"),
	image("titlescreen/title3.png", "title_logo"),
	image("titlescreen/dragon.png", "title_dragon"),

	// Particles
	image("particles/light.png", "light"),
	image("particles/circle.png", "circle"),
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
	music("lightfast", "m_lightfast"),
	music("title_fade", "m_title"),
	music("fight", "m_fight"),
	music("map", "m_map"),

	sound("machinegun", "machinegun", 0.5),
	sound("game_over", "game_over", 0.5),
	sound("victory", "victory", 0.5),

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

	sound("ui/titlescreen", "u_game_start"),
	sound("ui/what", "u_question"),
	sound("ui/disabled", "u_disabled"),

	sound("hub/map_select", "h_map_select"),
	sound("hub/map_select_evil", "h_map_select_multiple"),

	sound("pearl/equip", "p_equip"),
	sound("pearl/clink", "p_unequip"),
	sound("pearl/shop_enter", "p_shop_enter"),

	sound("pearl/pearl_fire", "p_fire"),
	sound("pearl/pearl_coil", "p_coil"),
	sound("pearl/pearl_psychic", "p_psychic"),
	sound("pearl/pearl_rock", "p_rock"),
	sound("pearl/pearl_water", "p_water"),

	sound("enemy/hurt", "e_hit_generic"),
	sound("enemy/snail_shell", "e_snail_shell"),
	sound("enemy/gaster", "e_gaster"),
	sound("enemy/boom", "e_boom"),
	sound("tele", "tele"),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
