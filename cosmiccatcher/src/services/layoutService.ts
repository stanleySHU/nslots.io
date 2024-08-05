import { isBlank } from "../../engine/src/core/lang";
import { Register } from "../../engine/src/core/registry";
import { Service } from "../../engine/src/core/service";
import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { OrientationService } from "../../engine/src/services/orientationService";
import * as slotApp from "../../engine/src/slotMachine/slotApp";

const EVENT_RESIZE = "events:resize";
const EVENT_WEB_RESIZE = "events:web_resize";

@Register({ tag: "layoutService", category: "service" })
export class LayoutService extends Service {
  private orientationService: OrientationService;
  private prevOrientation = 0;
  resizeAndOrientaionChecker: NodeJS.Timeout;
  windowHeight: number;
  windowWidth: number;
  windowOrientation: number | string;

  offsetX: number;
  offsetY: number;

  configure(options) {}

  startup() {
    if (!director.services.has("orientationService")) {
      director.services.register("orientationService", OrientationService).startup();
    }
    this.orientationService = director.services.get<OrientationService>("orientationService");
    if (!this.orientationService.started) this.orientationService.startup();
    // window.onresize = e => {
    //   this.layout();
    //   director.eventBus.emit(EVENT_RESIZE);
    // };
    //director.eventBus.on("notify:orientation.changed", this.orientationChangedHandler, this);
    this.resizeAndOrientaionChecker = setInterval(() => {
      this.checkResize();
      this.checkSecondaryOrientation();
    }, 30);
    this.checkResize();
  }

  checkResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (this.windowHeight !== h || this.windowWidth !== w) {
      this.windowHeight = h;
      this.windowWidth = w;
      this.layout();
      director.eventBus.emit(EVENT_RESIZE);
      director.eventBus.emit(EVENT_WEB_RESIZE);
    }
  }

  // to also fix layout everytime device is rotated in any direction
  checkSecondaryOrientation() {
    if (this.windowOrientation !== window.orientation) {
      this.windowOrientation = window.orientation;
      this.layout();
    }
  }

  shutdown() {
    // window.onresize = undefined;
    clearInterval(this.resizeAndOrientaionChecker);
  }

  // private orientationChangedHandler() {
  //   console.log("orientationChangedHandler");
  //   if (this.orientationService.mode === "both") {
  //     director.sceneManager.current.applyLayout(orientation === Orientation.PORTRAIT ? "portrait" : "landscape");
  //   }
  //   this.layout();
  // }

  private layout() {
    const options = director.options;
    let minWidth = options.minWidth;
    let minHeight = options.minHeight;
    let originalWidth = options.width;
    let originalHeight = options.height;
    let ratio = 1;
    let rotation = 0;
    const orientation = this.orientationService.getOrientation();
    setPortraitOnlyVisibility(false);
    if (
      (this.isBothEnaled && orientation === Orientation.PORTRAIT && !this.orientationService.strictLandscapeWeb) ||
      (this.isPortraitOnlyEnabled && this.isNotMobile && orientation === Orientation.LANDSCAPE) ||
      (this.isBothEnaled && orientation === Orientation.PORTRAIT && this.orientationService.strictLandscapeWeb && this.isMobileOrTablet)
    ) {
      //rotation = Math.PI / 2;
      originalWidth = options.height;
      originalHeight = options.width;
      minWidth = options.minHeight;
      minHeight = options.minWidth;
    } else if (this.isPortraitOnlyEnabled && this.isMobileOrTablet && orientation === Orientation.LANDSCAPE) {
      setPortraitOnlyVisibility(true);
    } else if (
      director.device.mobile &&
      ((this.orientationService.mode === "portrait" && orientation === Orientation.LANDSCAPE) ||
        (this.orientationService.mode === "landscape" && orientation === Orientation.PORTRAIT))
    ) {
      if (this.orientationService.strictMode) {
        if (this.orientationService.mode === "portrait") setPortraitOnlyVisibility(true);
      } else {
        rotation = Math.PI / 2;
        originalWidth = options.height;
        originalHeight = options.width;
        minWidth = options.minHeight;
        minHeight = options.minWidth;
      }
    }

    if (minWidth > 0 && minHeight > 0 && this.isMobileOrTablet) {
      const ratioB = Math.min(window.innerWidth / minWidth, window.innerHeight / minHeight);
      ratio = ratioB;
    } else {
      ratio = Math.min(window.innerWidth / (minWidth > 0 ? minWidth : originalWidth), window.innerHeight / originalHeight);
    }

    const width = Math.ceil(originalWidth * ratio);
    const height = Math.ceil(originalHeight * ratio);

    director.stage.scale.set(ratio);
    director.stage.rotation = rotation;

    if (this.isBothEnaled) {
      director.stage.position.set(0, 0);
      director.stage.pivot.set(0, 0);
    } else {
      director.stage.position.set(width / 2, height / 2);
    }

    director.renderer.resize(width, height);
    const marginLeft = (window.innerWidth - width) / 2;
    const marginTop = (window.innerHeight - height) / 2;
    const canvas = options.canvas;
    canvas.style.marginLeft = marginLeft + "px";
    canvas.style.marginTop = marginTop + "px";
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    this.offsetX = marginLeft / ratio;
    this.offsetY = marginTop / ratio;

    if (director.sceneManager.current) {
      if (this.prevOrientation != orientation && this.isBothEnaled) {
        director.sceneManager.current.onOrientationChange(orientation);
      }
      director.sceneManager.current.onSceneResize();
    }

    this.prevOrientation = orientation;
    this.scrollTop();
  }

  private scrollTop() {
    const device = director.device;
    if (device.mobile) {
      if (device.android && !device.chrome) {
        window.scrollTo(0, 1);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }

  get isBothEnaled() {
    return this.orientationService.mode === "both" || this.orientationService.mode === "portrait-only";
  }

  get isPortraitOnlyEnabled() {
    return this.orientationService.mode === "portrait-only";
  }

  get isNotMobile() {
    return !director.device.mobile && !director.device.tablet;
  }

  get isMobileOrTablet() {
    return director.device.mobile || director.device.tablet;
  }

  get deviceViewportOffset(): PIXI.Point {
    const iWidth: number = window.innerWidth;
    const iHeight: number = window.innerHeight;
    let oWidth: number = director.options.width;
    let oHeight: number = director.options.height;
    const scale: number = director.stage.scale.x;
    const offset: PIXI.Point = new PIXI.Point();
    if (this.isMobileOrTablet && this.orientationService.getOrientation() === Orientation.PORTRAIT) {
      oWidth = director.options.height;
      oHeight = director.options.width;
    }
    if (iWidth < oWidth * scale) {
      offset.x = Math.floor((oWidth * scale - iWidth) * (0.5 / scale));
    }
    if (iHeight < oHeight * scale) {
      offset.y = Math.floor((oHeight * scale - iHeight) * (0.5 / scale));
    }
    return offset;
  }
}

function setPortraitOnlyVisibility(isVisible: boolean) {
  // check if portrait only container exists
  const portraitOnlyContainer = document.getElementById("portraitonly");
  if (!portraitOnlyContainer) return;

  // set portrait only message
  const portraitOnlyText = document.getElementById("portraitonlytext");
  if (portraitOnlyText) {
    let msg: string = "Please use portrait mode for the best experience.";
    try {
      if (slotApp.translateWord("portraitonly")) {
        msg = slotApp.translateWord("portraitonly");
      }
    } catch (e) {}

    if (isBlank(msg)) msg = "Please use portrait mode for the best experience.";

    portraitOnlyText.textContent = msg;
  }
  setWrapperVisibility(!isVisible);

  portraitOnlyContainer.style.visibility = isVisible ? "visible" : "hidden";
}

function setWrapperVisibility(isVisible: boolean) {
  const wrapper = document.getElementById("wrapper");
  if (!wrapper) return;
  wrapper.style.visibility = isVisible ? "visible" : "hidden";
}
