import * as builder from "../../engine/src/component/builder";
import { Button } from "../../engine/src/component/button";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { MovieClip } from "../../engine/src/component/movieClip";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { WheelStopPosition } from "../model/spinModel";

type BetButtonType = Button & { winFrame: SpineAnimation; sparkle: MovieClip; box: { bet: Layer; amount: Layer & { label: Label } } };

@Register({ tag: "betPanel", category: "component" })
export class BetPanel extends Layer {
  private _betCountMap: { [key: number]: number } = {};

  get betCountData(): { bet: { bet: number; volume: number }[]; count: number } {
    const arr = [];
    let sum = 0;
    for (const e in this._betCountMap) {
      const count = this._betCountMap[e];
      if (count > 0) {
        arr.push({ bet: Number(e), volume: count });
        sum += count;
      }
    }
    return { bet: arr, count: sum };
  }

  getBetButton(e: number): BetButtonType {
    return this[`bet${e}`] as BetButtonType;
  }

  onBet(e: BetButtonType, bet: number) {
    const count = this._betCountMap[bet] || 0;
    this._betCountMap[bet] = count + 1;
    this.refresh();

    if (!e.sparkle.visible) {
      e.sparkle.visible = true;
      e.sparkle.play(1).then(() => {
        e.sparkle.visible = false;
      });
    }
  }

  onClearBet() {
    this._betCountMap = {};
    this.refresh();
  }

  refresh() {
    for (let i = 2; i <= 9; i++) {
      const button = this.getBetButton(i);
      const count = this._betCountMap[i] || 0;
      button.box.bet.visible = count == 0;
      button.box.amount.visible = count > 0;
      button.box.amount.label.value = `${count}`;
    }
  }

  showWinFrame(e: WheelStopPosition[]) {
    for (const item of e) {
      const button = this.getBetButton(item.symbol);
      button.winFrame.setAnimation(0, "winFrame", true);
      button.winFrame.setVisibleAnimated(true);
    }
  }

  hideWinFrame() {
    for (let i = 2; i <= 9; i++) {
      const button = this.getBetButton(i);
      button.winFrame.setVisibleAnimated(false);
    }
  }

  static create(node: Element, args) {
    const obj = new BetPanel();

    builder.createChildren(node, {
      scene: args.scene,
      parent: obj,
      context: args.context
    });
    builder.setProperties(obj, node, args);
    obj.refresh();
    return obj;
  }
}
