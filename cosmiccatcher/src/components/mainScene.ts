import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import { ButtonSlide } from "../../engine/src/component/button.slide";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { SoundService } from "../../engine/src/services/soundService";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { delayAnimatable, delayForSpine } from "../../engine/src/util/async";
import { WINLINE_DURATIONS, WINLINE_LEVELS } from "../constants";
import { SpinModel } from "../model/spinModel";
import { BetPanel } from "./betPanel";
import { BonusEffect } from "./bonusEffect";
import { Chase } from "./chase";
import { DoubleSelecter } from "./doubleSelecter";
import { MainScene as _MainScene } from "./mainSceneV2";
import { Reel } from "./reel";
import { WinPanel } from "./winPanel";

type GameStatusTypeV1 = "idle" | "spinning" | "stopping";
type GameStatusTypeV2 = GameStatusTypeV1 | "showWinBonus1";
type GameStatusTypeV3 = GameStatusTypeV2 | "showWinBonus2" | "reStopping" | "reSpinning";
type GameStatusTypeV4 = GameStatusTypeV3 | "selectDouble";
export type GameStatusType = GameStatusTypeV4;

@Register({ tag: "main", category: "scene" })
export class MainScene extends _MainScene {
  rspModel: SpinModel;
  gameStatus: GameStatusType = "idle";
  statusOrder: GameStatusType[] = [];

  winPanel: WinPanel;
  betPanel: BetPanel;
  doubleSelecter: DoubleSelecter;
  bonusEffect: BonusEffect;
  reel: Reel;
  infoBar: Layer & { message: Label; amount: AnimatedLabel };
  spinButton: ButtonSlide;
  clearButton: ButtonSlide;
  collectContainer: Layer & { collectButton: ButtonSlide; fx: Layer };
  chase: Chase;
  winmeterSound: any;

  constructor(e) {
    super(e);
  }

  ui: SpineAnimation;
  symbol1: Image;
  symbol2: Image;
  onCreated() {
    super.onCreated();
    this.reel.spinStopHandler = this.handleStoped.bind(this);
    this.showMessage("Please Spin");
    this.menu.init(this.context);
    this.initMainBGM();

    this.restore();
  }

  restore() {
    const restore = director.injector.get("gameState");
    if (restore.bonus && restore.bonus.gameResult) {
      this.rspModel = new SpinModel({ value: restore.bonus.gameResult });
      if (this.rspModel.bonusSymbolInfos.length > 0) {
        this.reel.showWinSymbols(this.rspModel.bonusSymbolInfos);
      } else {
        this.reel.showWinSymbols([this.rspModel.symbolInfo]);
      }
      this.statusOrder.push("selectDouble", "idle");
      this.nextStatus();
    }
  }

  //events
  onBet(e: any, bet: number) {
    if (this.gameStatus == "idle") this.betPanel.onBet(e, bet);
  }

  onClearBet() {
    this.betPanel.onClearBet();
  }

  onSpin() {
    if (this.gameStatus == "selectDouble") {
      this.onCollectDoubleUp();
    } else {
      super.onSpin();
      const betCountData = this.betPanel.betCountData;
      const totalBet = this.player.totalBet.times(betCountData.count);
      if (betCountData.bet.length > 0) {
        if (!this.player.balance.greaterThanOrEqualTo(totalBet)) {
          slotApp.showTranslateErr("10");
        } else {
          this.setButtonStatus(false);
          this.reel.showBoxSpineOnce().then(() => {
            slotApp.playSound("spin_button");
            this.netService.spin(betCountData.bet).then(this.spinServiceHandler.bind(this));
            this.statusOrder.push("spinning");
            this.nextStatus();
          });

          const updateBal = this.player.balance.minus(totalBet);
          this.animateBalanceAmount(updateBal);
        }
      } else {
        slotApp.playSound("button");
        //请下注
      }
    }
  }

  onCollectDoubleUp() {
    this.enableCollectButton(false);
    this.netService.collectDoubleUp().then((rsp) => {
      const model = new SpinModel(rsp);
      this.showWin(model.win.toNumber(), model.bet.toNumber());
    });
  }

  onBig() {
    this.doubleSelecter.onBig();
    this.handleDoubleUp(false);
  }

  onSmall() {
    this.doubleSelecter.onSmall();
    this.handleDoubleUp(true);
  }

  //
  handleBonus() {
    this.netService.bonus({
      key: "",
      step: 1,
      index: 0
    });
  }

  handleDoubleUp(isLow: boolean) {
    this.netService.doubleUp(isLow).then((rsp) => {
      const model = new SpinModel(rsp);

      this.doubleSelecter
        .toStop(model.doubleup.value)
        .then(() => delayForSpine(2000))
        .then(() => {
          if (model.doubleup.isWin) {
            slotApp.playSound("Double_up_win");
            this.showWinAmount(model.win.toNumber(), 500)
              .then(() => delayAnimatable(500))
              .then(() => {
                if (model.doubleup.isComplete) {
                  this.showWin(model.win.toNumber(), model.bet.toNumber());
                } else {
                  this.doubleSelecter.reset();
                }
              });
          } else {
            //lose
            slotApp.playSound("Double_up_lose");
            this.showMessage("You Lose");
            this.doubleSelecter.lose(true);
            this.showCollectButton(false);
            this.nextStatus();
          }
        });
    });
  }

