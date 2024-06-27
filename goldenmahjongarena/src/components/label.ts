import { create } from "../../engine/src/component/builders/labelBuilder";
import { Label as _Label } from "../../engine/src/component/label";
import { num } from "../../engine/src/util/xml";

export class Label extends _Label {
  private maxWidth: number;

  update() {
    this.updateLetterCase();
    this.updateComma();
    this.resize();
    this.updateAnchorX();
    this.updateAnchorY();
  }

  resize() {
    if (this.maxWidth > 0) {
      const currentScale = this.text.scale.x;
      const width = this.text.width;
      const maxWidth = this.maxWidth;
      const scale = (maxWidth / width) * currentScale;
      if (scale < 1) this.text.scale.set(scale, scale);
      else if (this.text.scale.x != 1) this.text.scale.set(1, 1);
    }
  }

  static create(node: Element, args) {
    const t = create(Label, node, args);
    t.maxWidth = num(node, "maxWidth", 0);
    t.resize();
    return t;
  }
}
