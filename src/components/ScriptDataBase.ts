import { Monster } from "./Monster";
import { MonsterCommand } from "./MonsterCommand";
import { MonsterScriptHandler } from "./MonsterScriptHandler";

export class ScriptDataBase {
    public owner: Monster;
    public ctrl: MonsterScriptHandler;
    public scr1: MonsterCommand[][]; public idle: MonsterCommand[][]; public weak: MonsterCommand[][];
    constructor(m: Monster, ct: MonsterScriptHandler){
        //this is an array of an array of monstercommands
        //all monstercommands in the same array will run simultaneously
        //use the nextscript command in monstercommand.ts to go to the next array of monstercommands
        this.owner = m;
        this.ctrl = ct;
        this.scr1 = [[
            new MonsterCommand(this.owner, this.ctrl, [
            {key: "wait", value: [500], args: [], conditions: []},
            {key: "wait", value: [800], args: [], conditions: []},
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
            {key: "wait", value: [50], args: [], conditions: []},
            {key: "sound", value: [0.5], args: ["machinegun"], conditions: []},
            {key: "machinegunwide", value: [12,0,0,18000,8000,0,90], args: ["fish"], conditions: [true]},
            {key: "wait", value: [50], args: [], conditions: []},
            {key: "sound", value: [0.5], args: ["machinegun"], conditions: []},
            {key: "machinegunwide", value: [12,0,0,18000,8000,0,90], args: ["fish"], conditions: [true]},
            {key: "wait", value: [250], args: [], conditions: []},
            {key: "loop", value: [1], args: [], conditions: []}]),
            new MonsterCommand(this.owner, this.ctrl, [
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "travel", value: [500,200,1720,200,880], args: [], conditions: [false]},
                {key: "tsa", value: [], args: [], conditions: [false]},
                {key: "wait", value: [3500], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []}]),
        ],
        ];

        this.idle = [[
            new MonsterCommand(this.owner, this.ctrl, [
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "travel", value: [500,200,1720,200,880], args: [], conditions: [false]},
                {key: "tsa", value: [], args: [], conditions: [false]},
                {key: "wait", value: [3500], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []}]),
            ],
        ]

        this.weak = [[
            new MonsterCommand(this.owner, this.ctrl, [
                {key: "wait", value: [1500], args: [], conditions: []},
                {key: "travel", value: [250,200,1720,200,880], args: [], conditions: [false]},
                {key: "tsa", value: [], args: [], conditions: [false]},
                {key: "wait", value: [6500], args: [], conditions: []},
                {key: "loop", value: [0], args: [], conditions: []}]),
            ],
        ]
    };


    //this is done with a giant switch statement since i don't want to constantly test if a map contains keys
    fetchScript(key: string): MonsterCommand[][]{
        switch(key){
            case "sans": {return this.scr1;}
            case "idle": {return this.idle;}
            case "weak": {return this.weak;}
            default: {return this.idle;}
        }
    }
}