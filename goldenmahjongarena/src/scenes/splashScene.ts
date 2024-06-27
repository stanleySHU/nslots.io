import { Animatable } from "../../engine/src/animation/animatable";
import { Layer } from "../../engine/src/component/layer";
import { service, viewByID } from "../../engine/src/core/bindings";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { WidgetService } from "../../engine/src/services/widgetService";
import { HtmlLayer } from "../../engine/src/slotMachine/component/htmlLayer";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import * as tween from "../../engine/src/util/tween";
import * as xml from "../../engine/src/util/xml";
//import * as scene from "../../engine/src/slotMachine/scenes/splashScene";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { SoundService } from "../../engine/src/services/soundService";
import { Lightning } from "../../engine/src/slotMachine/component/lightning/lightning";
import * as scene from "../../engine/src/slotMachine/scenes/splashBackgroundScene";
import { delayAnimatable } from "../../engine/src/util/async";
import { setAnimationStatic } from "../animations/sceneAnimation";
import * as constant from "../constants";
import { getLanguage } from "./mainScene";

@Register({ tag: "splash", category: "scene" })
export class SplashScene extends scene.SplashScene implements Animatable {
  @service("widgetService")
  widgetService: WidgetService;
  @viewByID("btncontinue")
  btncontinue: Layer;
  @viewByID("btnnavigate")
  btnnavigate: Layer;
  // @viewByID("btnprev")
  // btnprev: Layer;
  // @viewByID("btnnext")
  // btnnext: Layer;
  @viewByID("content")
  content: Layer;
  @viewByID("text")
  text: Layer;
  @viewByID("frame")
  frame: Layer;
  ray: Layer;
  details: Layer;
  light: Image;
  ufo: Image;
  scatterCounter: Label;
  meterMask: PIXI.Graphics;
  payline: Lightning;
  pages: Layer[];
  assetsLoaded: number = 0;
  loaded: boolean = false;
  shown: boolean = false;
  active: boolean = false;
  continue: boolean = false;
  tweenNav: TWEEN.Tween;

  tweenWild: TWEEN.Tween;
  reelIdx: number;
  timeoutReel: number;
  timeout: NodeJS.Timeout | number;
  currPageIdx: number;
  touchDownX: number;
  isDown: boolean = false;
  assets: string[];
  symbols: Layer[][][];
  consoleWarn: any;
  symbolWidth: number;
  symbolHeight: number;
  tweens: TWEEN.Tween[];
  acceleration: number;
  speed: number;
  private _introContent: Layer;

  @viewByID("panelbg")
  panelbg: Layer;
  @viewByID("logo")
  logo: Layer;
  @viewByID("reelBg")
  reelBg: Layer;

  @viewByID("textcontent")
  textcontent: Layer;
  txtPages: Layer[];

  onCreated() {
    super.onCreated();
    HtmlLayer.querySelector(".gplogo").hide();
    HtmlLayer.querySelector(".loader").hide();

    this.label.scale.set(1.5);
    this.version.scale.set(1.5);
    this.label.value = "0%";
  }

  exit(): void {
    const context = slotApp.context();
    context.initActitvityTimer();
    if (this.tweenNav) {
      this.tweenNav.stop();
      this.tweenNav = null;
    }
  }

  onProgress(progress: number) {
    this.label.value = Math.min(100, Math.round(progress * 100)) + "%";
    this.trackPageLoad();
  }

  protected onLoaded() {
    this.loaded = true;
    this.showIntro();
    this.showContinueButton();
  }

