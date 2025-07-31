import { LevelDefinition } from "./LevelDefinition";

export const levels: LevelDefinition[] = [
	{
		x: 400,
		y: 540,
		title: "Tutorial",
		key: "1",
		require: [],
		enemy: "tutorial",
	},
	{
		x: 800,
		y: 340,
		title: "Apple",
		key: "2a",
		require: ["1"],
		enemy: "example",
	},
	{
		x: 800,
		y: 740,
		title: "Banana",
		key: "2b",
		require: ["1"],
		enemy: "example",
	},
	{
		x: 1200,
		y: 340,
		title: "Cherry",
		key: "3a",
		require: ["2a"],
		enemy: "example",
	},
	{
		x: 1200,
		y: 740,
		title: "Grape",
		key: "3b",
		require: ["2b"],
		enemy: "example",
	},
	{
		x: 1600,
		y: 540,
		title: "Boss",
		key: "4",
		require: ["3a", "3b"],
		enemy: "boss",
	},
];
