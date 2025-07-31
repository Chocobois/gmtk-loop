/*
import { Boss } from "./Boss"
import { CollideEnemy } from "./CollideEnemy";
import { DiceEnemy } from "./DiceEnemy";
import { DeflectionShield } from "./DeflectionShield";
import { BallisticMissile } from "./BallisticMissile";
import { CircleEffect } from "./CircleEffect";
import { Mine } from "./Mine";
import { RandomWalkEnemy } from "./RandomWalkEnemy";
import { EnemyProjectile } from "./EnemyProjectile";
import { EnemyRay } from "./EnemyRay";
import { Mandala } from "./Mandala";
import { CrossEnemy } from "./CrossEnemy";
import { SplitBullet } from "./SplitBullet";
import { BushEnemy } from "./BushEnemy";
import { TextEffect } from "./TextEffect";
import { Blaster } from "./Blaster";
import { FallingEnemy } from "./FallingEnemy";
import { SnailEnemy } from "./SnailEnemy";
import { ShadowedBullet } from "./ShadowedBullet";
import { FollowCircleEffect } from "./FollowCircleEffect";
import { RotatingPan } from "./RotatingPan";
import { BasicEffect } from "./BasicEffect";
import { ParticleEffect } from "./ParticleEffect";
import { Trojan } from "./Trojan";
import { ExpandingProjectile } from "./ExpandingProjectile";
import { Turret } from "./Turret";
import { Turtle } from "./Turtle";
import { TitleEffect } from "./TitleEffect";
*/

import { Bullet } from "./Bullet";
import { Monster } from "./Monster";
import { MonsterScriptHandler } from "./MonsterScriptHandler";
import { WedgeIndicator } from "./Indicators/WedgeIndicator";

export interface MonsterAction{
    key: string;
    value: number[];
    args: string[];
    conditions: boolean[];
}

export class MonsterCommand
{
    public owner: Monster;
    public control: MonsterScriptHandler;
    private pend: boolean = false;
    private timer: number = 0;

    private hpThreshold: number = 0;
    private waitForHP: number = 0;
    private isLooping: number = 0;
    public deleteFlag: boolean = false;
    public step: number = 0;
    private variableMap: Map<string,MonsterAction>;

    public cmd: MonsterAction[];

    constructor(m: Monster, ctrl: MonsterScriptHandler, c: MonsterAction[]){
        this.owner = m;
        this.control = ctrl;
        this.cmd = c;
        this.variableMap = new Map<string,MonsterAction>();
    }

    update(t: number, d: number) {
        this.parseCommand(t,d);
    }

    advance() {
        this.step++;
        if(this.step >= this.cmd.length) {
            this.step = this.cmd.length-1;
            this.pend = true;
        }
    }

