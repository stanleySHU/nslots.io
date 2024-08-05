import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import * as builder from "../../engine/src/component/builder";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { delayForSpine } from "../../engine/src/util/async";
import { AnimatedEmitter } from "../animations/emitters";
import { coins_config, coins_textures } from "../constants";

@Register({ tag: "winPanel", category: "component" })
export class WinPanel extends Layer {
  coinsEmitter: AnimatedEmitter;
  spine: SpineAnimation;
  amount: AnimatedLabel;
  coinsLayer: Layer;

  constructor() {
    super();
  }

  init() {
    this.coinsEmitter = new AnimatedEmitter(this.coinsLayer, coins_textures(), coins_config, 0.0012);
  }

  showWin(e: number): Promise<void> {
    const slots = this.spine.getSlotContainerByName("AMT");
    this.spine.setAnimation(0, "youwinL_entry", false);
    this.spine.addAnimation(0, "youwinL_idle", true);
    slots.removeChildren();
    delayForSpine(1000).then(() => {
      slots.addChild(this.amount);
      this.amount.duration = 2000;
      this.amount.value = `${e}`;
    });

    this.spine.setVisibleAnimated(true);

    this.visible = true;
    return delayForSpine(4000).then(() => {
      this.spine.setAnimation(0, "youwinL_exit", false);
      return delayForSpine(2000).then(() => {
        this.visible = false;
        this.spine.setVisibleAnimated(false);
        this.amount.value = "0";
      });
    });
  }

  playWinEffect(winLevel: number) {
    this.visible = true;
    this.coinsEmitter.show(winLevel);
  }

  removeWinEffect() {
    this.coinsEmitter.stop();
    this.visible = false;
  }

  static create(node: Element, args) {
    const obj = new WinPanel();

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
