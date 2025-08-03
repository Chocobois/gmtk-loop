const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 0.424,
		bpm: 60,
	},
	m_first: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_draw: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_end: {
		offset: 0,
		bpm: 0,
		loop: false,
	},
	m_shop: {
		offset: 41860 / 48000,
		bpm: 86,
		loop: true,
		start: 41860 / 48000 + overlap,
		end: 2854884 / 48000 + overlap,
	},
	m_lightfast: {
		offset: 1348 / 48000,
		bpm: 160,
		loop: true,
		start: 6 + 1348 / 48000,
		end: 78 + 1348 / 48000,
	},
	m_map: {
		offset: 0.039,
		bpm: 110,
		loop: true,
		start: 26.221,
		end: 61.130,
	},
	m_title: {
		offset: 0.039,
		bpm: 92,
		loop: true,
		start: 6.269,
		end: 38.877,
	},
	m_map_select: {
		offset: 1348 / 44100,
		bpm: 160,
		loop: true,
		start: 6 + 1348 / 44100,
		end: 78 + 1348 / 44100,
	},
	m_fight: {
		offset: 0.039,
		bpm: 170,
		loop: true,
		start: 5.687,
		end: 50.863,
	},
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
	};
};

export default Data as MusicDataType;
