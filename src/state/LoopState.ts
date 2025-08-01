import { makeAutoObservable } from "mobx";

class LoopState {
	maxLength = 1600; // Maximum length of the loop
	attackPower = 100; // Player loop damage

	constructor() {
		makeAutoObservable(this);
	}
}

export const loopState = new LoopState();
