import * as director from "../../engine/src/director";
import * as freeSpinParser from "../../engine/src/slotMachine/parser/freeSpinParser";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
// import * as constant from "../constants";
import * as main from "./mainScene";

import { PreFreeSpin, Spin } from "../../engine/src/slotMachine/scenes/mainScene.mobile";
import { FreeSpin, Idle, MainScene } from "../../engine/src/slotMachine/scenes/mainScene.shared";
import { async, delayAnimatable, delayForSpine } from "../../engine/src/util/async";
import { Timer } from "../../engine/src/util/timer";
import { Reels } from "../components/reels2";
import { ReelsCollapsing } from "../components/reelsCollapsing";
import { BonusResultValue, CollapsingResultValue, ResultResponse, ResultValue } from "../type";
import { GameMainScene } from "./mainScene.mobile";

export class GameSpin extends Spin<GameMainScene> {
  private showBtnTimer: Timer;

  enter() {
    main.setCurrentGameScene("SPIN");
    const dt = (this.scene.reels as ReelsCollapsing).collapsing ? 300 : 500;
    this.showBtnTimer = new Timer(
      () => {
        if (this.scene.reels.isSpinning) this.scene.btnSpin.show("stop");
      },
      this.scene.player.isTurbo ? dt * 0.4 : dt
    );
  }

  exit() {
    if (this.showBtnTimer) {
      this.showBtnTimer.cancel();
    }
    super.exit();
  }
}

export class GameIdle extends Idle<GameMainScene> {
  enter() {
    super.enter();
    this.scene.isBonus = false;
    this.scene.isFreeSpin = false;
    main.setCurrentGameScene("IDLE");
    (this.scene.reels as ReelsCollapsing).collapsing = false;
    this.scene.forceStop = false;
    if (this.scene.deactivated) {
      this.scene.btnSpin.hide();
      this.scene.menu.hide();
      this.scene.hideButtons();
    } else {
      this.scene.btnSpin.show("spin");
    }

    this.scene.mahjongMultiplier.updateMultiplierLayer("normal");
    this.scene.resetData();
    this.scene.hideFsPanel();
    this.scene.showMainBg();
    this.scene.showSpin();
    this.scene.showBuyBonusBtn();

    if (this.scene.isAutoSpin) {
      this.scene.setAutoSpin(() => {
        this.clickSpinHandler();
      });
    }
  }

  clickSpinHandler() {
    main.setGameType("real");

    this.scene.resultResponse = null;
    if (this.scene.btnSpin.state !== "bonus") {
      this.scene.btnSpin.state = "spin";
    }
    this.scene.clearAutoSpin();
    super.clickSpinHandler();
    main.setCurrentGameScene(this.scene.gameState);
  }

  spinSuccess() {
    // if(this.scene.btnSpin.state !== "bonus") {
    //   main.playBtnSpinEffect();
    // }
    main.playSoundSpinning();
    super.spinSuccess();
  }

  spinServiceHandler(rsp) {
    main.changeReelsFrom45554To66666(rsp.value.wheel.reels);
    this.scene.resultResponse = rsp as ResultResponse;
    const resultValue = this.scene.resultResponse.value as ResultValue;
    let balance;
    let winAmount;
    let winLines;
    let wheels;
    if (resultValue) {
      balance = resultValue.balance.value;
      winAmount = resultValue.win;
      winLines = main.parseWinlines(resultValue.winPositions);
      wheels = resultValue.wheel.reels;
    }
    this.player.balance = new Decimal(balance);
    this.player.winAmount = new Decimal(winAmount);
    this.player.winLines = winLines;
    this.player.symbols = wheels;
    this.bonusHandler(rsp);
    this.trackSpinEvent();
    this.scene.reels.stop(wheels, false, winLines, (arg) => {
      return this.getReelsStopPromise(arg);
    });
    this.scene.setState(director.injector.get("spinState"));
  }

  getReelsStopPromise(symbolsInfo) {
    return main.getReelsStopPromise(this, symbolsInfo);
  }
  onReelsStop() {
    this.scene.updateAuto();
    return async(() => {}, 200);
  }
  updateState() {
    main.normalUpdateState({ state: this });
  }
}

export class CollapsingState<T extends MainScene> extends Idle<GameMainScene> {
  enter() {
    main.setCurrentGameScene("COLLAPSING");
    this.scene.isBonus = true;
    const reels = this.scene.reels as ReelsCollapsing;
    reels.collapsing = true;
    reels.getSymbolMapping();
    this.scene.menu.hide();
    this.scene.hideButtons();
    this.clickSpinHandler();
  }

  getReelsStopPromise(symbolsInfo: any) {
    return main.getReelsStopPromise(this, symbolsInfo);
  }

