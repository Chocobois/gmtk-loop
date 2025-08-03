import { makeAutoObservable } from "mobx";
import { PearlType, PearlTypes } from "@/components/pearls/PearlTypes";
import { PearlElement } from "@/components/pearls/PearlElement";

export class PearlState {
	// Currently used pearl
	currentPearl: PearlType = PearlTypes[PearlElement.None];

	// Map over which pearls have been obtained
	acquiredPearls: {
		[key in PearlElement]: boolean;
	};

	constructor() {
		// TODO: Save and load to localStorage
		this.acquiredPearls = {
			[PearlElement.None]: true,
			[PearlElement.Coil]: !!localStorage.getItem(PearlElement.Coil.toString()),
			[PearlElement.Fire]: !!localStorage.getItem(PearlElement.Fire.toString()),
			[PearlElement.Psychic]: !!localStorage.getItem(PearlElement.Psychic.toString()),
			[PearlElement.Rock]: !!localStorage.getItem(PearlElement.Rock.toString()),
			[PearlElement.Water]: !!localStorage.getItem(PearlElement.Water.toString()),
		};

		makeAutoObservable(this);
	}

	// True if any pearl has been acquired (ignoring Pearl.None)
	get anyPearlsUnlocked(): boolean {
		return Object.values(this.acquiredPearls).filter(Boolean).length >= 2;
	}

	// True if all pearls have been acquired
	get allPearlsUnlocked(): boolean {
		return Object.values(this.acquiredPearls).every(Boolean);
	}
}

export const pearlState = new PearlState();
