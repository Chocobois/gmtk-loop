import { Monster } from "./Monster";
import { MonsterCommand } from "./MonsterCommand";
import { ScriptDataBase } from "./ScriptDataBase";

export interface ScriptBit{
    key: string;
    index: number;
}

export class MonsterScriptHandler {
    public owner: Monster;
    public script: MonsterCommand[];
    public scriptList: MonsterCommand[][];
    public currentScript: number = 0;

    private scriptbase: ScriptDataBase;
    public pending: boolean = false;
    constructor(m: Monster, key: string = ""){
        //eventually we'll use the key to grab 
        this.owner = m;

        this.scriptbase = new ScriptDataBase(this.owner,this);
        this.scriptList = this.scriptbase.fetchScript(key);
        this.script = this.scriptList[this.currentScript];
    }

    update(t: number, d: number){
        this.processScript(t, d);
    }

    processScript(t: number, d: number){
        for(let l = 0; l < this.script.length; l++) {
            this.script[l].update(t,d);
        }
    }
    
    advanceActions() {
        if(this.currentScript < (this.scriptList.length-1)) {
            this.currentScript++;
            this.script = [];
            this.script = this.scriptList[this.currentScript];
        }
    }

    changeScript(n: number) { // go to different script in same list
        if(n >= this.scriptList.length) {
            n = this.scriptList.length-1;
        }
        if(n < 0) {
            n = 0;
        }
        for(let l = 0; l < this.script.length; l++) {
            this.script[l].resetVariables();
        }
        console.log("EXECUTING SCRIPT:  "+ n);
        this.currentScript = n;
        this.script = this.scriptList[n];
        this.resetScripts();
    }

    swapScript(key: string) { //swap out the whole list
        this.resetScripts();
        this.scriptList = this.scriptbase.fetchScript(key);
        this.currentScript = 0;
        this.script = this.scriptList[0];
        this.resetScripts();
    }

    constructScript(bits: ScriptBit[]) { //make custom scripts from tidbits - format is key, index or -1 for the whole thing
        this.resetScripts();
        this.currentScript = 0;
        this.scriptList = [];
        let t = [];
        for(let i = 0; i < bits.length; i++){
            t = this.scriptbase.fetchScript(bits[i].key);
            if(bits[i].index < t.length) {
                if(bits[i].index >= 0) {
                    this.scriptList.push(t[bits[i].index]);
                } else {
                    this.scriptList.concat(t);
                }
            }
        }
        this.script = this.scriptList[0];
        this.resetScripts();
    }

    resetScripts(){
        for(let l = 0; l < this.script.length; l++) {
            this.script[l].resetVariables();
        }
    }
}