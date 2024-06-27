import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import * as builder from "../../engine/src/component/builder";
import { View } from "../../engine/src/component/component";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { delayForSpine } from "../../engine/src/util/async";
import { setAnimationStatic } from "../animations/sceneAnimation";

@Register({ tag: "totalWinPanel" })
export class TotalWinPanel extends View {
  container: Layer & { spine: SpineAnimation };

  showTotalWin(amount: number) {
    this.container.visible = true;
    const isTurbo = slotApp.player().isTurbo;
    this.container.spine.timeScale = isTurbo ? 2 : 1;

    const spineSlot = this.container.spine.getSlotContainerByName("winNumber");
    const widgetLabel = slotApp.widgetService().get("totalWinLabel") as AnimatedLabel;
    if (spineSlot && widgetLabel) {
      spineSlot.removeChildren();
      spineSlot.addChild(widgetLabel);
      widgetLabel.duration = 300;
      widgetLabel.value = `${amount}`;
      setAnimationStatic(this.container.spine, "LineWin", false, () => {});
      delayForSpine(1500).then(() => {
        widgetLabel.setValueDirectly(`${amount}`);
        this.hideTotalWin();
      });
    }
  }

  private hideTotalWin() {
    this.container.visible = false;
  }

  static create(node: Element, args: builder.BuildArgs) {
    return createObject(TotalWinPanel, node, args);
  }
}

export function createObject(type: any, node: Element, args: builder.BuildArgs) {
  const objType = new type();

  builder.createChildren(node, {
    scene: args.scene,
    parent: objType,
    context: args.context
  });
  builder.setProperties(objType, node, args);
  return objType;
}
