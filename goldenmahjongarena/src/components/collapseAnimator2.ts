import * as director from "../../engine/src/director";
import { SymbolAnimator } from "../../engine/src/slotMachine/component/collapseAnimator";
import * as base from "../../engine/src/slotMachine/component/collapseAnimator2";
import { ReelsCollapsing } from "./reelsCollapsing";

export class CollapseAnimator2 extends base.CollapseAnimator2 {
  stop() {
    director.inputManager.emit(base.EVENTS_REELS_STOP_SPIN2);
    this.animators = [];
    let lastSymbol: any;
    const numRows = (reelIndex) => {
      return 7;
    };
    const reels = this.reels as unknown as ReelsCollapsing;
    for (let i = 0; i < this.numCols; i++) {
      let dropTimer = i * this.reelDropTimeGap;
      this.reels.addSymbolsAtColTopPos(i, this.reels.addSymbols[i]);
      for (let j = numRows(i) - 1; j >= 0; j--) {
        const symbol = this.reels.symbols[i][j];
        symbol.col = i;
        symbol.row = j;
        const dis = this.reels.symbolDisplacements[i][j];
        if (dis > 0) {
          symbol.y = symbol.y + this.reelAdjustment;
          const animator = new SymbolAnimator(symbol, symbol.y, reels.getReelY(j, i), this.acceleration, this.bounceFactor, true, i);
          lastSymbol = animator.play(dropTimer);
          dropTimer += this.symbolDropTimeGap;
          this.animators.push(animator);
          if (j === 0) animator.emitReelIdx = i;
        }
      }
    }
    (this.reels as any).sortSymbols();
    return lastSymbol;
  }
}
