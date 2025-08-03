export type LevelDefinition = {
	x: number;
	y: number;
	title: string;
	key: string;
	require: string[];
	enemy: string;
	background: string;
	music: "m_fight" | "m_lightfast";
};
