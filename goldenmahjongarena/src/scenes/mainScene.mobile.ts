import * as director from "../../engine/src/director";
import * as constant from "../constants";
import * as main from "./mainScene";

import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import { Button } from "../../engine/src/component/button";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Languages } from "../../engine/src/core/appContext";
import { service, viewByID } from "../../engine/src/core/bindings";
import { Register } from "../../engine/src/core/registry";
import { SoundService } from "../../engine/src/services/soundService";
import { WidgetService } from "../../engine/src/services/widgetService";
import {
  EVENTS_REEL_ALLSTOP,
  EVENTS_REEL_READY_STOP,
  EVENTS_REEL_STOP,
  InBackAnimator
} from "../../engine/src/slotMachine/component/inBackAnimatorAll";
import { MainScene } from "../../engine/src/slotMachine/scenes/mainScene.shared";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { delayForSpine } from "../../engine/src/util/async";
import { SceneAnimation, fadeInComonentAndVisible, fadeOutComonentAndVisible, setAnimationStatic } from "../animations/sceneAnimation";
import { BuyBonus } from "../components/buyBonus";
import { MahjongMultiplier, MultiplierMode } from "../components/mahjongMultiplier";
import { MainUI } from "../components/mainUI";
import { Reels } from "../components/reels2";
import { TotalWinPanel } from "../components/totalWinPanel";
import { YouWonPanel } from "../components/youWonPanel";
import { GAME_STATE, GAME_TYPE, ResultResponse } from "../type";
import { CollapsingState, GameFreeSpin, GamePreFreeSpin, GamePreSuperGold, GameSuperGold } from "./sceneStates";

@Register({ tag: "main", category: "scene" })
export class GameMainScene extends MainScene {
  //service
  @service("widgetService")
  widgetService: WidgetService;

  //game logic
  deactivated: boolean = false;
  isBonus: boolean = false;
  isSuperGold: boolean = false;
  // inFreeSpin: boolean = false;
  forceStop: boolean = false;
  toBonus: boolean = false;

  //components
  animation: SceneAnimation;

  @viewByID("mahjongMulti")
  mahjongMultiplier: MahjongMultiplier;

  @viewByID("totalWinPanel")
  totalWinPanel: TotalWinPanel;

  @viewByID("youWonPanel")
  youWonPanel: YouWonPanel;

  @viewByID("buyBonus")
  buyBonus: BuyBonus;

  @viewByID("mainUI")
  mainUI: MainUI;

  @viewByID("cornerSFs")
  cornerSFs: Image;

  @viewByID("cornerFs")
  cornerFs: Image;

  @viewByID("cornerN")
  cornerN: Image;

  @viewByID("slotFire")
  slotFire: Layer & { p2: Layer & { spine: SpineAnimation }; p3: Layer & { spine: SpineAnimation }; p4: Layer & { spine: SpineAnimation } };

  @viewByID("fspanel")
  fspanel: Layer & { label: Label };

  @viewByID("sfspanel")
  sfspanel: Layer & { label: Label };

  mainBg: Layer;
  freeBg: Layer;

  //data
  resultResponse: ResultResponse;

  //layouts
  winLevelLabel: AnimatedLabel;
  wineffectbox: Layer;

  buyBonusOpend: boolean;

  @viewByID("bigWinEffectbox")
  bigWinEffectbox: Layer;

  @viewByID("getFreeEffectbox")
  getFreeEffectbox: Layer;

  @viewByID("freeWinEffectbox")
  freeWinEffectbox: Layer;

  @viewByID("bgp")
  bgp: Layer;

  @viewByID("buyBonusBtn")
  buyBonusBtn: Button;

  @viewByID("buyBonusBtnspine")
  buyBonusBtnspine: SpineAnimation;

  gameState: GAME_STATE = "IDLE";
  gameType: GAME_TYPE = "real";

  enter() {
    const soundService = director.services.get<SoundService>("soundService");
    if (soundService) {
      soundService.volume = 0;
    }
    super.enter();
  }