  clickSpinHandler(): void {
    main.playMojongShake(this.scene.reels as Reels, this.scene.resultResponse);
    this.scene.resultResponse = null;

    if (main.getGameType() === "real") {
      // main.explode().then(() => {
      this.scene.onReelCollapse();
      this.spinSuccess();
      // });
    }
    if (main.getGameType() === "test") {
      // main.explode().then(() => {
      this.scene.onReelCollapse();
      delayAnimatable(500).then(() => {
        this.spinServiceHandler(main.bonusData.bonus_events);
        this.froundHandler(main.baseData.base_events);
      });
      // });
    }
  }

  getSpinServie() {
    return this.netService.bonus({ key: "0", step: 0, index: 0 }, freeSpinParser.parse);
  }

  spinServiceHandler(rsp: any, parseModel?: string): void {
    main.stopMojongShake().then(() => {
      this.scene.resultResponse = rsp as ResultResponse;
      const collapsingValue = this.scene.resultResponse.value as CollapsingResultValue;
      main.changeReelsFrom45554To66666(collapsingValue.spinResult.wheel.reels);

      const reels = this.scene.reels as ReelsCollapsing;
      let balance;
      let adds;
      let winAmount;
      let cumulativeWin;
      let winLines;
      let wheels;

      if (collapsingValue) {
        balance = collapsingValue.balance.value;
        winAmount = collapsingValue.win;
        if (collapsingValue.spinResult) {
          cumulativeWin = collapsingValue.spinResult.cumulativeWin;
          adds = collapsingValue.spinResult.collapsingAdds;

          winLines = main.parseWinlines(collapsingValue.spinResult.winPositions);
          wheels = collapsingValue.spinResult.wheel.reels;
        }
      }

      reels.addSymbols = adds;

      this.player.balance = new Decimal(balance);
      this.player.winAmount = new Decimal(cumulativeWin);

      this.player.winLines = winLines;
      this.player.symbols = wheels;
      if (!rsp.value.hasBonus) {
        rsp.value.hasBonus = rsp.value.bonus && !rsp.value.bonus.isCompleted;
      }
      this.bonusHandler(rsp);
      this.trackSpinEvent();
      this.scene.reels.stop(wheels, false, winLines, (arg) => this.getReelsStopPromise(arg));
      this.scene.setState(director.injector.get("spinState"));
    });
  }
  onReelsStop() {
    this.scene.updateAuto();
    return main.onReelsStop();
  }

  updateState() {
    const reels = this.scene.reels as ReelsCollapsing;
    reels.collapsing = false;
    reels.addSymbols = [];
    main.collapseUpdateState({ state: this });
  }
}

export class GamePreFreeSpin extends PreFreeSpin<GameMainScene> {
  enter() {
    super.enter();
    this.scene.hideButtons();
    main.setCurrentGameScene("PREFS");
    this.scene.isBonus = true;

    this.scene.btnSpin.hide();
    const numOfFreeSpin = (this.scene.resultResponse.value as any).bonus.numOfFreeSpin || (this.scene.resultResponse.value as any).numOfFreeSpin;
    this.scene.btnStopAuto.enabled = false;
    this.scene.youWonPanel.showYouWon(numOfFreeSpin);
    this.scene.updateFsPanel(numOfFreeSpin, numOfFreeSpin);

    delayForSpine(1000).then(() => {
      this.scene.btnSpin.show("bonus");
    });
  }

  clickSpinHandler(): void {
    this.scene.hideBuyBonusBtn();
    this.scene.btnSpin.hide();
    this.scene.youWonPanel.hideYouWon().then(() => {
      this.scene.mainUI.changeToFSUIAsync().then(() => {
        this.scene.updateCorner("freeSpin");
      });
      this.scene.mahjongMultiplier.updateMultiplierLayer("freeSpin");
      this.scene.btnStopAuto.enabled = true;
      this.scene.setState(new GameFreeSpin());
    });
  }
}

export class GameFreeSpin extends FreeSpin<GameMainScene> {
  private autoClickTimer: NodeJS.Timeout;

  enter(): void {
    super.enter();
    this.scene.hideButtons();
    main.setCurrentGameScene("FS");
    this.scene.showFsPanel();
    this.scene.showFreeBg();
    this.scene.isFreeSpin = true;
    this.scene.hideSpin();

    this.autoClickTimer = setTimeout(() => {
      this.clickSpinHandler();
    }, 300);
  }

  clickSpinHandler() {
    clearTimeout(this.autoClickTimer);
    main.playSoundSpinning();
    super.clickSpinHandler();
  }

  getSpinServie(): Promise<any> {
    const bonus = slotApp.player().bonus;
    return this.netService.bonus({
      key: bonus.key,
      step: bonus.step++,
      index: 0
    });
  }

