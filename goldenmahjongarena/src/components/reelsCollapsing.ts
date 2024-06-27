import * as builder from "../../engine/src/component/builder";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import * as graphics from "../../engine/src/util/graphics";
import * as xml from "../../engine/src/util/xml";
import { GOLD_SYMBOLS } from "../constants";
import { Reels, createReels } from "./reels2";
// import * as _ from 'lodash';

@Register({ tag: "reels" })
export class ReelsCollapsing extends Reels {
  addSymbols: number[][];
  symbolDisplacements: number[][];
  symbolMapping: number[][];
  collapsing: boolean = false;

  maskSpin: PIXI.Sprite | PIXI.Graphics = null;
  maskIdle: PIXI.Sprite | PIXI.Graphics = null;

  numRows = (reelIndex) => {
    return 7; //reelIndex % 4 === 0 ? 4 : 5;
  };

  initReels() {
    this.initMask();
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.setMask();
    if (this.collapsing) {
      this.animator = director.injector.get("reelsCollapsingAnimator");
      this.animator.reels = this;
    } else {
      this.animator = director.injector.get("reelsAnimator");
      this.animator.reels = this;
    }
    this.animator.play();
    this.winPanel.close();
  }

  protected animationStopped() {
    super.animationStopped();
    this.setMask();
  }

  getSymbolMapping() {
    //1 for has symbol
    //0 for symbol cleared
    const symbolMapping: number[][] = [...Array(slotApp.numCols())].map((val, reelIndex) => [...Array(this.numRows(reelIndex))].map(() => 1));
    for (let i = 0; i < this.winLines.length; i++) {
      const positions = this.winLines[i].positions;
      for (let j = 0; j < positions.length; j++) {
        const value = !GOLD_SYMBOLS.includes(this.symbolIndexes[positions[j][0]][positions[j][1]]) ? 0 : 2;
        symbolMapping[positions[j][0]][positions[j][1]] = value;
      }
    }
    this.symbolMapping = symbolMapping;
    this.symbolDisplacements = [];
    for (let i = 0; i < slotApp.numCols(); i++) {
      const arr = [];
      let dis = 0;
      for (let j = this.numRows(i) - 1; j >= 0; j--) {
        if (symbolMapping[i][j] === 0) {
          dis += slotApp.symbolHeight();
        } else {
          arr.unshift(dis);
        }
      }
      const len = this.numRows(i) - arr.length;
      for (let k = 0; k < len; k++) arr.unshift(dis);
      this.symbolDisplacements.push(arr);
    }
  }

  addSymbolsAtColTopPos(index: number, symbols: number[] | string[], yPos = 0) {
    const topSymbol = this.symbols[index][0];
    if (topSymbol) {
      const tempY = topSymbol.y;
      topSymbol.y = yPos;
      this.addSymbolsAtColTop(index, symbols, (s) => s.idle());
      topSymbol.y = tempY;
    } else this.addSymbolsAtColTop(index, symbols, (s) => s.idle());
  }

  removeWinningSymbol() {
    for (let i = 0; i < slotApp.numCols(); i++) {
      for (let j = this.numRows(i) - 1; j >= 0; j--) {
        if (this.symbolMapping[i][j] === 0) this.removeSymbolByPos(i, j);
      }
    }
  }

  // MASKING
  setMask() {
    // if custom masks aren't set, do normal masking
    if (!this.maskIdle && !this.maskSpin) {
      super.setMask();
      return;
    }
    // set mask according to current state of reels
    if (this.isSpinning) this.setMaskSpin();
    else this.setMaskIdle();
  }

  private setMaskSpin() {
    // if mask sprite is not assigned, do not apply any masking
    this._removeMask();
    if (this.maskSpin) this.addMask(this.maskSpin);
  }

  private setMaskIdle() {
    // makes sure that there's no win line
    if (this.winLines && this.winLines.length) return;
    // if mask sprite is not assigned, do not apply any masking
    this._removeMask();
    if (this.maskIdle) this.addMask(this.maskIdle);
  }

  private addMask(mask) {
    if (!this.maskSprite) {
      this.maskSprite = mask;
      this.addChild(this.maskSprite);
      this.mask = this.maskSprite;
      this.maskSprite.visible = true;
    }
  }

  private _removeMask() {
    if (this.maskSprite) {
      this.removeChild(this.maskSprite);
      this.maskSprite = undefined;
    }
    this.mask = undefined;
  }

  static create(node: Element, args: builder.BuildArgs) {
    const reels = createReels(ReelsCollapsing, node, args);

    xml.forEachElement(node, (curr, i) => {
      // Get settings for masking
      if (curr.nodeName === "mask") {
        const width = reels.getReelX(slotApp.numCols()) + xml.num(curr, "x") * -2;
        const height = slotApp.numRows() * slotApp.symbolHeight() + xml.num(curr, "y") * -2;
        // Canvas
        if (xml.str(curr, "render") === "canvas" && director.renderer.type === PIXI.RENDERER_TYPE.CANVAS) {
          // Spin Mask
          if (xml.str(curr, "mode") === "spin") {
            reels.maskSpin = createCanvasMask(curr, width, height);
          }
          // Idle Mask
          else if (xml.str(curr, "mode") === "idle") {
            reels.maskIdle = createCanvasMask(curr, width, height);
          }
        }
        // WebGL
        else if (xml.str(curr, "render") === "webgl" && director.renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
          // Spin Mask
          if (xml.str(curr, "spin")) {
            // if default is specified instead of image source, create a normal rectangle mask
            if (xml.str(curr, "spin") === "default") {
              reels.maskSpin = createCanvasMask(curr, width, height);
            } else {
              reels.maskSpin = createWebGLMask(curr, "spin");
            }
          }
          // Idle Mask
          if (xml.str(curr, "idle")) {
            // if default is specified instead of image source, create a normal rectangle mask
            if (xml.str(curr, "idle") === "default") {
              reels.maskIdle = createCanvasMask(curr, width, height);
            } else {
              reels.maskIdle = createWebGLMask(curr, "idle");
            }
          }
        }
      }
    });
    reels.initReels();
    return reels;
  }
}

export function createCanvasMask(currNode, width, height) {
  const mask: PIXI.Graphics = graphics.roundedRectangle(
    width + xml.num(currNode, "x-offset", 0),
    height + xml.num(currNode, "y-offset", 0),
    xml.num(currNode, "radius", 0)
  );
  mask.position.set(xml.num(currNode, "x"), xml.num(currNode, "y"));
  return mask;
}

export function createWebGLMask(currNode, type: string) {
  const mask: PIXI.Sprite = new PIXI.Sprite(director.resourceManager.resolve(xml.str(currNode, type)));
  mask.position.set(xml.num(currNode, "x"), xml.num(currNode, "y"));
  mask.scale.set(xml.num(currNode, "scale", 1));
  return mask;
}
