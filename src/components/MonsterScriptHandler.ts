import { Monster } from "./Monster";
import { MonsterCommand } from "./MonsterCommand";
import { ScriptDataBase } from "./ScriptDataBase";

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

    changeScript(n: number) {
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
    }
}