  handleStoped() {
    this.stopSoundSpinning();

    slotApp.playSound("reel_stop");
    delayAnimatable(300).then(() => {
      if (this.rspModel.isExistWin) {
        if (this.rspModel.isBonus) {
          slotApp.playSound("high_win", "default", true);
        } else {
          slotApp.playSound("normal_win", "default", true);
        }
      } else {
        slotApp.playSound("no_win", "default", true);
      }
    });

    if (this.gameStatus == "stopping") {
      this.reel.showSpinStoped(this.rspModel.symbolInfo);
    } else {
      this.reel.showSpinStoped(this.rspModel.bonusSymbolInfos[0]);
    }
    delayAnimatable(500).then(() => {
      this.statusOrder = [];
      if (this.gameStatus == "stopping") {
        if (this.rspModel.isBonus1) {
          this.statusOrder.push("showWinBonus1");
        } else if (this.rspModel.isBonus2) {
          this.statusOrder.push("showWinBonus2", "reSpinning", "reStopping");
        }
      } else if (this.gameStatus == "reStopping") {
      }
      if (this.rspModel.isExistWin) {
        this.statusOrder.push("selectDouble");
      }
      this.statusOrder.push("idle");

      if (this.gameStatus == "reStopping") {
        this.bonusEffect.hideBonus2().then(() => {
          this.nextStatus();
        });
      } else {
        this.nextStatus();
      }
    });
  }

  spinServiceHandler(rsp) {
    const model = new SpinModel(rsp);
    this.rspModel = model;
    this.statusOrder.push("stopping");
    this.nextStatus();
  }

  nextStatus() {
    const status = this.statusOrder.shift();
    if (status) {
      this.gameStatus = status as GameStatusType;

      switch (this.gameStatus) {
        case "idle": {
          // this.reel.showWinSymbols([]);
          this.stopBgmLayer();
          this.betPanel.onClearBet();
          this.setButtonStatus();
          this.betPanel.hideWinFrame();
          this.doubleSelecter.hide();
          this.showCollectButton(false);
          break;
        }
        case "spinning": {
          // spin_button
          this.playSoundSpinning();
          this.showMessage("Good Luck");
          this.reel.onSpin(false);
          this.doubleSelecter.hide();
          this.reel.showWinSymbols([]);
          this.setButtonStatus();
          break;
        }
        case "reSpinning": {
          this.reel.showWinSymbols([]);
          this.playSoundSpinning();
          slotApp.playSound("spin_button");
          this.showMessage("Good Luck");
          this.reel.onSpin(true);
          this.doubleSelecter.hide();
          break;
        }
        case "stopping": {
          this.reel.toStop(this.rspModel.symbolInfo);
          break;
        }
        case "reStopping": {
          this.reel.toStop(this.rspModel.bonusSymbolInfos[0]);
          break;
        }
        case "showWinBonus1": {
          this.chase.showBonus1().then(() => {
            this.reel.showWinSymbols([]);
            delayForSpine(300).then(() => {
              slotApp.playSound("bonus_Multiselect_win", "default", true);
              this.bonusEffect.showBonus1(this.rspModel.bonusSymbolInfos).then(() => {
                this.nextStatus();
              });
              delayForSpine(2000).then(() => {
                this.reel.showWinSymbols(this.rspModel.bonusSymbolInfos);
              });
            });
          });
          break;
        }
        case "showWinBonus2": {
          this.showMessage("YOU WON A RESPIN");
          delayForSpine(1000).then(() => {
            delayForSpine(300).then(() => {
              slotApp.playSound("bonus_Multiplier_win", "default", true);
              this.bonusEffect.showBonus2(this.rspModel.bonusSymbolInfos[0].multiplier).then(() => {
                this.nextStatus();
                delayAnimatable(2000).then(this.nextStatus.bind(this));
              });
            });
          });
          break;
        }
        case "selectDouble": {
          this.playBgmLayer();
          this.enableCollectButton(true);
          this.showCollectButton(true);
          this.showWinAmount(this.rspModel.win.toNumber(), 500);
          this.doubleSelecter.show();
          if (this.rspModel.bonusSymbolInfos.length > 0) {
            this.betPanel.showWinFrame(this.rspModel.bonusSymbolInfos);
          } else {
            this.betPanel.showWinFrame([this.rspModel.symbolInfo]);
          }
          break;
        }
        default: {
        }
      }
    }
  }

  setButtonStatus(e: boolean = true) {
    this.spinButton.enabled = e && this.gameStatus == "idle";
    this.clearButton.enabled = e && this.gameStatus == "idle";
  }