  onCreated() {
    super.onCreated();
    (this.reels as any).sortSymbols();
    this.deactivated = false;
    this.animation = new SceneAnimation(this);
    main.setState(this);
    main.initMainBGM();

    if (this.buyBonus) {
      this.buyBonus.on(BuyBonus.EVENTS_BUY_BONUS_CONFIRMED, (mode: "fs" | "sfs") => {
        if (mode === "fs") this.setCreditBet(constant.CREDIT_FREESPINS);
        if (mode === "sfs") this.setCreditBet(constant.CREDIT_SUPER_FREESPINS);
        this.state.clickSpinHandler();
        this.setCreditBet();
      });
    }

    director.inputManager.on(EVENTS_REEL_READY_STOP, (col) => this.addSlotFire(col));
    director.inputManager.on(EVENTS_REEL_STOP, (col) => this.removeSlotfire(col));
    director.inputManager.on(EVENTS_REEL_ALLSTOP, (col) => this.allReelsStop());

    if (director.injector.get(constant.FROM_LOADING)) {
      this.initTo();
      director.injector.map(constant.FROM_LOADING).toValue(false);
    }

    this.playSymbolDropAnimAfterSkip();
    //SAMPLE ANIMATIONS
    // director.inputManager.on("pressQ", () => this.totalWinPanel.showTotalWin(1000));
    // director.inputManager.on("pressW", () => this.youWonPanel.showBigWin(1000));
    // director.inputManager.on("pressE", () => this.youWonPanel.showTotalWin(1000));
    // director.inputManager.on("pressR", () => this.youWonPanel.showYouWon(10));
    // director.inputManager.on("pressT", () => this.youWonPanel.hideBigWin(1000));
    // director.inputManager.on("pressY", () => this.youWonPanel.hideTotalWin(1000));
    // this.animationBuyBonusBtn();
  }

  initTo() {
    this.animationBuyBonusBtn();
    const gameData = director.injector.get("gameState");
    let state: any,
      credit = constant.CREDIT_DEFAULT,
      mode: MultiplierMode = "normal",
      freeSpined = false;

    const winPositions =
      gameData.bonus && gameData.bonus.gameResult
        ? gameData.bonus.gameResult.winPositions
          ? gameData.bonus.gameResult.winPositions
          : gameData.bonus.gameResult.spinResult.winPositions
        : [];
    if (gameData.bonus) {
      if (gameData.bonus.id == 1) {
        this.reels.winLines = main.parseWinlines(winPositions);
        state = new CollapsingState();
      } else if (gameData.bonus.id == 2) {
        this.hideBuyBonusBtn();
        this.showFreeBg();

        credit = gameData.bonus.spinResult.credit;
        freeSpined = gameData.bonus.numOfFreeSpin > gameData.bonus.counter;
        if (freeSpined) {
          this.hideSpin();
        }
        if (credit == constant.CREDIT_SUPER_FREESPINS) {
          state = freeSpined ? new GameSuperGold() : new GamePreSuperGold();
          mode = "superGold";
          freeSpined && this.showSFsPanel();
        } else {
          state = freeSpined ? new GameFreeSpin() : new GamePreFreeSpin();
          mode = "freeSpin";
          freeSpined && this.showFsPanel();
        }
        // this.isFreeSpin = freeSpined;
        if (winPositions.length > 0) {
          this.reels.winLines = main.parseWinlines(winPositions);
          state = new CollapsingState();
        }
        this.updateFsPanel(gameData.bonus.numOfFreeSpin, gameData.bonus.counter);
      }
    }
    // if (gameData.bonus.gameResult.winPositions.length > 0) {
    //   state = new CollapsingState();
    // }

    if (mode == "normal") {
      this.mahjongMultiplier.init();
      this.mainUI.init();
      this.updateCorner(mode);
    } else {
      if (freeSpined) {
        this.mahjongMultiplier.updateMultiplierLayer(mode);
        this.mainUI.changeToFSUIAsync().then(() => {
          this.updateCorner(mode);
        });
        this.isSuperGold = mode == "superGold";
        this.toBonus = mode == "freeSpin";
      }
    }
    if (gameData.bonus) {
      let multiplier = gameData.bonus.gameResult.multiplier;
      if (!multiplier && gameData.bonus.gameResult.spinResult.winPositions.length > 0) {
        multiplier = gameData.bonus.gameResult.spinResult.multiplier;
      }
      this.mahjongMultiplier.setMultiplierIndex(multiplier, mode, false);
    }
    this.resultResponse = { value: gameData } as any;
    if (state) {
      this.setState(state);
    }

    if (slotApp.context().LANGUAGE == Languages.Portuguese) {
      this.menu["panel"]["portrait"]["lblInfo"].scale.set(0.8);
      this.menu["panel"]["portrait"]["lblHistory"].scale.set(0.8);
    }
  }

