import { Layer } from "../../engine/src/component/layer";
import { Register } from "../../engine/src/core/registry";
import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { Scene } from "../../engine/src/scene";
import { delayAnimatable } from "../../engine/src/util/async";
import { Reel } from "./reel";

const I_WinSymbol = { symbol: 2, index: 0, multiplier: 1 };
const I_Bonus2Example = { symbol: 1, index: 11, multiplier: 1 };

@Register({ tag: "splash", category: "scene" })
export class SplashScene extends Scene {
  container: Layer & { reel: Reel };
  timer: NodeJS.Timeout;
  status: "spin" | "respin" = "spin";
  exist: boolean;

  onContinue() {
    director.sceneManager.replace("main");
  }

  onCreated() {
    super.onCreated();
    director.inputManager.on("continueClickHandler", this.onContinue.bind(this));

    this.container.reel.spinStopHandler = this.spinStopHandler.bind(this);

    delayAnimatable(1000).then(this.run.bind(this));

    director.services.get<any>("deviceService").fullScreenEnabled = true;
    const i18nService = director.services.get<any>("i18nService");
    if (i18nService) i18nService.setTitle();
  }

  exit() {
    super.exit();
    this.exist = true;
    director.inputManager.off("continueClickHandler", this.onContinue.bind(this));
  }

  run() {
    if (this.exist) return;
    if (this.status == "spin") {
      this.container.reel.onSpin(false);
      delayAnimatable(1000).then(() => {
        this.container.reel.toStop(I_Bonus2Example);
      });
    } else if (this.status == "respin") {
      this.container.reel.onSpin(true);
      delayAnimatable(1000).then(() => {
        this.container.reel.toStop(I_WinSymbol);
      });
    }
  }

  spinStopHandler() {
    if (this.status == "spin") {
      this.status = "respin";
      this.container.reel
        .showSpinStoped(I_Bonus2Example)
        .then(() => delayAnimatable(1000))
        .then(() => {
          this.container.reel.showWinSymbols([]);
          this.run();
        });
    } else if (this.status == "respin") {
      this.status = "spin";
      this.container.reel.showSpinStoped(I_WinSymbol);
      delayAnimatable(4000).then(() => {
        this.container.reel.showWinSymbols([]);
        this.run();
      });
    }
  }

  onLeft() {}

  onRight() {}

  onOrientationChange(orientation) {
    super.onOrientationChange(orientation);
    this.container.reel.onOrientationChanged(Orientation.LANDSCAPE);
  }
}
