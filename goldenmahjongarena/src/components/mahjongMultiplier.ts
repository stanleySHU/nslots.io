import * as builder from "../../engine/src/component/builder";
import { View } from "../../engine/src/component/component";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { setAnimationStatic } from "../animations/sceneAnimation";
import { WIN_MULTIPLER_COUNT_FS, WIN_MULTIPLER_COUNT_NORMAL, WIN_MULTIPLER_COUNT_SFS } from "../constants";

export type MultiplierMode = "normal" | "freeSpin" | "superGold";

@Register({ tag: "mahjongMulti" })
export class MahjongMultiplier extends View {
  public mode: MultiplierMode = "normal";
  public activeIndex: number = -1;

  private getMultiplierLayers = () => {
    const normal = this["normal"] as Layer;
    const freeSpin = this["freeSpin"] as Layer;
    const superGold = this["superGold"] as Layer;
    return { normal, freeSpin, superGold };
  };

  init() {
    this.updateMultiplierLayer();
  }

  updateMultiplierLayer(mode: MultiplierMode = "normal") {
    this.mode = mode;
    const layers = this.getMultiplierLayers();

    layers.normal.visible = mode === "normal" ? true : false;
    layers.freeSpin.visible = mode === "freeSpin" ? true : false;
    layers.superGold.visible = mode === "superGold" ? true : false;
  }

  increaseMultiplier() {
    if (this.activeIndex < 3) {
      this._setMultiplierIndex(this.activeIndex + 1);
    }
  }
  private _setMultiplierIndex(index: number, playSound = true) {
    if (index != this.activeIndex) {
      const oldIndex = this.activeIndex;
      const oldSpine = (this[this.mode] as Layer)[`${oldIndex}spine`] as SpineAnimation;
      setAnimationStatic(oldSpine, "Deactivate", false);

      const newSpine = (this[this.mode] as Layer)[`${index}spine`] as SpineAnimation;
      setAnimationStatic(newSpine, "Activate", false);
      this.activeIndex = index;

      const scaleArr =
        this.mode == "normal" ? WIN_MULTIPLER_COUNT_NORMAL : this.mode == "freeSpin" ? WIN_MULTIPLER_COUNT_FS : WIN_MULTIPLER_COUNT_SFS;
      if (index > 0 && playSound) {
        slotApp.playSound(`scale${scaleArr[index]}`, "default");
      }
      // if (index > 0) slotApp.playSound(`multiplier${index + 1}`, "default");
    }
  }

  setMultiplierIndex(multiplier: number, mode: MultiplierMode = this.mode, playSound = true) {
    const t = {
      normal: WIN_MULTIPLER_COUNT_NORMAL,
      freeSpin: WIN_MULTIPLER_COUNT_FS,
      superGold: WIN_MULTIPLER_COUNT_SFS
    };
    const index = Math.max(0, t[mode].indexOf(multiplier));
    this._setMultiplierIndex(Math.min(index, 3), playSound);
  }

  resetMultiplierIndex() {
    if (this.activeIndex == 0) return;
    this.activeIndex = 0;

    const layers = this.getMultiplierLayers();
    for (let i = 0; i < 4; i++) {
      const normal = layers.normal[`${i}spine`] as SpineAnimation;
      if (normal.currentAction !== "Deactivate") setAnimationStatic(normal, "Deactivate", false);

      const freeSpin = layers.freeSpin[`${i}spine`] as SpineAnimation;
      if (freeSpin.currentAction !== "Deactivate") setAnimationStatic(freeSpin, "Deactivate", false);

      const superGold = layers.superGold[`${i}spine`] as SpineAnimation;
      if (freeSpin.currentAction !== "Deactivate") setAnimationStatic(superGold, "Deactivate", false);
    }

    const normal0 = layers.normal[`0spine`] as SpineAnimation;
    setAnimationStatic(normal0, "Activate", false);

    const freeSpin0 = layers.freeSpin[`0spine`] as SpineAnimation;
    setAnimationStatic(freeSpin0, "Activate", false);

    const superGold0 = layers.superGold[`0spine`] as SpineAnimation;
    setAnimationStatic(superGold0, "Activate", false);
  }

  static create(node: Element, args: builder.BuildArgs) {
    return createObject(MahjongMultiplier, node, args);
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