  addSlotFire(reelIndex) {}

  removeSlotfire(reelIndex) {
    for (const index of reelIndex) {
      const result: any = this.resultResponse.value;
      if (!this.player.isTurbo) {
        let scatterCount = 0;
        const wheel = result.wheel ? result.wheel : result.spinResult.wheel;
        for (let i = 0; i <= index; i++) {
          for (let j = 1; j < wheel.reels[i].length - (i == 0 || i == 4 ? 2 : 1); j++) {
            const s = wheel.reels[i][j];
            if (s == constant.SYMBOL_Scatter) {
              scatterCount++;
            }
          }
        }

        if (index >= 2) {
          this.slotFire[`p${index}`].spine.visible = false;
          this.slotFire[`p${index}`].spine.animated = false;
        }
        if (scatterCount >= 2 && index >= 1 && index < 4) {
          this.slotFire[`p${index + 1}`].spine.visible = true;
          this.slotFire[`p${index + 1}`].spine.animated = true;
          this.reels.setSpinningTime(index + 1, 4000);
          main.playSlotFireSpinning();
        }

        if (scatterCount >= 2) {
          main.tintForScatter(reelIndex, false);
        }
      }
      (this.reels as any).reelStoped(index);
      this.playSymbolDropAnim(index);
    }
    // if (this.player.isTurbo) {
    //   (this.reels as any).sortSymbols();
    // }
    slotApp.playSound(constant.SND_SYM_STOP, "default");
  }

  playSymbolDropAnim(col: number) {
    const result: any = this.resultResponse.value;
    const wheel = result.wheel ? result.wheel : result.spinResult.wheel;
    let scatterCount = 0;
    const existScatter = wheel.reels[col].indexOf(constant.SYMBOL_Scatter) > -1;
    for (let i = 0; i <= col; i++) {
      const reel = wheel.reels[i];
      for (let j = 0; j < reel.length; j++) {
        if (reel[j] == constant.SYMBOL_Scatter) {
          scatterCount++;
        }
      }
    }
    const reels = this.reels as Reels;
    const ss = reels.symbols[col];
    // if (col < 4 || (col == 4 && result.numOfScatter < 3)) {
    for (const s of ss) {
      const index = Number(s.index);
      let dropAnimName, sAnimation;
      if (index == constant.SYMBOL_WILD) {
        dropAnimName = constant.Wild_Drop;
        sAnimation = "Wild_Idle";
      } else if (index == constant.SYMBOL_Scatter) {
        dropAnimName = constant.Scatter_Drop;
        sAnimation = "Scatter_Idle";
      }

      if (dropAnimName && s.row >= 0) {
        const symAnim = s.content.spine as SpineAnimation;
        let reelstop;

        if (scatterCount == 1) reelstop = constant.SND_WIN_SCATTER1;
        if (scatterCount == 2) reelstop = constant.SND_WIN_SCATTER2;
        if (scatterCount > 2) reelstop = constant.SND_WIN_SCATTER3;
        reelstop && existScatter && slotApp.playSound(reelstop, "default");
        setAnimationStatic(symAnim, dropAnimName, false, () => {
          // symAnim.animated = false;
          s.idle();
          symAnim.setAnimation(0, sAnimation, true);
          (symAnim as any).animation.update(0);
        });
      }
    }
    // }
  }

  playSymbolDropAnimAfterSkip() {
    for (const ss of this.reels.symbols) {
      for (const s of ss) {
        const index = Number(s.index);
        let sAnimation;
        if (index == constant.SYMBOL_WILD) {
          sAnimation = "Wild_Idle";
        } else if (index == constant.SYMBOL_Scatter) {
          sAnimation = "Scatter_Idle";
        }
        if (sAnimation) {
          const symAnim = s.content.spine as SpineAnimation;
          s.idle();
          symAnim.animated = true;
          symAnim.setAnimation(0, sAnimation, true);
        }
      }
    }
  }

  checkAuto() {
    if (!this.isAutoSpin) return;
    if (this.player.isAutoSpinOn) {
      if (!this.isFreeSpin && !this.isBonus) {
        this.updateAutoCount(this.player.autoSpin - 1);
      }
      this.player.checkAutoSpinConditions();
    }
  }

