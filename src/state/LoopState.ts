import { makeAutoObservable } from "mobx";

class LoopState {
	health = 100; // Current player health
	maxHealth = 100; // Maximum player health

	maxLength = 1600; // Maximum length of the loop
	attackPower = 100; // Player loop damage

	constructor() {
		makeAutoObservable(this);
	}
}

export const loopState = new LoopState();
