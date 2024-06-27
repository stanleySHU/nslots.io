import { create } from "../../engine/src/component/builders/layerBuilder";
import { View } from "../../engine/src/component/component";
import { Register } from "../../engine/src/core/registry";
import { delayAnimatable } from "../../engine/src/util/async";
import { Size } from "../../engine/src/util/math";
import { size } from "../../engine/src/util/xml";
import { setAnimationStatic } from "../animations/sceneAnimation";
import { getLanguage } from "../scenes/mainScene";

@Register({ tag: "adBar" })
export class AdBar extends View {
  size: Size;
  items: View[] = [];

  addItem(index: 0 | 1) {
    const item = this.items.shift();
    this.items.push(item);
    this.addChild(item);
    item.x = this.size.width / 2 - item.width / 2 + this.size.width * index;
    item.y = this.size.height / 2 - item.height / 2;

    if (item.id == "spine") {
      // (item["logo"] as SpineAnimation).setAnimation(0, `Idle_${getLanguage(true)}`, true);
      // (item["logo"] as SpineAnimation).animated = true;

      setAnimationStatic(item["logo"], `Idle_${getLanguage(true)}`, true);
    }
  }

  removeItem() {
    this.children[0]?.removeFromParent();
  }

  init() {
    this.items = [...this.components] as View[];
    this.removeChildren();
    this.addItem(0);
  }

  showIn() {
    this.addItem(1);
    const x0 = this.children[0].x;
    const x1 = this.children[1].x;
    new TWEEN.Tween({ k: 0 })
      .to({ k: 1 }, 3000)
      .onUpdate((v) => {
        this.children[0].x = x0 - v.k * this.size.width;
        this.children[1].x = x1 - v.k * this.size.width;
      })
      .onComplete(this.removeItem.bind(this))
      .start();
  }

  run() {
    delayAnimatable(5000).then(() => {
      this.showIn();
      this.run();
    });
  }

  static create(node: Element, args) {
    const t = create(AdBar, node, args) as AdBar;
    t.size = size(node, "range");
    t.init();
    t.run();
    return t;
  }
}