  startAutoSpinHandler(): void {
    super.startAutoSpinHandler();
    this.btnStopAuto.visible = true;
    this.autoSpinDisplay.visible = true;
    main.setCurrentGameScene(this.gameState);
  }

  allReelsStop() {
    for (const i of [2, 3, 4]) {
      this.slotFire[`p${i}`].spine.visible = false;
      this.slotFire[`p${i}`].spine.animated = false;
    }
    (this.reels as any).sortSymbols();
    main.stopSlotFireSpinning();
    this.btnSpin.hide();
    // !this.player.isTurbo && this.playSymbolDropAnimAfterSkip();
  }

  setCreditBet(creditBet: number = constant.CREDIT_DEFAULT) {
    this.player.bet.multiplier = creditBet;
  }

  onBetLevelSelect() {
    this.updateBetAmount();
    this.updateFooterBar();
  }

  restore() {}

  //DATA LOGIC
  onClickBuyBonus() {
    if (main.isGameClickable() && this.btnSpin.enabled && !this.reels.isSpinning) {
      this.buyBonusOpend = true;
      this.buyBonusBtn.enabled = false;
      setAnimationStatic(this.buyBonusBtnspine, "Trigger", false, () => {});
      delayForSpine(700).then(() => {
        this.animationBuyBonusBtn();
        this.buyBonus.openBuyBonus();
      });
    }
  }
  onReelCollapse() {
    this.mahjongMultiplier.increaseMultiplier();
  }
  resetData() {
    this.mahjongMultiplier.resetMultiplierIndex();
  }

  clickSpinHandler(sender?: any) {
    if (!this.btnSpin.enabled || this.buyBonusOpend) return;
    if (main.winCounter && this.btnSpin.state === "skip") {
      main.skipWinEffect();
      return;
    }
    this.forceStop = this.btnSpin.state === "stop";
    super.clickSpinHandler(sender);
  }

  clickAutospin() {
    if (this.isBonus) return;
    super.clickAutospin();
  }

  clickBetSelectionHandler() {
    if (this.isBonus) return;
    super.clickBetSelectionHandler();
  }
  clickTurboHandler() {
    if (this.isBonus) return;
    super.clickTurboHandler();
    this.updateFastSpin();
  }

  updateFastSpin() {
    let options;
    const reels: Reels = this.reels as Reels;
    const animator: InBackAnimator = director.injector.get("reelsAnimator") as InBackAnimator;
    if (this.player.isTurbo) {
      options = {
        maxSpeed: 60,
        startSpeed: 0,
        stopSpeed: -15,
        acceleration: 8,
        deceleration: 10,
        stopSequence: [[0, 1, 2, 3, 4]]
      };
      reels.stopTime = 0;
      reels.winPanel.animationTimer = 500;
    } else {
      options = {
        maxSpeed: 60,
        startSpeed: 0,
        stopSpeed: -15,
        acceleration: 4,
        deceleration: 10,
        stopSequence: [[0], [1], [2], [3], [4]]
      };
      reels.stopTime = 600;
      reels.winPanel.animationTimer = 2000;
    }
    animator.spinAnimator.options = options;
    animator.spinAnimator.maxSpeed = options.maxSpeed;
    animator.spinAnimator.startSpeed = options.startSpeed;
    animator.spinAnimator.stopSpeed = options.stopSpeed;
    animator.spinAnimator.acceleration = options.acceleration;
    animator.stopSequence = options.stopSequence;
  }

  onErrorPopUpOpen(data) {
    this.deactivated = true;
    super.onErrorPopUpOpen(data);
  }

  onErrorPopUpClose(data) {
    this.deactivated = false;
    super.onErrorPopUpClose(data);
  }

  onWinLoopComplete() {
    // this.numWinLoop++;
  }

  goToPreBonus() {
    return new Promise((resolve, reject) => {
      this.btnSpin.show("skip");
      resolve(true);
    });
  }
  onReelsStop() {}

  onWinLine(lines) {
    super.onWinLine(lines);
    if (this.autoSpinLogic()) {
      this.btnSpin.show("skip");
    }
    main.animateWinLines(lines);
  }

  onWinPanelClose() {
    super.onWinPanelClose();
    main.winlineAnimationsEnd();
  }

  onClose() {
    this.buyBonus.onClose();
  }

  onBuyInBonusConfirmed() {
    this.buyBonus.onBuyInBonusConfirmed();
  }

  onSelectedFs() {
    this.buyBonus.onSelectedFs();
  }

