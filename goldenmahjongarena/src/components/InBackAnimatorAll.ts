import * as director from "../../engine/src/director";
import { AnimatorState, EVENTS_REEL_STOP, InBackAnimator as _InBackAnimator } from "../../engine/src/slotMachine/component/inBackAnimatorAll";
import * as slotApp from "../../engine/src/slotMachine/slotApp";

export class InBackAnimator extends _InBackAnimator {
  advanceTime(elapsedFrames: number): boolean {
    if (!this.enabled) return;
    try {
      const spinSpeed = this.spinAnimator.getSpeed();
      const stopSpeed = this.stopAnimator ? this.stopAnimator.getSpeed() : 0;
      let spinningIdx = 0;
      for (let i = this.numCols - 1; i >= 0; i--) {
        const state = this.states[i];
        const reel = this.reels.symbols[i];
        if (state !== AnimatorState.Stopped) {
          reel.forEach((symbol) => {
            symbol.y += state === AnimatorState.Spin ? spinSpeed : stopSpeed;
            symbol.updateAttached();
          });
        }
        if (state === AnimatorState.Spin) spinningIdx = i;
      }
      if (this.reels.symbols[spinningIdx][0].y > 0 && this.states[spinningIdx] === AnimatorState.Spin) {
        this.reels.addSpinSymbols(spinningIdx);
      }
      this.reels.removeOutsideSymbols();

      if (this.stopAnimator && this.stopAnimator.stopped) {
        const cols = [];
        for (let i = 0; i < this.numCols; i++) {
          if (this.states[i] === AnimatorState.Stopping) {
            this.states[i] = AnimatorState.Stopped;
            this.reels.adjustCol(i);
            cols.push(i);
          }
        }
        director.inputManager.emit(EVENTS_REEL_STOP, cols);
        if (this.allStopped) {
          this.cancel();
          this.resolve();
        } else this.readyToStop();
      }
      if (this.update) this.update();
    } catch (e) {
      if (this.reject) this.reject({ code: slotApp.SPIN_ERROR, message: "" });
    }
    return true;
  }
}
