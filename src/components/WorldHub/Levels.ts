import { LevelDefinition } from "./LevelDefinition";

export const levels = [
	{
		x: 400,
		y: 540,
		title: "Snail",
		key: "1",
		require: [],
		enemy: "snail",
		background: "background_plains_0",
	},
	{
		x: 800,
		y: 340,
		title: "Snake",
		key: "2a",
		require: ["1"],
		enemy: "snake",
		background: "background_ice",
	},
	{
		x: 800,
		y: 740,
		title: "Mole",
		key: "2b",
		require: ["1"],
		enemy: "mole",
		background: "background_plains_2",
	},
	{
		x: 1200,
		y: 340,
		title: "Jester",
		key: "3a",
		require: ["2a"],
		enemy: "jester",
		background: "background_plains_4",
	},
	{
		x: 1200,
		y: 740,
		title: "Abra",
		key: "3b",
		require: ["2b"],
		enemy: "abra",
		background: "background_magma",
	},
	{
		x: 1600,
		y: 540,
		title: "Boss",
		key: "4",
		require: ["3a", "3b"],
		enemy: "",
		background: "background_stone",
	},
] as const satisfies LevelDefinition[];

export type LevelKeys = typeof levels[number]["key"];
export type LevelKeysList<T> = { [K in LevelKeys]: T};