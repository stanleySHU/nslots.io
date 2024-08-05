import { Animatable } from "../../engine/src/animation/animatable";
import * as builder from "../../engine/src/component/builder";
import { Image } from "../../engine/src/component/image";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { delayForSpine } from "../../engine/src/util/async";
import { rangeInteger } from "../../engine/src/util/random";
import * as xml from "../../engine/src/util/xml";
import { Speed } from "../constants";
import { WheelStopPosition } from "../model/spinModel";
import { AnimatorWithMask as Animator, SpinAnimtionResultOptions } from "../util/animatorWithMask";
import { Symbol } from "./symbol";

interface ReelOptions extends SpinAnimtionOptions {}
type colorBoxType1 = Layer & { default: Layer & { outer: Image; inter: Image }; spine: SpineAnimation };
type colorBoxType = Layer & { box0: colorBoxType1; box1: colorBoxType1; box2: colorBoxType1 };

@Register({ tag: "reel", category: "component" })
export class Reel extends Layer implements Animatable {
  boxStatus: ("idle" | "tail")[] = ["idle", "idle", "idle"];
  respin: boolean = false;
  argument1: number;
  argument2: number;
  orientation: Orientation;
  container: Layer & {
    blueBox: colorBoxType;
    yellowBox: colorBoxType;
  };
  colorBox: colorBoxType;
  symbols: Layer & { children: Symbol[] };
  spinTime: number = 0;
  spinAnimation: SpinAnimtion;
  symbolInSpinTweenMap: { [key: number]: Symbol } = {};
  spinStopHandler: () => void;

  get symbolOffsetL() {
    return this.argument1;
  }

  get symbolOffsetP() {
    return this.argument2;
  }

  initIndex(e: number) {
    this.spinAnimation.index = e;
    this.onUpdate();
  }

  init(options: ReelOptions) {
    this.spinAnimation = new SpinAnimtion(options);
    this.setColorBox(false);
  }

  onUpdate() {
    //box animation
    const e = this.spinAnimation.onUpdate(this.spinTime);
    const t1 = e.speed / 40;
    const e1 = this.spinAnimation.onUpdate(this.spinTime - t1);
    const t2 = (e.speed / 40) * 2;
    const e2 = this.spinAnimation.onUpdate(this.spinTime - t2);

    const boxs = [this.colorBox.box0, this.colorBox.box1, this.colorBox.box2];
    const es = [e, e1, e2];
    for (let i = 0; i < es.length; i++) {
      const e = es[i];
      const box = boxs[i];
      box.position.set(e.point.x, e.point.y);
      if (e.speed > 0) {
        if (e.speed > this.spinAnimation.maxSpeed * 0.7 && this.boxStatus[i] == "idle") {
          box.spine.setAnimation(0, this.respin ? "bonusSpin_arrow" : "normalSpin_arrow", true);
          this.boxStatus[i] = "tail";
        } else if (e.speed <= this.spinAnimation.maxSpeed * 0.7 && this.boxStatus[i] == "tail") {
          box.spine.setAnimation(0, this.respin ? "bonusSpin_arrow_noTrail" : "normalSpin_arrow_noTrail", true);
          this.boxStatus[i] = "idle";
        }
        if (!box.spine.animated) {
          box.spine.setAnimation(0, this.respin ? "bonusSpin_arrow_noTrail" : "normalSpin_arrow_noTrail", true);
          this.boxStatus[i] = "idle";

          box.default.visible = false;
          box.spine.setVisibleAnimated(true);
        }
      } else {
        box.default.visible = true;
        box.spine.setVisibleAnimated(false);
      }
      box.spine.rotation = (Math.PI / 2) * (e.speedVector.x == 1 ? 0 : e.speedVector.x == -1 ? 2 : e.speedVector.y == 1 ? 3 : 1);
    }

    //symbol animation
    for (let i = 0; i < this.spinAnimation.symbols.length; i++) {
      const symbol = this.spinAnimation.symbols[i];
      const pct = symbol.pct;
      if (pct - e.offsetInPathPct < 0.02 && (pct - e.offsetInPathPct > 0 || pct - e.offsetInPathPct < -0.98)) {
        if (!this.symbolInSpinTweenMap[i]) {
          this.symbolInSpinTweenMap[i] = symbol;
        }
        symbol.playOnce().then(() => {
          delete this.symbolInSpinTweenMap[i];
        });
        break;
      }
    }

    if (e.stop) {
      boxs[1].position.set(e.point.x, e.point.y);
      boxs[2].position.set(e.point.x, e.point.y);
      this.onEndSpin();
    }
  }

  advanceTime(elapsedFrames: number): boolean {
    this.spinTime += elapsedFrames * PIXI.Ticker.shared.elapsedMS;
    this.onUpdate();
    return true;
  }

