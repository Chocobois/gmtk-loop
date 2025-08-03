import { makeAutoObservable } from "mobx";
import { pearlState } from "./PearlState";
import { PearlElement } from "@/components/pearls/PearlElement";

class LoopState {
	health = 100; // Current player health
	maxHealth = 100; // Maximum player health

	maxLength = 1600; // Maximum length of the loop

	constructor() {
		makeAutoObservable(this);
	}

	// Player loop damage
	get attackPower() {
		if (pearlState.currentPearl.element == PearlElement.Fire) {
			return 150;
		} else {
			return 100;
		}
	}
}

export const loopState = new LoopState();
