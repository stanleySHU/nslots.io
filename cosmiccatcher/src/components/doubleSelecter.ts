import * as builder from "../../engine/src/component/builder";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { Slide } from "../../engine/src/component/slide";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { delayForSpine } from "../../engine/src/util/async";
import * as tween from "../../engine/src/util/tween";

@Register({ tag: "doubleSelecter", category: "component" })
export class DoubleSelecter extends Layer {
  smallSlide: Slide & { goto: (e: "default" | "highlight" | "disable") => void };
  bigSlide: Slide & { goto: (e: "default" | "highlight" | "disable") => void };
  multiper: Layer & { label: Label; bgSlide: Layer; spine: SpineAnimation };

  private selected: "big" | "small";
  private _disable: boolean;
  private randomTime: number;

  init() {
    const slots = this.multiper.spine.getSlotContainerByName("DU_AMT");
    slots.removeChildren();
    slots.addChild(this.multiper.label);
  }

  setRandomNumberValue(i: number) {
    this.multiper.label.value = `${i}`;
  }

  onBig() {
    this.selected = "big";
    this.bet();
  }

  onSmall() {
    this.selected = "small";
    this.bet();
  }

  toStop(i: number): Promise<void> {
    const now = new Date().getTime();
    const t = 1500 - Math.min(now - this.randomTime, 1500);

    return delayForSpine(t)
      .then(() => {
        this.setRandomNumberValue(i);
        if (i > 7) {
          this.multiper.spine.setAnimation(0, "doubleUp_PinkWin", true);
        } else {
          this.multiper.spine.setAnimation(0, "doubleUp_GreenWin", true);
        }
      })
      .then(() => delayForSpine(500));
  }

  private bet() {
    this.randomTime = new Date().getTime();
    this.setSmallBigBtnStatus();

    this.multiper.spine.setAnimation(0, "doubleUp_spin", true);
    this.multiper.spine.setVisibleAnimated(true);

    this.multiper.bgSlide.visible = false;
  }

  show() {
    this.visible = true;
    tween.fadeIn(this, 500, () => {}, 1);
  }

  hide() {
    if (this.visible) {
      tween.fadeOut(this, 500, () => {
        this.reset();
        this.visible = false;
      });
    }
  }

  lose(e: boolean) {
    this._disable = e;
    this.selected = undefined;
    this.setSmallBigBtnStatus();
  }

  reset() {
    this.selected = undefined;
    this.lose(false);
    this.setRandomNumberValue(0);

    this.multiper.bgSlide.visible = true;
    this.multiper.spine.setVisibleAnimated(false);
  }

  setSmallBigBtnStatus() {
    const goto = this._disable ? "disable" : "default";
    this.smallSlide.goto(this.selected === "small" ? "highlight" : goto);
    this.bigSlide.goto(this.selected === "big" ? "highlight" : goto);
  }

  static create(node: Element, args) {
    const obj = new DoubleSelecter();
    builder.createChildren(node, {
      scene: args.scene,
      parent: obj,
      context: args.context
    });
    builder.setProperties(obj, node, args);
    obj.init();
    return obj;
  }
}