  setColorBox(respin: boolean) {
    this.colorBox = respin ? this.container.yellowBox : this.container.blueBox;
    this.container.yellowBox.visible = false;
    this.container.blueBox.visible = false;
  }

  onSpin(respin: boolean) {
    this.respin = respin;
    this.setColorBox(respin);
    this.colorBox.visible = true;
    director.juggler.add(this);
  }

  toStop(e: WheelStopPosition) {
    this.spinAnimation.toStop(e, this.spinTime);
  }

  onEndSpin() {
    director.juggler.remove(this);
    this.spinTime = 0;
    this.spinStopHandler();
  }

  showBoxSpineOnce(): Promise<void> {
    for (const i of [0, 1, 2]) {
      const box = this.colorBox[`box${i}`] as colorBoxType1;
      box.default.visible = false;
      box.spine.setAnimation(0, "normalSpin_winfx", false);
      box.spine.setVisibleAnimated(true);
    }
    this.colorBox.visible = true;
    return delayForSpine(300).then(() => {
      for (const i of [0, 1, 2]) {
        const box = this.colorBox[`box${i}`] as colorBoxType1;
        box.spine.setVisibleAnimated(false);
      }
    });
  }

  showSpinStoped(e: WheelStopPosition): Promise<void> {
    for (const i of [0, 1, 2]) {
      const box = this.colorBox[`box${i}`] as colorBoxType1;
      box.default.visible = false;
      box.spine.setAnimation(0, this.respin ? "bonusSpin_winfx" : "normalSpin_winfx", true);
      box.spine.setVisibleAnimated(true);
    }
    return delayForSpine(900).then(() => {
      for (const i of [0, 1, 2]) {
        const box = this.colorBox[`box${i}`] as colorBoxType1;
        box.spine.setVisibleAnimated(false);
      }
      this.colorBox.visible = false;
      this.showWinSymbols([e]);
    });
  }

  showWinSymbols(e: WheelStopPosition[]) {
    const existWin = e.length > 0;
    const map = {};
    for (const item of e) {
      const e = map[item.index];
      if (e) {
        map[item.index] = e + 1;
      } else {
        map[item.index] = 1;
      }
    }
    for (const symbol of this.spinAnimation.symbols) {
      symbol.showWinFrame(false);
      symbol.tint = existWin ? 0x888888 : 0xffffff;
    }
    for (const key in map) {
      const symbol = this.spinAnimation.symbols[key];
      symbol.tint = 0xffffff;
      const multiper = map[key];
      symbol.showWinFrame(true, multiper);
    }
  }

  onOrientationChanged(orientation) {
    this.orientation = orientation;
    this.spinAnimation.onOrientationChanged(orientation);
    this.onUpdate();
    // const symbols = [];
    // for (let i = 0; i < this.symbols.children.length; i++) {
    //   const symbol = this.symbols.children[i];
    //   symbols.push({
    //     x: symbol.x,
    //     y: symbol.y
    //   });
    // }
    // let sum = 0;
    // for (let i = 0; i < symbols.length; i++) {
    //   let t = sum / 1716 + (1 - 0.798368);
    //   if (t > 1) {
    //     t -= 1;
    //   }
    //   console.log(t.toFixed(6));
    //   const p1 = symbols[i];
    //   const p2 = symbols[(i + 1) % symbols.length];
    //   sum += Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    // }
  }

  static create(node: Element, args) {
    const reel = new Reel();
    builder.createChildren(node, {
      scene: args.scene,
      parent: reel,
      context: args.context
    });
    builder.setProperties(reel, node, args);

    const symbolsL = [],
      symbolsP = [];
    for (let i = 0; i < reel.symbols.children.length; i++) {
      const symbol = reel.symbols[`s${i}`];
      symbolsL.push(symbol);
      symbolsP.push(symbol);
    }
    const _symbolsL = symbolsL.splice(0, reel.symbolOffsetL);
    const _symbolsP = symbolsP.splice(0, reel.symbolOffsetP);
    reel.init({
      symbolsL: [...symbolsL, ..._symbolsL],
      symbolsP: [...symbolsP, ..._symbolsP],
      spinStartSpeed: xml.num(node, "spinStartSpeed"),
      spinEndSpeed: xml.num(node, "spinEndSpeed"),
      maxSpeed: xml.num(node, "maxSpeed"),
      speedUpTime: xml.num(node, "speedUpTime"),
      speedDownTime: xml.num(node, "speedDownTime")
    });

    return reel;
  }
}

export interface SpinAnimtionOptions {
  symbolsL: Symbol[];
  symbolsP: Symbol[];
  spinStartSpeed: number;
  spinEndSpeed: number;
  maxSpeed: number;
  speedUpTime: number;
  speedDownTime: number;
}

