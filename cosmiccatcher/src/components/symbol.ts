import * as builder from "../../engine/src/component/builder";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { Orientation } from "../../engine/src/core/types";
import { delayForSpine } from "../../engine/src/util/async";
import * as xml from "../../engine/src/util/xml";

type SymbolOptions = {
  s: number;
};

@Register({ tag: "symbol", category: "component" })
export class Symbol extends Layer {
  winFrame: Layer & { multiper: Label; spine: SpineAnimation };
  spine: SpineAnimation;
  symbol1: Image;
  symbol2: Image;

  argument1: string;
  argument2: string;
  readonly index: number;
  pct: number;

  constructor(options: SymbolOptions) {
    super();
    this.index = options.s;
  }

  init() {
    const slots1 = this.spine.getSlotContainerByName("glow");
    slots1.removeChildren();
    slots1.addChild(this.symbol2);
    this.symbol2.blendMode = "add";

    const slots = this.spine.getSlotContainerByName("symbol");
    slots.removeChildren();
    slots.addChild(this.symbol1);

    const slotsMul = this.winFrame.spine.getSlotContainerByName("MP_AMT");
    slotsMul.removeChildren();
    slotsMul.addChild(this.winFrame.multiper);
  }

  playOnce(): Promise<void> {
    return new Promise((resolve) => {
      this.spine.animated = true;
      this.spine.setAnimation(0, "symbol_grow", false);
      this.spine.addCompleteListener((j, i) => {
        this.spine.animated = false;
        // this.spine.removeCompleteListener(listener)
        this.spine["animation"].state.clearListeners();
        resolve();
      });
    });
  }

  play() {
    this.spine.setAnimation(0, "symbol_grow", true);
    this.spine.animated = true;
  }

  stop() {
    this.spine.animated = false;
    this.spine.resetTrackTime();
  }

  showWinFrame(e: boolean, multiper: number = 0) {
    if (e) {
      this.winFrame.multiper.value = `x${multiper}`;
      this.winFrame.visible = true;
      // this.winFrame.multiper.visible = !!multiper && multiper > 1;
      this.play();
      this.spine.scale.set(0.5);
      this.parent.setChildIndex(this, this.parent.children.length - 1);

      if (!!multiper && multiper > 1) {
        delayForSpine(2200).then(() => {
          this.winFrame.spine.setAnimation(0, "bonusA_mutiplier", false);
          this.winFrame.spine.addCompleteListener(() => {
            this.winFrame.spine["animation"].state.clearListeners();
            this.winFrame.spine.setAnimation(0, "bonusA_mutiplierStill", true);
          });
          this.winFrame.spine.setVisibleAnimated(true);
        });
      }
    } else {
      this.winFrame.spine.setVisibleAnimated(false);
      this.winFrame.visible = false;
      this.stop();
      this.spine.scale.set(0.33);
    }
  }

  set tint(e: number) {
    this.symbol1.tint = this.symbol2.tint = e;
  }

  onOrientationChange(orientation) {
    super.onOrientationChange(orientation);
    this.pct = orientation == Orientation.LANDSCAPE ? Number(this.argument1) : Number(this.argument2);
  }

  static create(node: Element, args) {
    const obj = new Symbol({
      s: xml.num(node, "s")
    });

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
