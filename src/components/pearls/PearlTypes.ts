import { Color } from "@/util/colors";
import { PearlElement } from "./PearlElement";

export type PearlType = {
	element: PearlElement;
	image: string;
	pearlColor: number;
	lineColor: number;
	loopColor: number;
	shopX: number;
	shopY: number;
};

export const PearlTypes = {
	[PearlElement.None]: {
		element: PearlElement.None,
		image: "pearl_none",
		pearlColor: Color.Slate300,
		lineColor: Color.White,
		loopColor: Color.White,
		shopX: 0,
		shopY: 0,
	},
	[PearlElement.Coil]: {
		element: PearlElement.Coil,
		image: "pearl_coil",
		pearlColor: Color.Pink400,
		lineColor: Color.Pink200,
		loopColor: Color.Pink200,
		shopX: 500,
		shopY: 300,
	},
	[PearlElement.Fire]: {
		element: PearlElement.Fire,
		image: "pearl_fire",
		pearlColor: Color.Red600,
		lineColor: Color.Red400,
		loopColor: Color.Red400,
		shopX: 1000,
		shopY: 300,
	},
	[PearlElement.Psychic]: {
		element: PearlElement.Psychic,
		image: "pearl_psychic",
		pearlColor: Color.Violet700,
		lineColor: Color.Violet300,
		loopColor: Color.Violet300,
		shopX: 1500,
		shopY: 300,
	},
	[PearlElement.Rock]: {
		element: PearlElement.Rock,
		image: "pearl_rock",
		pearlColor: Color.Amber800,
		lineColor: Color.Amber200,
		loopColor: Color.Amber200,
		shopX: 500,
		shopY: 600,
	},
	[PearlElement.Water]: {
		element: PearlElement.Water,
		image: "pearl_water",
		pearlColor: Color.Blue500,
		lineColor: Color.Blue200,
		loopColor: Color.Blue200,
		shopX: 1000,
		shopY: 600,
	},
} as const satisfies Record<PearlElement, PearlType>;