export class SpinAnimtion {
  orientation: Orientation;
  index: number = 0;
  willStopIndex: number = 0;
  readonly symbolsL: ReadonlyArray<Symbol>;
  readonly symbolsP: ReadonlyArray<Symbol>;
  readonly spinStartSpeed: number;
  readonly spinEndSpeed: number;
  readonly maxSpeed: number;
  readonly speedUpTime: number;
  readonly speedDownTime: number;
  stopedTime: number;
  animator: Animator = new Animator();

  constructor(options: SpinAnimtionOptions) {
    this.symbolsL = options.symbolsL;
    this.symbolsP = options.symbolsP;
    this.spinStartSpeed = options.spinStartSpeed;
    this.spinEndSpeed = options.spinEndSpeed;
    this.maxSpeed = options.maxSpeed;
    this.speedUpTime = options.speedUpTime;
    this.speedDownTime = options.speedDownTime;
  }

  get symbols() {
    return this.orientation == Orientation.LANDSCAPE ? this.symbolsL : this.symbolsP;
  }

  getSpeedUpOffset(t: number) {
    return Speed.up(this.spinStartSpeed, this.maxSpeed, this.speedUpTime, t);
  }

  getSpeedDownOffset(t: number) {
    return Speed.down(this.maxSpeed, this.spinEndSpeed, this.speedDownTime, t);
  }

  get currentIndexOffset() {
    return this.symbols[this.index].pct * this.animator.getPathLength(this.orientation);
  }

  getMoveDistanceAndSpeed(spinTime: number): [number, number, boolean] {
    let distance = 0,
      speed = this.spinStartSpeed,
      stop = false;
    if (spinTime < this.speedUpTime) {
      distance = this.getSpeedUpOffset(spinTime);
      speed = this.spinStartSpeed + (this.maxSpeed - this.spinStartSpeed) * (spinTime / this.speedUpTime);
    } else if (spinTime > this.stopedTime - this.speedDownTime) {
      let speedDownTime = spinTime - this.stopedTime + this.speedDownTime;
      if (spinTime > this.stopedTime) {
        speedDownTime = this.speedDownTime;
        stop = true;
      }
      speed = (this.maxSpeed - this.spinEndSpeed) * ((this.speedDownTime - speedDownTime) / this.speedDownTime);
      distance =
        this.getSpeedUpOffset(this.speedUpTime) +
        ((this.stopedTime - this.speedUpTime - this.speedDownTime) / 1000) * this.maxSpeed +
        this.getSpeedDownOffset(speedDownTime);
    } else {
      speed = this.maxSpeed;
      distance = this.getSpeedUpOffset(this.speedUpTime) + ((spinTime - this.speedUpTime) / 1000) * this.maxSpeed;
    }
    {
      distance += this.currentIndexOffset;
    }
    this.animator.update(speed, distance, 0);
    if (stop) {
      this.index = this.willStopIndex;
    }
    return [distance, speed, stop];
  }

  getRandomSymbol(i: number): [Symbol, number] {
    const symbols = [],
      symbolsIndex = [];
    for (let j = 0; j < this.symbols.length; j++) {
      const symbol = this.symbols[j];
      if (symbol.index === i) {
        symbols.push(symbol);
        symbolsIndex.push(j);
      }
    }
    const randomIndex = rangeInteger(symbols.length);
    return [symbols[randomIndex], symbolsIndex[randomIndex]];
  }

  toStop(e: WheelStopPosition, spinTime: number) {
    this.willStopIndex = e.index;
    const winSymbol = this.symbols[e.index];
    const pathLength = this.animator.getPathLength(this.orientation);
    const segmentDistance = pathLength * winSymbol.pct + (this.animator.getPathLength(this.orientation) - this.currentIndexOffset);
    const stopDistance =
      Math.ceil(
        Math.max(this.getMoveDistanceAndSpeed(spinTime)[0], this.getSpeedUpOffset(this.speedUpTime) + this.getSpeedDownOffset(this.speedDownTime)) /
          pathLength
      ) *
        pathLength +
      segmentDistance;
    this.stopedTime =
      ((stopDistance - this.getSpeedUpOffset(this.speedUpTime) - this.getSpeedDownOffset(this.speedDownTime)) / this.maxSpeed) * 1000 +
      this.speedUpTime +
      this.speedDownTime;
  }

  onOrientationChanged(orientation) {
    this.orientation = orientation;
  }

  //移动轨迹
  onUpdate(spinTime: number): SpinAnimtionResultOptions {
    const [distance, speed, stop] = this.getMoveDistanceAndSpeed(spinTime);
    const e = this.animator.update(speed, distance, this.orientation);
    e.stop = stop;
    return e;
  }
}