  showMessage(e: string) {
    this.infoBar.message.value = e;
    this.infoBar.message.visible = true;
    this.infoBar.amount.visible = false;
  }

  showWinAmount(value: number, duration: number): Promise<void> {
    this.infoBar.message.visible = false;
    this.infoBar.amount.visible = true;
    this.infoBar.amount.duration = duration;
    this.infoBar.amount.value = `${value}`;
    return delayAnimatable(duration);
  }

  onOrientationChange(orientation) {
    super.onOrientationChange(orientation);
    this.reel.onOrientationChanged(orientation);
    this.bonusEffect.onOrientationChanged(orientation);
  }

  showCollectButton(e: boolean) {
    this.spinButton.visible = !e;
    this.collectContainer.visible = e;
  }

  enableCollectButton(e: boolean) {
    this.collectContainer.collectButton.enabled = e;
    this.collectContainer.fx.visible = e;
  }

  showWin(e: number, bet: number) {
    const win = new Decimal(e);
    const winMultiper = win.div(bet).toNumber();
    let winLevel = 0;
    if (win.gt(0)) {
      for (let i = WINLINE_LEVELS.length - 1; i >= 0; i--) {
        if (winMultiper >= WINLINE_LEVELS[i]) {
          winLevel = i;
          break;
        }
      }
      if (winLevel == WINLINE_LEVELS.length - 1) {
        // if (win) {
        //big win
        slotApp.playSound("big_win", "default", true);
        this.winPanel.showWin(win.toNumber()).then(() => {
          this.animateBalanceAmount(this.rspModel.balance);
          this.nextStatus();
        });
      } else {
        this.winPanel.playWinEffect(winLevel);
        this.winmeterSound = slotApp.playSound(`winmeter${winLevel + 1}`, "default", true);
        delayAnimatable(WINLINE_DURATIONS[winLevel] * 1000).then(() => {
          this.animateBalanceAmount(this.rspModel.balance);
          this.winPanel.removeWinEffect();
          this.nextStatus();
        });
        //win
      }
      this.showMessage(`you collect ${win}`);
    }
  }

  //sound
  fade(from, to, sound, time = 500, delay = 0, callback?) {
    const soundService = director.services.get<SoundService>("soundService");
    if (sound && sound.volume === to) {
      soundService.setVolume(to, sound.soundId);
      return null;
    }
    const properties = { volume: from };
    const soundId = sound ? sound.soundId : undefined;
    const tween = new TWEEN.Tween(properties)
      .to({ volume: to }, time)
      .onUpdate(() => {
        soundService.setVolume(properties.volume, soundId);
      })
      .onComplete(() => {
        if (sound) {
          sound.volume = properties.volume;
        }
        if (callback) {
          callback();
        }
      })
      .delay(delay);
    tween.start();
    return tween;
  }

  private bgmMain: any;
  private bgmMainLayer: any;
  private _soundSpinning = null;
  initMainBGM() {
    if (director.device.isUCBrowser) return;
    const soundService = director.services.get<SoundService>("soundService");
    soundService.stopBgm();
    soundService.volume = 0;

    this.bgmMain = slotApp.playSound("bgm-main", "default", true);

    this.playMainBGM();
    delayAnimatable(200).then(() => {
      soundService.volume = 1;
      soundService.setVolume(1, this.bgmMain.soundId);
      this.bgmMain.volume = 1;
    });
  }

  playMainBGM(time: number = 500) {
    if (!this.bgmMain || director.device.isUCBrowser) return;
    const soundService = director.services.get<SoundService>("soundService");
    if (this.bgmMain.volume === 0) {
      soundService.setVolume(0, this.bgmMain.soundId);
      this.bgmMain.volume = 0;
      this.fade(0, 1, this.bgmMain, time);
    } else {
      soundService.setVolume(1, this.bgmMain.soundId);
      this.bgmMain.volume = 1;
    }
  }

  stopMainBGM(isbgm?: boolean, time: number = 500) {
    if (!this.bgmMain || director.device.isUCBrowser) return;
    const soundService = director.services.get<SoundService>("soundService");
    if (this.bgmMain.volume === 1) {
      soundService.setVolume(1, this.bgmMain.soundId);
      this.bgmMain.volume = 1;
      this.fade(1, 0, this.bgmMain, time);
    } else {
      soundService.setVolume(0, this.bgmMain.soundId);
      this.bgmMain.volume = 0;
    }
  }

  playSoundSpinning() {
    if (director.device.isUCBrowser) return;
    this._soundSpinning = slotApp.playSound("reelspinningbgm", "default", true);
  }

  stopSoundSpinning() {
    if (this._soundSpinning) {
      slotApp.stopSound(this._soundSpinning);
      this._soundSpinning = null;
    }
  }

  playBgmLayer() {
    if (director.device.isUCBrowser) return;
    this._soundSpinning = slotApp.playSound("bgm-main-layer", "default", true);
  }

  stopBgmLayer() {
    if (this._soundSpinning) {
      slotApp.stopSound(this._soundSpinning);
      this._soundSpinning = null;
    }
  }
}