  onSelectedSFs() {
    this.buyBonus.onSelectedSFs();
  }

  autoSpinLogic() {
    return this.isAutoSpin || this.isBonus;
  }

  setAutoSpin(cb: () => void) {
    this.autoSpinTimer = setTimeout(
      () => {
        cb();
      },
      slotApp.player().isTurbo ? 300 : 600
    );
  }

  clearAutoSpin() {
    clearTimeout(this.autoSpinTimer);
  }

  stopAutoHandler() {
    this.player.stopAutoSpin();
    this.resetAutoSpin();
    this.clearAutoSpin();
    if (!(this.reels as Reels).isSpinning) {
      this.showButtons();
    }
    main.setCurrentGameScene(this.gameState);
  }

  getWinLineMessageDetails(lines) {
    // return super.getWinLineMessageDetails(lines);
    return null;
  }

  onOrientationChange(orientation?: any) {
    super.onOrientationChange(orientation);
  }

  advanceTime(elapsedFrames: number): boolean {
    return super.advanceTime(elapsedFrames);
  }

  checkDeviceResize(offset) {
    super.checkDeviceResize(offset);
    this.autoSpinOptions.y = this.menu.y = -offset.y * (1 / 1.5);
  }

  setComponentsPositions(e) {
    const iWidth: number = window.innerWidth;
    const iHeight: number = window.innerHeight;
    const oWidth: number = director.options.height;
    const oHeight: number = director.options.width;
    const scale: number = director.stage.scale.x;
    const offset: PIXI.Point = new PIXI.Point();

    if (iWidth < oWidth * scale) {
      offset.x = Math.floor((oWidth * scale - iWidth) * (0.5 / scale)) * 0.65;
    }
    if (iHeight < oHeight * scale) {
      offset.y = Math.floor((oHeight * scale - iHeight) * (0.5 / scale)) * 0.65;
    }

    this.menu.buttonCloseLandscape.x = this.menuBtnCloseLX - offset.x;
    this.menu.buttonClosePortrait.x = this.menuBtnClosePX - offset.x;
    this.footerBar["timebox"].position.set(-offset.x - 40, -offset.y);
  }

  updateCorner(e: MultiplierMode) {
    this.cornerN.visible = e == "normal";
    this.cornerFs.visible = e == "freeSpin";
    this.cornerSFs.visible = e == "superGold";
  }

  showMainBg() {
    fadeInComonentAndVisible(this.mainBg);
    fadeOutComonentAndVisible(this.freeBg);
  }

  showFreeBg() {
    fadeInComonentAndVisible(this.freeBg);
    fadeOutComonentAndVisible(this.mainBg);
  }

  showFsPanel() {
    fadeInComonentAndVisible(this.fspanel);
  }

  showSFsPanel() {
    fadeInComonentAndVisible(this.sfspanel);
  }

  updateFsPanel(totalCount, count) {
    this.fspanel.label.value = this.sfspanel.label.value = `${count} / ${totalCount}`;
  }

  hideFsPanel() {
    fadeOutComonentAndVisible(this.fspanel);
    fadeOutComonentAndVisible(this.sfspanel);
  }

  showBuyBonusBtn() {
    fadeInComonentAndVisible(this.buyBonusBtnspine);
  }

  hideBuyBonusBtn() {
    fadeOutComonentAndVisible(this.buyBonusBtnspine);
  }

  updateBalanceAmount(value) {
    if (this.gameState != "COLLAPSING") {
      super.updateBalanceAmount(value);
    }
  }

  showSpin() {
    this.betButtons.visible = true;
    this.btnMenu.visible = true;
  }

  hideSpin() {
    this.betButtons.visible = false;
    this.btnMenu.visible = false;
  }

  enabledBtnAutoSpin() {
    if (this.autoSpinDisplay) {
      this.autoSpinDisplay.alpha = 1;
      this.btnStopAuto.enabled = true;
      if (this.player.bonus !== undefined && this.player.bonus !== null && this.player.bonus.id !== "0") {
        this.autoSpinDisplay.alpha = 0.5;
        this.btnStopAuto.enabled = false;
      }
    }
  }

  animationBuyBonusBtn() {
    setAnimationStatic(this.buyBonusBtnspine, "Idle", true, () => {});
  }

  exit() {
    if (this.animation) this.animation.exit();
    super.exit();
  }
}
