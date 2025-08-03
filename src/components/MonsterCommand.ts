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
import { GameScene } from "@/scenes/GameScene";
import { Bounds } from "@/scenes/BaseScene";
import { DashLine } from "./DashLine";
import { CircleEffect } from "./CircleEffect";
import type { Wolf } from "./enemies/wolf/Wolf";

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
                if(this.pend) { break;}
                this.owner.scene.sound.play(this.cmd[this.step].args[0], {volume: this.cmd[this.step].value[0]});
                this.advance();
                break;
            }   case "machinegunwide": {
                //values: amount, x, y, velocity, variance (+/- amount), center angle, width
                //args: key conditions: follow y/n
                if(this.pend) { break;}
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
                if(this.pend) { break;}
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
            }   case "dashEdge": {
                if(this.pend) {
                    break;
                }
                let p = this.owner.scene.closestChebyshevEdge(this.owner.x, this.owner.y);
                if(this.cmd[this.step].conditions[0]) {
                    p = this.owner.scene.oppositeEdge(p);
                }
                switch(p){
                    case Bounds.TOP: {this.owner.travel(this.cmd[this.step].value[0], [Phaser.Math.Between(960-(this.cmd[this.step].value[1]/2), 960+(this.cmd[this.step].value[1]/2)), 200], true); break;}
                    case Bounds.RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, Phaser.Math.Between(540-(this.cmd[this.step].value[1]/2), 540+(this.cmd[this.step].value[1]/2))], true); break;}
                    case Bounds.BOTTOM: {this.owner.travel(this.cmd[this.step].value[0], [Phaser.Math.Between(960-(this.cmd[this.step].value[1]/2), 960+(this.cmd[this.step].value[1]/2)), 880], true); break;}
                    case Bounds.LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, Phaser.Math.Between(540-(this.cmd[this.step].value[1]/2), 540+(this.cmd[this.step].value[1]/2))], true); break;}
                    default: {break;}
                }
                this.circleEffect();
                this.lineEffect();
                this.advance();
                break;
            }   case "dashCorner": {
                if(this.pend) {
                    break;
                }
                let p = this.owner.scene.closestCorner(this.owner.x, this.owner.y);
                if(this.cmd[this.step].conditions[0]) {
                    p = this.owner.scene.oppositeCorner(p);
                }
                switch(p){
                    case Bounds.TOP_LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, 200], true); break;}
                    case Bounds.TOP_RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, 200], true); break;}
                    case Bounds.BOTTOM_RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, 880], true); break;}
                    case Bounds.BOTTOM_LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, 880], true); break;}
                    default: {break;}
                }
                this.circleEffect();
                this.lineEffect();
                this.advance();
                break;
            }   case "dashAtEdge": {
                if(this.pend) {
                    break;
                }
                let pr = this.owner.scene.closestChebyshevEdge(Phaser.Math.Between(860,1060), Phaser.Math.Between(440,640));
                if(!this.owner.scene.input == null)
                {
                    let px = this.owner.scene.input.activePointer;
                    if( px.isDown) {
                        pr = this.owner.scene.closestCorner(px.x,px.y);
                    }
                }
                switch(pr){
                    case Bounds.TOP: {this.owner.travel(this.cmd[this.step].value[0], [Phaser.Math.Between(960-(this.cmd[this.step].value[1]/2), 960+(this.cmd[this.step].value[1]/2)), 200], true); break;}
                    case Bounds.RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, Phaser.Math.Between(540-(this.cmd[this.step].value[1]/2), 540+(this.cmd[this.step].value[1]/2))], true); break;}
                    case Bounds.BOTTOM: {this.owner.travel(this.cmd[this.step].value[0], [Phaser.Math.Between(960-(this.cmd[this.step].value[1]/2), 960+(this.cmd[this.step].value[1]/2)), 880], true); break;}
                    case Bounds.LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, Phaser.Math.Between(540-(this.cmd[this.step].value[1]/2), 540+(this.cmd[this.step].value[1]/2))], true); break;}
                    default: {break;}
                }
                this.circleEffect();
                this.lineEffect();
                this.advance();
                break;
            }   case "dashAtCorner": {
                if(this.pend) {
                    break;
                }
                let pr = this.owner.scene.closestCorner(Phaser.Math.Between(860,1060), Phaser.Math.Between(440,640));
                if(!this.owner.scene.input == null)
                {
                    let px = this.owner.scene.input.activePointer;
                    if( px.isDown) {
                        pr = this.owner.scene.closestCorner(px.x,px.y);
                    }
                }
                switch(pr){
                    case Bounds.TOP_LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, 200], true); break;}
                    case Bounds.TOP_RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, 200], true); break;}
                    case Bounds.BOTTOM_RIGHT: {this.owner.travel(this.cmd[this.step].value[0], [1720, 880], true); break;}
                    case Bounds.BOTTOM_LEFT: {this.owner.travel(this.cmd[this.step].value[0], [200, 880], true); break;}
                    default: {break;}
                }
                this.circleEffect();
                this.lineEffect();
                this.advance();
                break;
            }   case "travel": { //go towards either a fixed position (true) or random (false) - accel/x/y or accel/x1/x2/y1/y2 otherwise
                if(this.pend) {
                    break;
                }
                if(this.owner.traveling) {
                    break;
                } else {
                    if(this.cmd[this.step].conditions[0]){
                        this.owner.travel(this.cmd[this.step].value[0],[this.cmd[this.step].value[1],this.cmd[this.step].value[2]],this.cmd[this.step].conditions[1]);
                    } else {
                        this.owner.travel(this.cmd[this.step].value[0],[this.cmd[this.step].value[1]+Math.random()*(this.cmd[this.step].value[2]-this.cmd[this.step].value[1]),
                            this.cmd[this.step].value[3]+Math.random()*(this.cmd[this.step].value[4]-this.cmd[this.step].value[3])],this.cmd[this.step].conditions[1]);
                    }
                    this.advance();
                }
                break;
            }   case "tsa": { // wait until traveling (true) or not traveling (false)
                if(this.pend) {
                    break;
                }
                switch(this.cmd[this.step].conditions[0]) {
                    case true: {
                        if(this.owner.traveling) { this.advance(); break;} else {break;}
                    } case false: {
                        if(!this.owner.traveling) { this.advance(); break;} else {break;}
                    } default: { break;}
                }
                break;
            }   case "flash": {
                if(this.pend) {
                    break;
                }
                this.owner.flash(this.cmd[this.step].value[0],this.cmd[this.step].value[1]);
                this.advance();
                break;
            }   case "lineEffect": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushHitEffect(new DashLine(this.owner.scene,this.owner.x,this.owner.y,this.owner,-1*Math.atan2(this.owner.velocity.y,this.owner.velocity.x)));
                this.advance();
                break;
            }   case "circleEffect": {
                if(this.pend) {
                    break;
                }
                this.owner.scene.pushHitEffect(new CircleEffect(this.owner.scene,this.owner.x,this.owner.y,this.owner,600,750));
                this.advance();
                break;
            }  case "call": {
                if(this.pend) {
                    break;
                }
                for(let i = 0; i < this.cmd[this.step].value[0]; i++){
                    this.owner.callSpecial(this.cmd[this.step].args[0])
                }
                this.advance();
                break;
            }   case "stunimmune": {
                if(this.pend) {
                    break;
                }
                this.owner.stunImmune = this.cmd[this.step].conditions[0];
                this.advance();
                break;
            }   case "die": {
                if(this.pend) {
                    break;
                }
                this.owner.die();
                this.advance();
                break;
            }   case "storeRandom": { //this just stores random numbers, only parameter is the amount and the key
                if(this.pend) {
                    break;
                }
                
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
            }   case "store": { //stores whatever you want, first arg is the key
                if(this.pend) {
                    break;
                }
                
                let tmp = {
                    key: this.cmd[this.step].args[0],
                    value: this.cmd[this.step].value,
                    args: this.cmd[this.step].args,
                    conditions: this.cmd[this.step].conditions,
                }
                this.variableMap.set(this.cmd[this.step].args[0],tmp);
                this.advance();
                break;
            }   case "loop": { //mostly for loops but you can skip with this too, only argument is index
                if(this.pend) {
                    break;
                }
                this.step = this.cmd[this.step].value[0];
                break;
            }   case "resetVars": { //deletes ALL variables and resets the script to the beginning, use sparingly
                if(this.pend) {
                    break;
                }
                
                this.resetVariables();
                this.advance();
                break;
            }   case "nextScript": { //queues next scrip
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

    lineEffect(){
        this.owner.scene.pushHitEffect(new DashLine(this.owner.scene,this.owner.x,this.owner.y,this.owner,-1*Math.atan2(this.owner.velocity.y,this.owner.velocity.x)));
    }

    circleEffect(){
        this.owner.scene.pushHitEffect(new CircleEffect(this.owner.scene,this.owner.x,this.owner.y,this.owner,600,750));
    }

    resetVariables() {
        this.pend = false;
        this.step = 0;
        this.timer = 0;
        this.variableMap = new Map<string, MonsterAction>();
    }
}