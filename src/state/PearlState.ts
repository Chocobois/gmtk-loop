import { makeAutoObservable } from "mobx";

export class PearlState {
	pearlLoopColor: number = 0xffffff;
	pearlLineColor: number = 0xffffff;

    constructor() {
        makeAutoObservable(this);
    }
}

export const pearlState = new PearlState();