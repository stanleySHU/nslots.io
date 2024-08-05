import { Button } from "../../engine/src/component/button";
import { service } from "../../engine/src/core/bindings";
import { Register } from "../../engine/src/core/registry";
import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { Scene } from "../../engine/src/scene";
import { LayoutService } from "../../engine/src/services/layoutService";
import { OrientationService } from "../../engine/src/services/orientationService";
import { SoundService } from "../../engine/src/services/soundService";
import { InfoPanel } from "../../engine/src/slotMachine/component/infoPanel";

@Register({ tag: "infoPage", category: "scene" })
export class InfoPageScene extends Scene {
  @service("layoutService")
  layoutService: LayoutService;
  @service("orientationService")
  orientationService: OrientationService;
  @service("soundService")
  soundService: SoundService;

  infoPanel: InfoPanel;
  btnBack: Button;
  btnBackX: number;
  bgmInfo: any;

  onCreated() {
    this.initCommand();
    this.playSound();
    this.onSceneResize();
  }

  initCommand() {
    director.inputManager.on("infoPage", () => {
      this.backClickHandler();
    });
  }

  backClickHandler() {
    director.sceneManager.replace("main");
  }

  playSound(play: boolean = true) {
    if (play) {
      if (this.soundService.switchScope(true)) {
        this.bgmInfo = this.soundService.play("bgm-info", "info");
      }
    } else {
      if (this.bgmInfo) this.soundService.stop(this.bgmInfo.soundId);
      this.soundService.switchScope();
      this.bgmInfo = null;
    }
  }

  onSceneResize() {
    const or = director.services.get<OrientationService>("orientationService").getOrientation();
    const layout = director.services.get<LayoutService>("layoutService");
    const offset = {
      x: -Math.min(0, layout.offsetX),
      y: -Math.min(0, layout.offsetY)
    };
    if (or == Orientation.PORTRAIT) {
      this.btnBack.x = director.options.height - 50 - offset.x;
    } else {
      this.btnBack.x = director.options.width - 50 - offset.x;
    }

    this.y = offset.y;
  }

  onOrientationChange(orientation?) {
    super.onOrientationChange(orientation);
    this.btnBackX = this.btnBack.x;
  }

  exit() {
    director.inputManager.off("infoPage");
    this.playSound(false);
    super.exit();
  }
}
