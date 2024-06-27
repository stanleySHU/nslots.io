import * as builder from "../../engine/src/component/builder";
import { Carousel as _Carousel } from "../../engine/src/component/carousel";
import * as director from "../../engine/src/director";
import * as xml from "../../engine/src/util/xml";

export class Carousel extends _Carousel {
  dropdownWheelHandler(ev) {
    if (!this.dropdown || !this.visible) return;
    const e = ev || window.event;
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let rect;
    if (e.target) rect = e.target.getBoundingClientRect();
    if (rect) {
      mouseX -= rect.left;
      mouseY -= rect.top;
    }
    const glob = (this as any).dropdownMask.getGlobalPosition();
    const size = new PIXI.Point(this.options.dropdownWidth * director.stage.scale.x, (this as any).dropdownHeight * director.stage.scale.y);
    if (mouseX >= glob.x && mouseX - 30 <= glob.x + size.x && mouseY >= glob.y && mouseY - 50 <= glob.y + size.y) {
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      let y = this.itemsContainer.y - this.options.mouseWheelGap;
      if (delta > 0) y = this.itemsContainer.y + this.options.mouseWheelGap;
      this.itemsContainer.y = Math.min(
        this.options.itemHeight - 30,
        Math.max(
          y,
          (this.options.numItemsShown - this.items.length + 1) * this.options.itemHeight - this.options.itemHeight * this.options.numItemsShown
        )
      );
    }
    this.snapItemInMiddle();
  }

  static create(node: Element, args) {
    const resources = director.resourceManager;
    const spriteBG = resources.resolve(xml.str(node, "spriteBG")) as PIXI.Texture;
    const dropdown = resources.resolve(xml.str(node, "dropdown")) as PIXI.Texture;
    const selected: boolean = xml.attr(node, "selected") === "true";
    const itemsTextColor: number = Number(director.appContext.resolve(xml.str(node, "itemsTextColor", "0xFFFFFF")));
    const selectedItemTextColor: number = Number(director.appContext.resolve(xml.str(node, "selectedItemTextColor", "0xFFFFFF")));
    const carousel = new Carousel({
      spriteBG: spriteBG,
      numItemsShown: xml.num(node, "numItemsShown", 5),
      dropdown: dropdown,
      selected: selected,
      highlightColor: xml.num(node, "highlightColor", 0x555555),
      dropdownColor: xml.num(node, "dropdownColor", 0xaaaaaa),
      dropdownWidth: xml.num(node, "dropdownWidth", 150),
      itemHeight: xml.num(node, "itemHeight", 30),
      itemsTextColor: itemsTextColor,
      selectedItemTextColor: selectedItemTextColor,
      scaleTopBottomItems: xml.num(node, "scaleTopBottomItems", 0),
      scaleTopBottomValue: xml.num(node, "scaleTopBottomValue", 0.1),
      mouseWheelGap: xml.num(node, "mouseWheelGap", 30),
      mouseWheelEnabled: xml.bool(node, "mouseWheelEnabled", false),
      selectItemOnClick: xml.bool(node, "selectItemOnClick", false),
      style: xml.textStyle(node)
    });
    builder.setHandlers(carousel, node, args);
    if (xml.bool(node, "debug")) {
      builder.showHitArea(carousel);
    }
    builder.setProperties(carousel, node, args);
    return carousel;
  }
}