  showIntro() {
    if (this.shown) return;
    this.shown = true;

    this.active = true;
    this.pages = [];
    this.txtPages = [];
    this.currPageIdx = 0;

    // const logo = slotApp.widgetService().get("intro-logo");
    // this.logo.addChild(logo);
    // tween.fadeIn(this.logo, constant.INTRO_TIMER);

    tween.fadeOut(this.reelBg["info"], 100);

    const content = slotApp.widgetService().get("intro-content");
    this.content.addChild(content);
    tween.fadeIn(this.content, constant.INTRO_TIMER);
    this._introContent = content;

    // const tcontent = slotApp.widgetService().get("intro-text");
    // this.textcontent.addChild(tcontent);
    // tween.fadeIn(this.textcontent, constant.INTRO_TIMER);

    content.children.forEach((page: Layer, idx: number) => {
      if (page) {
        const btn = slotApp.widgetService().get("btn-navigator-" + (idx + 1)) as any;
        this.pages.push(page);
        page.visible = idx === this.currPageIdx;
        if (idx > this.currPageIdx) {
          page.x = page["bg"].width;
        }
        if (btn) {
          btn.interactive = btn.buttonMode = true;
          btn.on("click", () => this.navigatorClickHandler(idx)).on("tap", () => this.navigatorClickHandler(idx));
          btn.enabled = idx !== this.currPageIdx;
          this.btnnavigate.addChild(btn);
        }
      }

      const tpage = this.textcontent["introText"].children[idx] as Layer;
      this.txtPages.push(tpage);
      if (idx == 0) tpage.visible = true;
    });
    this.content.interactive = true; // this.btnprev.interactive = this.btnprev.interactiveChildren = this.btnnext.interactive = this.btnnext.interactiveChildren = true;
    this.content
      .on("mousedown", (e) => this.buttonDownHandler(e))
      .on("mouseup", (e) => this.buttonUpHandler(e))
      .on("mouseupoutside", (e) => this.buttonUpHandler(e))
      .on("touchstart", (e) => this.buttonDownHandler(e))
      .on("touchend", (e) => this.buttonUpHandler(e))
      .on("touchendoutside", (e) => this.buttonUpHandler(e))
      .on("touchmove", (e) => this.dropdownMoveHandler(e))
      .on("mousemove", (e) => this.dropdownMoveHandler(e));

    // this.btnprev.buttonMode = this.btnnext.buttonMode = true;
    // this.btnprev.on("click", () => this.btnPrevHandler())
    //             .on("tap", () => this.btnPrevHandler());
    // this.btnnext.on("click", () => this.btnNextHandler())
    //             .on("tap", () => this.btnNextHandler());

    this.active = true;
    this.page0Active();
    this.startIntro();
  }

  showContinueButton() {
    if (this.shown && this.loaded && !this.continue) {
      this.continue = true;
      tween.fadeOut(this.label, constant.INTRO_TIMER);
      tween.fadeOut(this.circle, constant.INTRO_TIMER);
      const btn = this.widgetService.get("btn-continue");
      this.btncontinue.addChild(btn);
      tween.fadeIn(this.btncontinue, constant.INTRO_TIMER, () => {
        (btn as any).onClickHandler = () => this.continueClickHandler();
        director.inputManager.on("continueClickHandler", () => this.continueClickHandler());
      });
    }
  }