    parseCommand(t: number, d: number){
        //console.log("delta: " + d);
        switch(this.cmd[this.step].key){
            case "wait": {
                if(this.timer > 0 && this.pend) {
                    this.timer -= d;
                    if(this.timer <= 0) {
                        this.timer = 0;
                        this.pend = false;
                        this.advance();
                    }
                } else if (this.timer <= 0 && !this.pend) {
                    this.timer = this.cmd[this.step].value[0];
                    this.pend = true;
                }
                break;
            }   case "sound": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.sound.play(this.cmd[this.step].args[0], {volume: this.cmd[this.step].value[0]});
                this.advance();
                break;
            }   case "machinegunwide": {
                //values: amount, x, y, velocity, variance (+/- amount), center angle, width
                //args: key conditions: follow y/n
                if(this.pend) {
                    break;
                }
                let stored = false;
                let ns = [Math.random()];
                if(this.variableMap.has(this.cmd[this.step].args[0])){
                    ns = this.variableMap.get(this.cmd[this.step].args[0])!.value;
                    stored = true;
                }
                let xx = this.cmd[this.step].value[1];
                let yy = this.cmd[this.step].value[2];
                if(this.cmd[this.step].conditions[0])
                {
                    xx += this.owner.x;
                    yy += this.owner.y;
                }
                let center = 0;
                switch(Math.trunc(ns[0]*4)){
                    case 0: {center = 0; break;}
                    case 1: {center = 90; break;}
                    case 2: {center = 180; break;}
                    case 3: {center = 270; break;}
                    default: {break;}
                }
                let theta = 0;
                for(let l = 0; l < this.cmd[this.step].value[0]; l++){
                    if(stored){
                        theta = center+this.cmd[this.step].value[5]-(this.cmd[this.step].value[6]/2)+(Math.random()*(this.cmd[this.step].value[6]));
                    } else {
                        theta = this.cmd[this.step].value[5]-(this.cmd[this.step].value[6]/2)+(Math.random()*(this.cmd[this.step].value[6]));
                    }
                    this.owner.scene.pushProjectile(new Bullet(this.owner.scene,xx,yy, 
                        this.cmd[this.step].value[3]-this.cmd[this.step].value[4]+(Math.random()*2*this.cmd[this.step].value[4]), theta));
                }
                this.advance();
                break;
            }   case "warnCardinalSlice": {
                //parameters: args: key, conditions: follow
                if(this.pend) {
                    break;
                }
                let ns = [Math.random()];
                if(this.variableMap.has(this.cmd[this.step].args[0])){
                    ns = this.variableMap.get(this.cmd[this.step].args[0])!.value;
                }
                let center = 0;
                switch(Math.trunc(ns[0]*4)){
                    case 0: {center = 0; break;}
                    case 1: {center = 90; break;}
                    case 2: {center = 180; break;}
                    case 3: {center = 270; break;}
                    default: {break;}
                }
                let xx = this.cmd[this.step].value[0];
                let yy = this.cmd[this.step].value[1];
                if(this.cmd[this.step].conditions[0])
                {
                    xx += this.owner.x;
                    yy += this.owner.y;
                }
                this.owner.scene.pushIndicator(new WedgeIndicator(this.owner.scene,xx,yy,this.cmd[this.step].value[2],this.cmd[this.step].value[3],
                    this.cmd[this.step].value[4],center,this.cmd[this.step].value[5],this.owner,this.cmd[this.step].conditions[0]));
                this.advance();
                break;
            }   case "storeRandom": {
                if(this.pend) {
                    break;
                }
                //this just stores random numbers, only parameter is the amount and the key
                let tmp = {
                    key: this.cmd[this.step].args[0],
                    value: [Math.random()],
                    args: [""],
                    conditions: [false],
                }
                for(let i = 1; i < this.cmd[this.step].value[0]; i++){
                    tmp.value.push(Math.random());
                }
                this.variableMap.set(this.cmd[this.step].args[0],tmp);
                this.advance();
                break;
            }   case "store": {
                if(this.pend) {
                    break;
                }
                //stores whatever you want, first arg is the key
                let tmp = {
                    key: this.cmd[this.step].args[0],
                    value: this.cmd[this.step].value,
                    args: this.cmd[this.step].args,
                    conditions: this.cmd[this.step].conditions,
                }
                this.variableMap.set(this.cmd[this.step].args[0],tmp);
                this.advance();
                break;
            }   case "loop": {
                if(this.pend) {
                    break;
                }
                this.step = this.cmd[this.step].value[0];
                break;
            }   case "resetVars": {
                if(this.pend) {
                    break;
                }
                //deletes ALL variables, use sparingly
                this.resetVariables();
                this.advance();
                break;
            }   case "nextScript": {
                if(this.pend) {
                    break;
                }
                console.log("QUEUEING SCRIPT: " + (this.control.currentScript+1));
                this.control.changeScript(this.control.currentScript+1);
                break;
            }  
            default: {
                break;
            }
        }
    }

    resetVariables() {
        this.step = 0;
        this.variableMap = new Map<string, MonsterAction>();
    }
}