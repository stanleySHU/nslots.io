import { Spine } from "pixi-spine";
import * as builder from "../../engine/src/component/builder";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import { Orientation } from "../../engine/src/core/types";
import { delayForSpine } from "../../engine/src/util/async";
import * as tween from "../../engine/src/util/tween";
import { WheelStopPosition } from "../model/spinModel";

@Register({ tag: "bonusEffect", category: "component" })
export class BonusEffect extends Layer {
  orientation: Orientation;
  argument1: string;
  argument2: string;
  bonus1: SpineAnimation;
  bonus2: SpineAnimation;
  multiperLayer: Layer & { _2: Label; _3: Label; _5: Label; _10: Label };
  beams: Layer & { beam0: SpineAnimation; beam1: SpineAnimation; beam2: SpineAnimation; beam3: SpineAnimation; beam4: SpineAnimation };

  private _beamLAngle: number[];
  private _beamPAngle: number[];
  get beamLAngle() {
    if (!this._beamLAngle) {
      this._beamLAngle = this.argument1.split(",").map((item) => Number(item));
    }
    return this._beamLAngle;
  }

  get beamPAngle() {
    if (!this._beamPAngle) {
      this._beamPAngle = this.argument2.split(",").map((item) => Number(item));
    }
    return this._beamPAngle;
  }

  get beamAngle() {
    return this.orientation == Orientation.LANDSCAPE ? this.beamLAngle : this.beamPAngle;
  }

  init() {}

  showBonus1(symbolInfos: WheelStopPosition[]): Promise<void> {
    const spine: Spine = this.bonus1[`animation`];
    spine.state.setAnimation(0, "bonusAL_entry", false);
    spine.state.addAnimation(0, "bonusAL_idle", true, 0);
    this.bonus1.setVisibleAnimated(true);
    return delayForSpine(2000).then(() => {
      return this.showBeams(symbolInfos).then(() => {
        spine.state.setAnimation(0, "bonusAL_exit", false);
        return delayForSpine(1000);
      });
    });
  }

  showBonus2(multiper: number): Promise<void> {
    return new Promise((resolve) => {
      const spineSlot = this.bonus2.getSlotContainerByName("FS_AMT");
      spineSlot.removeChildren();
      spineSlot.addChild(this.multiperLayer[`_${multiper}`]);

      this.bonus2.setAnimation(0, "bonusBL", false);
      const listener = this.bonus2.addCompleteListener(() => {
        this.bonus2["animation"].state.clearListeners();
        this.bonus2.setAnimation(0, "bonusBL_smallIdle", true);
        delayForSpine(500).then(() => {
          resolve();
        });
      });
      this.bonus2.setVisibleAnimated(true);
    });
  }

  hideBonus2(): Promise<void> {
    tween.fadeOut(this.bonus2, 500, () => {
      this.bonus2.alpha = 1;
      this.bonus2.setVisibleAnimated(false);
    });
    return delayForSpine(500);
  }

  onOrientationChanged(orientation) {
    this.orientation = orientation;
  }

  private getBeam(index: number) {
    return this.beams[`beam${index}`];
  }

  private showBeams(symbolInfos: WheelStopPosition[]): Promise<void> {
    const beamAngle = this.beamAngle;
    for (let i = 0; i < symbolInfos.length; i++) {
      const item = symbolInfos[i];
      const beam = this.getBeam(i);
      beam.setVisibleAnimated(true);
      beam.rotation = (beamAngle[item.index] * Math.PI) / 180;
    }
    return delayForSpine(2000).then(() => {
      for (let i = 0; i < symbolInfos.length; i++) {
        const beam = this.getBeam(i);
        beam.setVisibleAnimated(false);
      }
    });
  }

  static create(node: Element, args) {
    const obj = new BonusEffect();
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
