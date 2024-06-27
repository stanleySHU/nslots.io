import * as builder from "../../engine/src/component/builder";
import { View } from "../../engine/src/component/component";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { setAnimationStatic } from "../animations/sceneAnimation";
import { playMainBGM, playWinBGM, stopMainBGM, stopWinBGM } from "../scenes/mainScene";

@Register({ tag: "mainUI" })
export class MainUI extends View {
  container: Layer & { spine: SpineAnimation };

  oncreate() {
    const infobar = slotApp.widgetService().get("mainInfobar");
    const spineSlot = this.container.spine.getSlotContainerByName("InfoBar");
    spineSlot.removeChildren();
    spineSlot.addChild(infobar);

    // const spineSlot2 = this.container.spine.getSlotContainerByName("TitleBar");
    // spineSlot2.removeChildren();
  }

  private getUI = () => {
    const spine = this.container.spine;
    return { spine };
  };

  changeToNormalUI() {
    const ui = this.getUI();
    ui.spine.x = 0;
    setAnimationStatic(ui.spine, "idleNorm", true);
    stopWinBGM();
    playMainBGM();
  }
  changeToFSUIAsync(): Promise<boolean> {
    stopMainBGM();
    playWinBGM();
    return new Promise((res) => {
      const ui = this.getUI();
      // ui.spine.x = 10;
      setAnimationStatic(ui.spine, "NormToFS", false, () => {
        res(true);
        setAnimationStatic(ui.spine, "idleFS", true);
      });
    });
  }

  init() {
    this.changeToNormalUI();
  }

  static create(node: Element, args: builder.BuildArgs) {
    const t = createObject(MainUI, node, args);
    t.oncreate();
    return t;
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