  spinServiceHandler(rsp: any, parseModel?: string): void {
    main.changeReelsFrom45554To66666(rsp.value.spinResult.wheel.reels, true);
    this.scene.resultResponse = rsp as ResultResponse;
    const bonusResultValue = this.scene.resultResponse.value as BonusResultValue;

    let balance;
    let winAmount;
    let winLines;
    let wheels;
    let fround;

    if (this.netService.json) {
      if (bonusResultValue) {
        balance = bonusResultValue.balance.value;
        winAmount = bonusResultValue.win;
        winLines = main.parseWinlines(bonusResultValue.spinResult.winPositions);
        wheels = bonusResultValue.spinResult.wheel.reels;
      }
    }

    this.player.balance = new Decimal(balance);
    this.player.winAmount = new Decimal(winAmount);
    this.player.winLines = winLines;
    this.player.symbols = wheels;
    this.bonusHandler(rsp);
    this.trackSpinEvent();
    this.scene.reels.stop(wheels, false, winLines, (arg) => this.getReelsStopPromise(arg));
    this.scene.setState(director.injector.get("spinState"));
    this.scene.checkFround(fround);

    this.scene.updateFsPanel(rsp.value.bonus.numOfFreeSpin, rsp.value.bonus.counter);
  }

  updateState() {
    return main.fsUpdateState({ state: this }).then(() => {});
  }

  getReelsStopPromise(symbolsInfo) {
    return main.getReelsStopPromise(this, symbolsInfo);
  }

  onReelsStop() {
    main.onReelsStop();
    this.scene.updateAuto();
    this.scene.onReelsStop();
    return async(() => {}, 200);
  }
}

export class GamePreSuperGold extends PreFreeSpin<GameMainScene> {
  enter() {
    super.enter();
    this.scene.hideButtons();
    main.setCurrentGameScene("PRESUPERGOLD");
    this.scene.isSuperGold = true;

    this.scene.btnSpin.hide();
    this.scene.btnStopAuto.enabled = false;
    const numOfFreeSpin = (this.scene.resultResponse.value as any).bonus.numOfFreeSpin || (this.scene.resultResponse.value as any).numOfFreeSpin;
    this.scene.youWonPanel.showYouWon(numOfFreeSpin);

    delayForSpine(1000).then(() => {
      this.scene.btnSpin.show("bonus");
    });
  }

  clickSpinHandler(): void {
    this.scene.hideBuyBonusBtn();
    this.scene.btnSpin.hide();
    this.scene.youWonPanel.hideYouWon().then(() => {
      this.scene.mainUI.changeToFSUIAsync().then(() => {
        this.scene.updateCorner("superGold");
      });
      this.scene.mahjongMultiplier.updateMultiplierLayer("superGold");
      this.scene.btnStopAuto.enabled = true;
      this.scene.setState(new GameSuperGold());
    });
  }
}

export class GameSuperGold extends FreeSpin<GameMainScene> {
  private autoClickTimer: NodeJS.Timeout;

  enter(): void {
    super.enter();
    this.scene.hideButtons();
    main.setCurrentGameScene("SUPERGOLD");
    this.scene.showSFsPanel();
    this.scene.showFreeBg();
    this.scene.hideSpin();
    this.scene.isFreeSpin = true;

    this.autoClickTimer = setTimeout(() => {
      this.clickSpinHandler();
    }, 300);
  }

  clickSpinHandler() {
    clearTimeout(this.autoClickTimer);
    main.playSoundSpinning();
    super.clickSpinHandler();
  }

  getSpinServie(): Promise<any> {
    const bonus = slotApp.player().bonus;
    return this.netService.bonus({
      key: bonus.key,
      step: bonus.step++,
      index: 0
    });
  }

  spinServiceHandler(rsp: any, parseModel?: string): void {
    main.changeReelsFrom45554To66666(rsp.value.spinResult.wheel.reels, true);
    this.scene.resultResponse = rsp as ResultResponse;
    const bonusResultValue = this.scene.resultResponse.value as BonusResultValue;

    let balance;
    let winAmount;
    let winLines;
    let wheels;
    let fround;

    if (this.netService.json) {
      if (bonusResultValue) {
        balance = bonusResultValue.balance.value;
        winAmount = bonusResultValue.win;
        winLines = main.parseWinlines(bonusResultValue.spinResult.winPositions);
        wheels = bonusResultValue.spinResult.wheel.reels;
      }
    }

    this.player.balance = new Decimal(balance);
    this.player.winAmount = new Decimal(winAmount);
    this.player.winLines = winLines;
    this.player.symbols = wheels;
    this.bonusHandler(rsp);
    this.trackSpinEvent();
    this.scene.reels.stop(wheels, false, winLines, (arg) => this.getReelsStopPromise(arg));
    this.scene.setState(director.injector.get("spinState"));
    this.scene.checkFround(fround);
    this.scene.updateFsPanel(rsp.value.bonus.numOfFreeSpin, rsp.value.bonus.counter);
  }

  updateState() {
    return main.fsUpdateState({ state: this });
  }

  getReelsStopPromise(symbolsInfo) {
    return main.getReelsStopPromise(this, symbolsInfo);
  }

  onReelsStop() {
    main.onReelsStop();
    this.scene.updateAuto();
    this.scene.onReelsStop();
    return async(() => {}, 200);
  }
}
