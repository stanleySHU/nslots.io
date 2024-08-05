import * as builder from "../../engine/src/component/builder";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { delayForSpine } from "../../engine/src/util/async";

@Register({ tag: "chase", category: "component" })
export class Chase extends Layer {
  spineL: SpineAnimation;

  showBonus1(): Promise<void> {
    this.spineL.setVisibleAnimated(true);
    return delayForSpine(4800).then(() => {
      this.spineL.setVisibleAnimated(false);
    });
  }

  static create(node: Element, args) {
    const obj = new Chase();

    builder.createChildren(node, {
      scene: args.scene,
      parent: obj,
      context: args.context
    });
    builder.setProperties(obj, node, args);
    return obj;
  }
}
