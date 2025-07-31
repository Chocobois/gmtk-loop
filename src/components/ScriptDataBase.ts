import { Monster } from "./Monster";
import { MonsterCommand } from "./MonsterCommand";
import { MonsterScriptHandler } from "./MonsterScriptHandler";

export class ScriptDataBase {
    public owner: Monster;
    public ctrl: MonsterScriptHandler;
    public scr1: MonsterCommand[][];
    constructor(m: Monster, ct: MonsterScriptHandler){
        this.owner = m;
        this.ctrl = ct;
        this.scr1 = [
            [new MonsterCommand(this.owner, this.ctrl, [
            {key: "wait", value: [500], args: [], conditions: []},
            {key: "wait", value: [1000], args: [], conditions: []},
            {key: "storeRandom", value: [1], args: ["fish"], conditions: []},
            {key: "warnCardinalSlice", value: [0,0,500,250,90,1600], args: ["fish"], conditions: [true]},
            {key: "wait", value: [750], args: [], conditions: []},
            {key: "sound", value: [0.5], args: ["machinegun"], conditions: []},
            {key: "machinegunwide", value: [12,0,0,18000,8000,0,90], args: ["fish"], conditions: [true]},
            {key: "wait", value: [50], args: [], conditions: []},
            {key: "sound", value: [0.5], args: ["machinegun"], conditions: []},
            {key: "machinegunwide", value: [12,0,0,18000,8000,0,90], args: ["fish"], conditions: [true]},
            {key: "wait", value: [50], args: [], conditions: []},
            {key: "sound", value: [0.5], args: ["machinegun"], conditions: []},
            {key: "machinegunwide", value: [12,0,0,18000,8000,0,90], args: ["fish"], conditions: [true]},
            {key: "wait", value: [150], args: [], conditions: []},
            {key: "loop", value: [1], args: [], conditions: []}])],
        ];
    }

    //this is done with a giant switch statement since i don't want to constantly test if a map contains keys
    fetchScript(key: string): MonsterCommand[][]{
        switch(key){
            case "sans": {return this.scr1;}
            default: {return this.scr1;}
        }
    }
}