import * as director from "../../engine/src/director";
import * as base from "../../engine/src/slotMachine/component/collapseAnimator";
import { SymbolAnimator } from "../../engine/src/slotMachine/component/collapseAnimator";
import * as slotApp from "../../engine/src/slotMachine/slotApp";

export class CollapseAnimator extends base.CollapseAnimator {
  stop() {
    for (let i = 0; i < slotApp.numCols(); i++) {
      this.reels.symbols[i] = [];
    }
    for (let i = 0; i < this.animators.length; i++) {
      this.animators[i].stop();
    }
    if (this.playing) return this.playing.then(() => this.playAnimator(true));
    this.playing = null;
    return this.playAnimator(true);
  }

  playAnimator(stopping) {
    if (stopping) {
      this.playing = null;
      this.cancel();
      director.inputManager.emit(base.EVENTS_REELS_STOP_SPIN);
    }
    this.animators = [];
    let lastsymbol;
    let col;
    let count = 0;

    let promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
    });

    const numRows = (reelIndex) => {
      return 7;
    };
    for (let i = 0; i < this.numCols; i++) {
      col = i;
      if (!this.leftToRight) col = this.numCols - i - 1;
      if (stopping) this.reels.addStopSymbols(col);
      const rows = numRows(i);
      for (let j = rows - 1; j >= 0; j--) {
        const symbol = this.reels.symbols[col][j];
        const offsetY = rows === 4 ? 0 : 0; //remove symbol heighjt for 0 and 4th reel
        const fromY = slotApp.symbolHeight() * (j - numRows(i));
        let toY = offsetY + symbol.y + slotApp.symbolHeight() * numRows(i);
        if (stopping) {
          symbol.y = fromY + this.reelAdjustment + offsetY;
          toY = this.reels.getRegisterPoint(i, j).y;
        }
        const animator = new SymbolAnimator(symbol, fromY, toY, this.acceleration, this.bounceFactor, stopping, col);
        lastsymbol = animator.play(i * this.reelDropTimeGap + (numRows(i) - 1 - j) * this.symbolDropTimeGap, stopping);
        this.animators.push(animator);
        if (!stopping) {
          lastsymbol.then(() => {
            if (++count == this.numCols * (this.numRows - 4)) {
              this.resolve();
            }
          });
        } else if (j === 0) animator.emitReelIdx = col;
      }
    }
    if (stopping) promise = lastsymbol;
    return promise;
  }
}