  startIntro(animated: boolean = true) {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.navigatePage(this.currPageIdx + 1);
    }, 3200);
  }

  continueClickHandler() {
    if (!this.continue) return;
    this.continue = false;
    director.inputManager.off("continueClickHandler");
    this.active = this.btncontinue.interactive = this.btncontinue.interactiveChildren = false;
    if (this.timeout) clearTimeout(this.timeout);
    if (this.timeoutReel) clearTimeout(this.timeoutReel);
    slotApp.playSound("button", "default");
    delayAnimatable(300).then(() => this.closeScene());

    director.injector.map(constant.FROM_LOADING).toValue(true);
  }

  buttonDownHandler(e) {
    if (!this.active) return;
    this.isDown = true;
    this.touchDownX = e.data.getLocalPosition(this, e.data.global).x;
  }

  buttonUpHandler(e) {
    if (!this.isDown) return;
    this.isDown = false;
    if (!this.active) return;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
    this.active = false;
    this.content.interactive = false;
    const prevPageIdx = this.currPageIdx;
    const dx = e.data.getLocalPosition(this, e.data.global).x - this.touchDownX;
    if (dx > 0) {
      const properties = { x: this.currPage.x };
      this.tweenNav = new TWEEN.Tween(properties)
        .to({ x: dx > 100 ? this.currPage["bg"].width : 0 }, 300)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          this.currPage.x = properties.x;
          this.prevPage.x = this.currPage.x - this.currPage["bg"].width;
        })
        .onComplete(() => {
          this.tweenNav.stop();
          this.tweenNav = null;
          if (dx > 100) {
            this.setPageIndex(this.currPageIdx > 0 ? this.currPageIdx - 1 : this.pages.length - 1);
          }
          this.startIntro(this.currPageIdx !== prevPageIdx);
          this.active = true;
          this.content.interactive = true;
        });
      this.tweenNav.start();
    } else {
      const properties = { x: this.currPage.x };
      this.tweenNav = new TWEEN.Tween(properties)
        .to({ x: dx < -100 ? -this.currPage["bg"].width : 0 }, 300)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          this.currPage.x = properties.x;
          this.nextPage.x = this.currPage.x + this.currPage["bg"].width;
        })
        .onComplete(() => {
          this.tweenNav.stop();
          this.tweenNav = null;
          if (dx < -100) {
            this.setPageIndex(this.currPageIdx === this.pages.length - 1 ? 0 : this.currPageIdx + 1);
          }
          this.startIntro(this.currPageIdx !== prevPageIdx);
          this.active = true;
          this.content.interactive = true;
        });
      this.tweenNav.start();
    }
  }

  dropdownMoveHandler(e) {
    if (this.isDown) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = 0;
      }
      const dx = e.data.getLocalPosition(this, e.data.global).x - this.touchDownX;
      this.currPage.x = dx;
      if (dx > 0) {
        this.nextPage.visible = false;
        this.prevPage.visible = true;
        this.prevPage.x = this.currPage.x - this.currPage.width;
      } else {
        this.prevPage.visible = false;
        this.nextPage.visible = true;
        this.nextPage.x = this.currPage.x + this.currPage.width;
      }
    }
  }
  btnPrevHandler() {
    this.navigatePage(this.currPageIdx - 1);
  }

  btnNextHandler() {
    this.navigatePage(this.currPageIdx + 1);
  }

  navigatorClickHandler(idx: number) {
    if (!this.getButtonNavigator(idx).enabled) return;
    this.navigatePage(idx);
  }

  getButtonNavigator(idx: number): any {
    return this.btnnavigate.getChildAt(idx) as any;
  }
  setPageIndex(index: number) {
    if (this.currPageIdx === index) return;
    this[`page${this.currPageIdx}Dactive`]();
    for (let i = 0; i < this.pages.length; i++) {
      this.pages[i].visible = false;
      this.getButtonNavigator(i).enabled = true;
    }
    const prev = this.pages[this.currPageIdx];
    this.txtPages[this.currPageIdx].visible = false;
    this.currPageIdx = index;
    this.pages[index].activate();
    this.currPage.visible = true;
    this.currTextPage.visible = true;
    this.getButtonNavigator(index).enabled = false;
    this[`page${index}Active`]();
  }

  navigatePage(idx: number) {
    if (!this.active) return;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
    this.active = false;
    this.content.interactive = false;
    const prevPageIdx = this.currPageIdx;
    let currPageIdx = idx;
    let assignment = currPageIdx > prevPageIdx ? 1 : -1;
    if (currPageIdx >= this.pages.length) {
      currPageIdx = 0;
      assignment = 1;
    } else if (currPageIdx < 0) {
      currPageIdx = this.pages.length - 1;
      assignment = -1;
    }
    this.getButtonNavigator(prevPageIdx).enabled = true;
    this.getButtonNavigator(currPageIdx).enabled = false;
    this.pages[currPageIdx].visible = true;
    const properties = { x: assignment * this.pages[currPageIdx]["bg"].width };
    this.tweenNav = new TWEEN.Tween(properties)
      .to({ x: 0 }, 600)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.pages[currPageIdx].x = properties.x;
        this.pages[prevPageIdx].x = this.pages[currPageIdx].x - this.pages[currPageIdx]["bg"].width * assignment;
      })
      .onComplete(() => {
        this.tweenNav.stop();
        this.tweenNav = null;
        this.setPageIndex(currPageIdx);
        this.startIntro();
        this.active = true;
        this.content.interactive = true;
      });
    this.tweenNav.start();
  }

  private _page0Zhongs: SpineAnimation[][] = null;
  private _page1Zhongs: SpineAnimation[][] = null;
  getPageComponents(e: number) {
    const pageContent = this._introContent[`page${e}`].content as Layer;
    if (!this[`_page${e}Zhongs`]) {
      const zhongs = [];
      const fsZhongs = [];
      for (const childrens of pageContent.children) {
        for (const children of childrens.children) {
          if ((children as Layer).id == "Zhong") {
            zhongs.push(children as Layer);
          } else if ((children as Layer).id == "FSZhong") {
            fsZhongs.push(children as Layer);
          }
        }
      }
      this[`_page${e}Zhongs`] = [zhongs, fsZhongs];
      if (this._introContent[`page${e}`].content["column5"]) {
        this._introContent[`page${e}`].content["column5"]["wild"].setSkin(`Wild_${getLanguage(true)}`);
      }
    }
    return this[`_page${e}Zhongs`];
  }

  page0Active() {
    const [zhongs, fsZhongs] = this.getPageComponents(0);
    for (const item of zhongs) {
      setAnimationStatic(item, "TileTrigger", true, () => {});
    }
    for (const item of fsZhongs) {
      setAnimationStatic(item, "TileTrigger", true, () => {});
    }
  }

  page0Dactive() {
    const [zhongs, fsZhongs] = this.getPageComponents(0);
    for (const item of zhongs) {
      item.setAnimation(0, "TileTrigger", false);
      (item as SpineAnimation).resetTrackTime();
      item.animated = false;
    }
    for (const item of fsZhongs) {
      item.setAnimation(0, "TileTrigger", false);
      (item as SpineAnimation).resetTrackTime();
      item.animated = false;
    }
  }

  page1Active() {
    const [zhongs, fsZhongs] = this.getPageComponents(1);
    for (const item of zhongs) {
      setAnimationStatic(item, "Tile FlipMerged", false, () => {});
    }
    for (const item of fsZhongs) {
      setAnimationStatic(item, "Tile FlipMerged", false, () => {
        this._introContent["page1"].content["column5"].visible = true;
      });
    }
  }

  page1Dactive() {
    const [zhongs, fsZhongs] = this.getPageComponents(1);
    for (const item of zhongs) {
      item.setAnimation(0, "Tile FlipMerged", false);
      (item as SpineAnimation).resetTrackTime();
      item.animated = false;
    }
    for (const item of fsZhongs) {
      item.setAnimation(0, "Tile FlipMerged", false);
      (item as SpineAnimation).resetTrackTime();
      item.animated = false;
    }
    this._introContent["page1"].content["column5"].visible = false;
  }

  page2Active() {
    const pageContent = this._introContent["page2"].content;
  }

  page2Dactive() {
    const pageContent = this._introContent["page2"].content;
  }

  closeScene() {
    //removed
    // director.resourceManager.postLoad();

    console.warn = this.consoleWarn;
    this.next = xml.str(this.layout, "next", null);
    const soundService = director.services.get<SoundService>("soundService");
    if (soundService.backgroundMusic) {
      soundService.stopBgm();
    }
    if (this.next) this.transit();
  }

  get currTextPage(): Layer {
    return this.txtPages[this.currPageIdx];
  }
  get currPage(): Layer {
    return this.pages[this.currPageIdx];
  }

  get nextPage(): Layer {
    return this.pages[this.currPageIdx === this.pages.length - 1 ? 0 : this.currPageIdx + 1];
  }

  get prevPage(): Layer {
    return this.pages[this.currPageIdx > 0 ? this.currPageIdx - 1 : this.pages.length - 1];
  }
}
