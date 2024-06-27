import { default as base_events, default as bonus_events } from "../../data";
import { View } from "../../engine/src/component/component";
import { Languages } from "../../engine/src/core/appContext";
import * as director from "../../engine/src/director";
import { SoundService } from "../../engine/src/services/soundService";
import { HudMessage } from "../../engine/src/slotMachine/component/hudMessage";
import { Symbol } from "../../engine/src/slotMachine/component/symbol";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { async, delayAnimatable, delayForSpine } from "../../engine/src/util/async";
import * as random from "../../engine/src/util/random";
import { setWinAnimation, setWinScatter } from "../animations/sceneAnimation";
import { Reels } from "../components/reels2";
import { ReelsCollapsing } from "../components/reelsCollapsing";
import * as constant from "../constants";
import { CollapsingResultValue, GAME_STATE, GAME_TYPE, ResultResponse, ResultValue } from "../type";
import { GameMainScene as MainScene } from "./mainScene.mobile";
import { CollapsingState, GameFreeSpin, GameIdle, GamePreFreeSpin, GamePreSuperGold, GameSuperGold } from "./sceneStates";

// import * as _ from 'lodash';

let scene: MainScene;
// let bgmmain=null, bgmwin=null;
// let winmeterSound: any;
// let winlevelSound: any;
// let symbolAnimationSound: any;
// let panelSound: any;
// let winPanelTween: TWEEN.Tween;
let resolve: any = null;
let timeout: number = 0;
let winmeterSound;
let winlineTintTween;
let mahjongShakeTween: TWEEN.Tween;
// let soundTween: TWEEN.Tween;
// let soundSpinning: any;
// let symSndIdx: number = 0;
// let replenishTween : TWEEN.Tween;
// let reelStopMul: number[] = [];
// let winlinesMask: PIXI.Graphics;
// let winlinesMaskTween: TWEEN.Tween;
// let zoomInOutTween: TWEEN.Tween;

export let winLevel: number = 0;
export let winCounter: TWEEN.Tween = null;

export const getCurrentGameState = (): GAME_STATE => {
  return scene.gameState;
};

export const setCurrentGameScene = (gameState: GAME_STATE) => {
  if (!scene) return;
  scene.gameState = gameState;
  const buttonEnabled = gameState === "IDLE" && !scene.isFreeSpin && !scene.isAutoSpin && scene.btnSpin.enabled && !scene.reels.isSpinning;
  scene.buyBonusBtnspine.tint = buttonEnabled ? 0xffffff : 0x808080;
  scene.buyBonusBtn.enabled = buttonEnabled;
  scene.buyBonusBtn.cursor = buttonEnabled ? "pointer" : "default";
  (scene.buyBonusBtnspine as any).animation.update(0);
};
export const getGameType = (): GAME_TYPE => {
  return scene.gameType;
};
export const setGameType = (type: GAME_TYPE) => {
  if (!scene) return;
  scene.gameType = type;
};

export const baseData = JSON.parse(JSON.stringify(base_events));
export const bonusData = JSON.parse(JSON.stringify(bonus_events));

export const isGameClickable = () => {
  return scene.gameState === "IDLE" && !scene.isAutoSpin && !scene.isFreeSpin;
};

export function setState(_state: MainScene) {
  if (_state) {
    scene = _state;
  }
}

export function getReelsStopPromise(_state, symbolsInfo) {
  onReelsStop();
  return _state
    .onReelsStop()
    .then(() => checkHudMessage())
    .then(() => animateSymbols())
    .then(() => showWinAmount())
    .then(() => _state.updateState())
    .then(() => _state.scene.animateFooterBar(true));
}

export function addWinlinesMask() {}

export function checkHudMessage() {
  if (scene.player.bonus && scene.player.bonus.id !== undefined && !scene.isFreeSpin) {
    scene.showHudMessage("");
  } else if (scene.player.winAmount.lte(0) && !scene.isAutoSpin && !scene.isFreeSpin) {
    scene.showHudMessage(HudMessage.NO_WIN);
  } else {
    scene.showHudMessage();
  }
  return Promise.resolve();
}

export function animateWinLines(lines) {}

function playSymbolAnimationSound(lines) {}

export function winlineAnimationsEnd(click?: boolean) {}

export function changeReelsFrom45554To66666(reels, isFs = false) {
  for (let i = 0; i < reels.length; i++) {
    const reel = reels[i];
    if (i == 0 || i == 4) {
      reel.push(random.rangeInteger(20));
    }
    // if (i == 0 || i == 4) {
    //   reel.push(random.rangeInteger(20), random.rangeInteger(20));
    // } else if (i == 2 && isFs) {
    //   reel.push(random.rangeInteger(20, 11));
    // } else {
    //   reel.push(random.rangeInteger(20));
    // }
  }
}

export function tintReels(v) {
  const reels: ReelsCollapsing = scene.reels as ReelsCollapsing;
  const symbols: Symbol[][] = reels.symbols;
  symbols.forEach((reel) => {
    reel.forEach((symbol: any) => {
      symbols.forEach((reel) => {
        reel.forEach((symbol: any) => {
          const t = Math.floor(255 - 100 * Math.sin(Math.PI * v));
          if (symbol.content && symbol.content.spine) {
            try {
              symbol.content.spine.tint = `#${t.toString(16)}${t.toString(16)}${t.toString(16)}`;
              symbol.content.spine.animation.update(0);
            } catch {}
          }
        });
      });
    });
  });
}

export function tintForScatter(reelIndex: number[], light: boolean) {
  const reels: ReelsCollapsing = scene.reels as ReelsCollapsing;
  const symbols: Symbol[][] = reels.symbols;
  for (let index = 0; index <= reelIndex[reelIndex.length - 1]; index++) {
    const reel = symbols[index];
    reel.forEach((symbol: any) => {
      if (light || symbol.index == constant.SYMBOL_Scatter) {
        symbol.content.spine.tint = 0xffffff;
        symbol.content.spine.animation.update(0);
      } else {
        symbol.content.spine.tint = 0x808080;
        symbol.content.spine.animation.update(0);
      }
    });
  }
}

export function symbolToIdle() {
  const reels: ReelsCollapsing = scene.reels as ReelsCollapsing;
  const symbols: Symbol[][] = reels.symbols;
  symbols.forEach((reel) => {
    reel.forEach((symbol: any) => {
      symbol.idle();
    });
  });
}

export function tintReelsWithAnime() {
  winlineTintTween = new TWEEN.Tween({ k: 0 })
    .easing((k) => {
      if (k < 0.25) {
        return k * 2;
      } else if (k > 0.75) {
        return (1 - k) / 2;
      } else {
        return 0.5;
      }
    })
    .to({ k: 1 }, slotApp.player().isTurbo ? 1000 : 2000)
    .onUpdate((v) => {
      tintReels(v.k);
    })
    .onComplete(() => {
      tintReels(1);
    })
    .start();
}

export function getWinPositions(res) {
  const winPositions = res.value.winPositions
    ? res.value.winPositions
    : res.value.spinResult.winPositions
      ? res.value.spinResult.winPositions
      : res.value.bonus && res.value.bonus.gameResult
        ? res.value.bonus.gameResult.winPositions
          ? res.value.bonus.gameResult.winPositions
          : res.value.bonus.gameResult.spinResult.winPositions
        : [];
  return winPositions;
}

export function animateSymbols(): Promise<void> {
  tintForScatter([0, 1, 2, 3, 4], true);
  const winLines = scene.player.winLines;
  let existGold = false;
  if (winLines.length === 0) return Promise.resolve();
  scene.btnSpin.hide();
  return new Promise((res, rej) => {
    tintReelsWithAnime();
    scene.totalWinPanel.showTotalWin(scene.resultResponse.value.win);
    scene.showHudMessage(HudMessage.WAYS_WIN, scene.resultResponse.value.win, getWinPositions(scene.resultResponse).length);
    const reels: Reels = scene.reels as Reels;
    const symbols: Symbol[][] = reels.symbols;
    const animaeSymbols = [];
    if (symbols) {
      for (let i = 0; i < winLines.length; i++) {
        const line = winLines[i];
        const positions = line.positions;
        for (let j = 0; j < positions.length; j++) {
          const position = positions[j];
          const symbol = symbols[position[0]][position[1]];
          if (symbol && animaeSymbols.indexOf(symbol) === -1) {
            animaeSymbols.push(symbol);
          }
        }
      }
    }
    animaeSymbols.sort((a, b) => {
      if (a.index == constant.SYMBOL_WILD) return 1;
      else if (b.index == constant.SYMBOL_WILD) return -1;
      else {
        if (a.col - b.col == 0) {
          return a.row - b.row;
        }
        return b.col - a.col;
      }
    });
    for (let i = 0; i < animaeSymbols.length; i++) {
      const symbol = animaeSymbols[i];
      (symbol as View).parent.setChildIndex(symbol, (symbol as View).parent.children.length - 1);
      symbol.animate();

      const symbolIndex = (symbol as Symbol).index;
      setWinAnimation(symbolIndex, symbol, symbol.content);
      delayForSpine(slotApp.player().isTurbo ? 1000 : 2000).then(() => {
        if (winlineTintTween) {
          winlineTintTween.end().stop();
          TWEEN.remove(winlineTintTween);
          winlineTintTween = null;
        }
        res();
        symbolToIdle();
      });
      if (symbol.index > 10) {
        existGold = true;
      }
    }
    // slotApp.playSound(existGold ? "lp_win" : "hp_win", "default");
    playingWinSound();
    delayForSpine(slotApp.player().isTurbo ? 600 : 1200).then(() => {
      slotApp.playSound("collapse", "default");
    });
  });
}

export function playingWinSound() {
  const winPosition = getWinPositions(scene.resultResponse);
  const map = {};
  for (const item of winPosition) {
    const c = map[item.symbol];
    if (c) {
      map[item.symbol] = c + 1;
    } else {
      map[item.symbol] = 1;
    }
  }
  const winPositionLength = winPosition.length;
  const _2tiaoCount = (map[0] || 0) + (map[11] || 0);
  const _2tongCount = (map[1] || 0) + (map[12] || 0);
  const _3tongCount = (map[2] || 0) + (map[13] || 0);
  const _5tiaoCount = (map[3] || 0) + (map[14] || 0);
  const _5tongCount = (map[4] || 0) + (map[15] || 0);
  const _8wanCount = (map[5] || 0) + (map[16] || 0);
  const _8baiCount = (map[6] || 0) + (map[17] || 0);
  const _8zhongCount = (map[7] || 0) + (map[18] || 0);
  const _8faCount = (map[8] || 0) + (map[19] || 0);
  if (_2tiaoCount == winPositionLength) {
    slotApp.playSound("c_2tiao");
  } else if (_2tongCount == winPositionLength) {
    slotApp.playSound("c_2tong");
  } else if (_3tongCount == winPositionLength) {
    slotApp.playSound("c_3tong");
  } else if (_5tiaoCount == winPositionLength) {
    slotApp.playSound("c_5tiao");
  } else if (_5tongCount == winPositionLength) {
    slotApp.playSound("c_5tong");
  } else if (_8wanCount == winPositionLength) {
    slotApp.playSound("c_8wan");
  } else if (_8baiCount == winPositionLength) {
    slotApp.playSound("c_baiban");
  } else if (_8zhongCount == winPositionLength) {
    slotApp.playSound("c_hongzhong");
  } else if (_8faCount == winPositionLength) {
    slotApp.playSound("c_facai");
  } else if (winPositionLength > 0) {
    slotApp.playSound("c_quanzhong");
  }
}

export function animateScatter(): Promise<void> {
  scene.btnSpin.show("stop");
  scene.btnSpin.hide();
  scene.showHudMessage(HudMessage.FREESPIN);
  return new Promise((res) => {
    delayForSpine(600).then(() => {
      const rsp = scene.resultResponse.value as any;
      const wheel = rsp.wheel || rsp.spinResult.wheel;
      const wheelReels = wheel.reels;
      const scatterCount = rsp.numOfScatter || rsp.spinResult.numOfScatter;
      const animaeSymbols = [];
      for (let i = 0; i < wheelReels.length; i++) {
        const reel = wheelReels[i];
        for (let j = 0; j < reel.length; j++) {
          const symbol = reel[j];
          if (symbol == constant.SYMBOL_Scatter) {
            if (scatterCount > animaeSymbols.length) {
              animaeSymbols.push(scene.reels.symbols[i][j]);
            }
          }
        }
      }
      animaeSymbols.sort((a, b) => {
        if (a.col - b.col == 0) {
          return a.row - b.row;
        }
        return b.col - a.col;
      });

      for (let i = 0; i < animaeSymbols.length; i++) {
        const symbol = animaeSymbols[i];
        (symbol as View).parent.setChildIndex(symbol, (symbol as View).parent.children.length - 1);
        setWinScatter(symbol);
      }
      delayForSpine(slotApp.player().isTurbo ? 666 : 2000).then(() => {
        scene.showHudMessage();
        res();
      });
    });
  });
}

export function showWinAmount(): Promise<void> {
  const resultRes = scene.resultResponse;
  if (resultRes.value.win == 0) {
    return new Promise((res) => {
      resolve = () => {
        scene.mahjongMultiplier.setMultiplierIndex(0);
        tintReels(1);
        res();
      };

      setWinLevel();
      const winAmount = new Decimal((scene.resultResponse.value as any).cumulativeWin);
      if (winAmount.gt(0)) {
        scene.btnSpin.hide();
        if (winLevel >= constant.BIGWIN_LEVEL) {
          scene.youWonPanel.showBigWin(winAmount.toNumber());
          playBigWinSound();
          delayForSpine(8000).then(() => {
            scene.youWonPanel.hideBigWin(winAmount.toNumber()).then(() => {
              stopBigWinSound();
              resolve();
              resolve = null;
              scene.btnSpin.show("spin");
            });
          });
        } else {
          tintReels(0.5);
          delayAnimatable(200).then(() => {
            playWinEffect();
            showBox(winAmount);
          });
        }
      } else {
        scene.footerBar.winBox.visible = false;
        resolve();
        resolve = null;
      }
    });
  } else {
    return Promise.resolve();
  }
}

export function skipWinEffect() {
  scene.btnSpin.hide();
  if (winCounter) winCounter.stop();

  if (winmeterSound) {
    slotApp.stopSound(winmeterSound);
    winmeterSound = null;
  }
  const winAmount = scene.player.winAmount;
  if (scene.winLevelLabel && scene.winLevelLabel.visible) {
    scene.winLevelLabel.value = winAmount.toFixed(2);
  }
  scene.footerBar.winBoxLabel.update(winAmount);
  scene.footerBar.directUpdateWinAmount(winAmount);
  winCounter = null;

  clearWinEffect();
}

export function normalUpdateState({ state, restoreData }: { state: any; restoreData?: any }) {
  return async(() => {
    if (getGameType() === "test") {
      state.scene.setState(new CollapsingState());
      return;
    }
    const rsp = state.scene.resultResponse as ResultResponse;
    const resultValue = rsp.value as ResultValue;

    const collapseSymbol = () => {
      if (resultValue.hasBonus) {
        if (resultValue.isCollapse) {
          // delay(1000).then(() => {
          //animation symbol delay
          state.scene.setState(new CollapsingState());
          return;
          // });
        } else {
          const numOfFreeSpin = (rsp.value as any).numOfFreeSpin;
          if (resultValue.isSuperFreeSpin) {
            //todo FS
            state.scene.toBonus = true;
            animateScatter()
              .then(() => state.scene.goToPreBonus())
              .then(() => {
                state.scene.setState(new GamePreSuperGold());
                state.scene.updateFsPanel(numOfFreeSpin, numOfFreeSpin);
              });
            return;
          } else {
            //todo FS
            state.scene.toBonus = true;
            animateScatter()
              .then(() => state.scene.goToPreBonus())
              .then(() => {
                state.scene.setState(new GamePreFreeSpin());
                state.scene.updateFsPanel(numOfFreeSpin, numOfFreeSpin);
              });
            return;
          }
        }
      } else {
        state.scene.setState(new GameIdle());
      }
    };

    collapseSymbol();
  });
}

export function fsUpdateState({ state }: { state: any }) {
  return async(() => {
    const rsp = state.scene.resultResponse as ResultResponse;
    const value = rsp.value as any;
    const winAmount = new Decimal(value.spinResult.win);
    if (value.isCompleted) {
      showFreeSpinSummary(state);
    } else if (winAmount.gt(0)) {
      state.scene.setState(new CollapsingState());
      return;
    } else {
      if (state.scene.isSuperGold) {
        state.scene.setState(new GameSuperGold());
      } else {
        state.scene.setState(new GameFreeSpin());
      }
    }
  });
}

export function showFreeSpinSummary(state: any) {
  const value = state.scene.resultResponse.value as any;
  // if (value.bonus && value.bonus.isFreeSpin) {

  function goToIdle() {
    scene.isSuperGold = false;
    scene.isFreeSpin = false;
    scene.showButtons();
    scene.isBonus = false;

    state.scene.mainUI.changeToNormalUI();
    state.scene.setState(new GameIdle());
    state.scene.updateCorner("normal");
  }

  if (value.bonus.totalWin > 0) {
    scene.youWonPanel.showTotalWin(value.bonus.totalWin);
    scene.btnSpin.hide();
    delayForSpine(4000).then(() => {
      scene.youWonPanel.hideTotalWin(value.bonus.totalWin).then(() => {
        goToIdle();
      });
    });
  } else {
    goToIdle();
  }
  // }
}

export function collapseUpdateState({ state, restoreData }: { state: any; restoreData?: any }) {
  return async(() => {
    const rsp = state.scene.resultResponse as ResultResponse;
    const value = rsp.value as CollapsingResultValue;
    const winAmount = new Decimal(value.spinResult.win);
    if (value.isCompleted) {
      if (value.bonus && (value.bonus as any).isFreeSpin) {
        showFreeSpinSummary(state);
      } else {
        state.scene.setState(new GameIdle());
      }
    } else if (winAmount.gt(0)) {
      state.scene.setState(new CollapsingState());
    } else if (value.spinResult.isFreeSpin) {
      const currentFreeSpinStep = (value as any).spinResult.currentFreeSpinStep;
      if (value.spinResult.isSuperFreeSpin) {
        if (currentFreeSpinStep == 1) {
          state.scene.isSuperGold = true;
          animateScatter()
            .then(() => state.scene.goToPreBonus())
            .then(() => {
              state.scene.setState(new GamePreSuperGold());
            });
        } else {
          state.scene.setState(new GameSuperGold());
        }
      } else {
        if (currentFreeSpinStep == 1) {
          state.scene.toBonus = true;
          animateScatter()
            .then(() => state.scene.goToPreBonus())
            .then(() => {
              state.scene.setState(new GamePreFreeSpin());
            });
        } else {
          state.scene.setState(new GameFreeSpin());
        }
      }
    }
  });
}

function showBox(value: decimal.Decimal) {
  const properties = { value: 0 };
  winCounter = new TWEEN.Tween(properties)
    .to({ value: value.toNumber() }, timeout)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(() => {
      if (scene.winLevelLabel && scene.winLevelLabel.visible) scene.winLevelLabel.value = properties.value.toFixed(2);
      scene.footerBar.directUpdateWinAmount(new Decimal(properties.value));
      scene.footerBar.winBoxLabel.update(properties.value);
    })
    .onComplete(() => {
      delayAnimatable(2000).then(() => {
        clearWinEffect();
      });
    })
    .start();

  scene.footerBar.winBoxLabel.scale.set([1, 1, 1.5, 2, 2, 2][winLevel - 1]);
  scene.footerBar.winBoxLabel.scale.set([1, 1, 1.3, 1.6, 2, 2][winLevel - 1]);
  if (winLevel > constant.SMALLWIN_LEVEL) {
    if (winLevel <= constant.BIGWIN_LEVEL) {
      delayAnimatable(1000).then(() => {
        scene.btnSpin.show("skip");
      });
    }
  }

  if (winLevel <= constant.BIGWIN_LEVEL) {
    scene.footerBar.winBox.visible = true;
    winmeterSound = slotApp.playSound(constant.SND_WINMETER + winLevel, "default", true);
  }
}

const mojongShakeRangs: { [key: string]: number[][] } = {};
export function playMojongShake(reels: Reels, resultResponse: any) {
  function getKey(i, j) {
    return `${i}_${j}`;
  }

  function getRandomRange(i, j) {
    let ranges = mojongShakeRangs[`r${i}_${j}`];
    if (!ranges) {
      ranges = [];
      for (let n = 0; n < 10; n++) {
        ranges.push([Math.random() * 2 - 1, Math.random() * 2 - 1]);
      }
      ranges = [[0, 0], ...ranges, [0, 0]];
      mojongShakeRangs[`${getKey(i, j)}`] = ranges;
    }
    return ranges;
  }

  function shake(symbol, k, x, y, ranges) {
    const _k = k * ranges.length;
    const lastK = Math.min(Math.floor(_k), ranges.length - 1),
      lastRangeX = ranges[lastK][0],
      lastRangeY = ranges[lastK][1];
    const nextK = Math.min(Math.ceil(_k), ranges.length - 1),
      nextRangeX = ranges[nextK][0],
      nextRangeY = ranges[nextK][1];
    const rK = _k - lastK;
    const offsetX = lastRangeX + (nextRangeX - lastRangeX) * rK;
    const offsetY = lastRangeY + (nextRangeY - lastRangeY) * rK;
    const _x = -3 * offsetX;
    const _y = 3 * offsetY;
    symbol.content.x = x + _x;
    symbol.content.y = y + _y;
  }

  // const winPositions = resultResponse.value.winPositions
  //   ? resultResponse.value.winPositions
  //   : resultResponse.value.bonus && resultResponse.value.bonus.gameResult
  //     ? resultResponse.value.bonus.gameResult.winPositions
  //       ? resultResponse.value.bonus.gameResult.winPositions
  //       : resultResponse.value.bonus.gameResult.spinResult.winPositions
  //     : [];
  const winPositionMap: { [key: string]: boolean } = {};
  // for (let i = 0; i < winPositions.length; i++) {
  //   const winPosition = winPositions[i];
  //   const count = winPosition.count;
  //   const rowPositions = winPosition.rowPositions;
  //   for (let j = 0; j < count; j++) {
  //     winPositionMap[`${getKey(i, rowPositions[j])}`] = true;
  //   }
  // }

  const shakeParamsMap: { [key: string]: { position: number[]; symbol: any; range: number[][] } } = {};
  for (let i = 0; i < reels.symbols.length; i++) {
    const reel = reels.symbols[i];
    for (let j = 0; j < reel.length; j++) {
      const key = getKey(i, j);
      if (!winPositionMap[key]) {
        const symbol = reel[j];
        shakeParamsMap[`${getKey(i, j)}`] = {
          position: [symbol.content.x, symbol.content.y],
          symbol: symbol,
          range: getRandomRange(i, j)
        };
      }
    }
  }

  function update(k: number) {
    for (let i = 0; i < reels.symbols.length; i++) {
      const reel = reels.symbols[i];
      for (let j = 0; j < 6; j++) {
        const params = shakeParamsMap[`${getKey(i, j)}`];
        if (params) {
          shake(params.symbol, k, params.position[0], params.position[1], params.range);
        }
      }
    }
  }

  mahjongShakeTween = new TWEEN.Tween({ k: 0 })
    .to({ k: 1 }, 300)
    .onUpdate((v) => {
      update(v.k || 1);
    })
    .repeat(Number.POSITIVE_INFINITY)
    .start();
}

export function stopMojongShake(): Promise<void> {
  return new Promise((res) => {
    // mahjongShakeTween.repeat(1);
    // mahjongShakeTween.onComplete(() => {
    //   mahjongShakeTween.stop();
    //   TWEEN.remove(mahjongShakeTween);
    //   mahjongShakeTween = null;
    //   res();
    // });
    res();
    delayAnimatable(slotApp.player().isTurbo ? 300 : 800).then(() => {
      mahjongShakeTween.end().stop();
      TWEEN.remove(mahjongShakeTween);
      mahjongShakeTween = null;
      res();
    });
  });
}

function playWinEffect() {
  scene.animation.playWinEffect(winLevel);
}

function clearWinEffect() {
  timeout = 0;
  winCounter = null;

  delayAnimatable(500).then(() => {
    scene.animation.removeWinEffect().then(() => {
      scene.footerBar.winBox.visible = false;
      scene.btnSpin.show("spin");
      resolve && resolve();
      resolve = null;
    });
  });
}

export function setWinLevel() {
  const cumulativeWin = (scene.resultResponse.value as any).cumulativeWin;

  winLevel = 0;
  const winAmount: any = new Decimal(cumulativeWin);
  if (winAmount.gt(0)) {
    // winLevel = 1;
    const totalbet = scene.player.totalBet.toNumber();
    for (let i = constant.WINLINE_LEVELS.length - 1; i >= 0; i--) {
      if (winAmount.gte(totalbet * constant.WINLINE_LEVELS[i])) {
        winLevel = i + 1;
        break;
      }
    }
    timeout = constant.WIN_AMOUNT_DURATION * constant.WINLINE_DURATIONS[winLevel - 1];
  }
}
// ALL REELS STOPS
export function onReelStart() {}

export function onReelStop(reel) {}

export function onReelsStop() {
  stopSoundSpinning();
  return async(() => {}, 200);
}

export function parseWinlines(positions: any[]) {
  const winLines = [];
  if (!positions) return winLines;
  positions.forEach((value, i) => {
    winLines.push(parseWinline(value));
  });
  return winLines;
}

export function parseWinline(value) {
  const rowPositions = [];
  for (let i = 0; i < value.rowPositions.length; i++) {
    const row = value.rowPositions[i] - 1;
    if (row >= 0) rowPositions.push([i, row]);
  }
  return {
    index: value.line,
    win: value.win,
    multiplier: value.multiplier,
    wildMultiplier: value.wildMultiplier || 0,
    positions: rowPositions,
    symbol: value.symbol,
    type: value.type
  };
}

export function getLanguage(upperCase = false): string {
  const lang: string = slotApp.context().LANGUAGE;
  let langReturn = "en";
  if (lang === Languages.Chinese) langReturn = "cn";
  return upperCase ? langReturn.toUpperCase() : langReturn.toLocaleLowerCase();
}

export function fade(from, to, sound, time = 500, delay = 0, callback?) {
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

export function getAsset(path: string, imageType: string = "png") {
  let assetRes;
  if (imageType == "img") {
    assetRes = director.resourceManager.resolve(path);
  } else {
    assetRes = director.resourceManager.resolve(path + "." + imageType);
  }
  return assetRes;
}

let bgmmain;
let bgmwin;
let soundTween;
let soundSpinning;
let fireSlotSound;
let bigWinSound;
let totalWinCoinSound;
export function initMainBGM() {
  if (director.device.isUCBrowser) return;
  const soundService = director.services.get<SoundService>("soundService");
  soundService.stopBgm();
  soundService.volume = 0;
  if (bgmmain && bgmwin) {
    stopWinBGM(true);
    delayAnimatable(300).then(() => {
      soundService.volume = 1;
      soundService.setVolume(1, bgmmain.soundId);
      bgmmain.volume = 1;
    });
    return;
  }
  bgmwin = slotApp.playSound(constant.BGM_FREE, "default", true);
  bgmmain = slotApp.playSound(constant.BGM_MAIN, "default", true);
  stopWinBGM(true);
  delayAnimatable(200).then(() => {
    soundService.volume = 1;
    soundService.setVolume(1, bgmmain.soundId);
    bgmmain.volume = 1;
  });
}

export function clearBgm() {
  if (director.device.isUCBrowser) return;
  if (bgmmain) {
    slotApp.stopSound(bgmmain);
  }
  if (bgmwin) {
    slotApp.stopSound(bgmwin);
  }
  bgmmain = bgmwin = null;
}

export function playMainBGM(time: number = 500) {
  if (!bgmmain || director.device.isUCBrowser) return;
  const soundService = director.services.get<SoundService>("soundService");
  if (bgmmain.volume === 0) {
    soundService.setVolume(0, bgmmain.soundId);
    bgmmain.volume = 0;
    fade(0, 1, bgmmain, time);
  } else {
    soundService.setVolume(1, bgmmain.soundId);
    bgmmain.volume = 1;
  }
}

export function stopMainBGM(isbgm?: boolean, time: number = 500) {
  if (!bgmmain || director.device.isUCBrowser) return;
  const soundService = director.services.get<SoundService>("soundService");
  if (bgmmain.volume === 1) {
    soundService.setVolume(1, bgmmain.soundId);
    bgmmain.volume = 1;
    fade(1, 0, bgmmain, time);
  } else {
    soundService.setVolume(0, bgmmain.soundId);
    bgmmain.volume = 0;
  }
}

export function playWinBGM() {
  if (!bgmwin || director.device.isUCBrowser) return;
  const soundService = director.services.get<SoundService>("soundService");
  if (soundTween) {
    soundTween.stop();
  }
  soundService.setVolume(0, bgmwin.soundId);
  bgmwin.volume = 0;
  fade(0, 0.8, bgmwin);
  soundTween = null;
}

export function stopWinBGM(force?: boolean, time = 500, delay = 0) {
  if (!bgmwin || director.device.isUCBrowser) return;
  const soundService = director.services.get<SoundService>("soundService");
  if (soundTween) {
    soundTween.stop();
    soundService.setVolume(0, bgmwin.soundId);
    bgmwin.volume = 0;
  }
  if (force) {
    soundService.setVolume(0, bgmwin.soundId);
    bgmwin.volume = 0;
    soundTween = null;
  } else {
    if (bgmwin.volume === 0.8) {
      soundTween = fade(0.8, 0, bgmwin, time, delay);
    }
  }
}

export function playBgm() {
  if (scene.isFreeSpin) {
    playWinBGM();
  } else {
    playMainBGM();
  }
}

export function stopBgm() {
  if (scene.isFreeSpin) {
    stopWinBGM();
  } else {
    stopMainBGM();
  }
}

export function playSoundSpinning() {
  if (director.device.isUCBrowser) return;
  soundSpinning = slotApp.playSound("reelspinningbgm", "default", true);
}

export function stopSoundSpinning() {
  if (soundSpinning) {
    slotApp.stopSound(soundSpinning);
    soundSpinning = null;
  }
}

export function playSlotFireSpinning() {
  if (director.device.isUCBrowser) return;
  fireSlotSound = slotApp.playSound(constant.SND_SLOTFIRE, "default");
  stopBgm();
}

export function stopSlotFireSpinning() {
  if (fireSlotSound) {
    slotApp.stopSound(fireSlotSound);
    fireSlotSound = null;
    playBgm();
  }
}

export function playTotalWinCoinSound() {
  if (director.device.isUCBrowser) return;
  totalWinCoinSound = slotApp.playSound("jng_winmeter_high_bgm", "default");
}

export function stopTotalWinCoinSound() {
  if (totalWinCoinSound) {
    fade(1, 0, totalWinCoinSound, 500, 0, () => {});
    delayAnimatable(500).then(() => {
      slotApp.stopSound(totalWinCoinSound);
      totalWinCoinSound = null;
    });
  }
}

export function playBigWinSound() {
  if (director.device.isUCBrowser) return;
  bigWinSound = slotApp.playSound("bigwin_level_body", "default", true, false, () => {
    slotApp.playSound("bigwin_level_outro", "default", true);
  });
}

export function stopBigWinSound() {
  if (bigWinSound) {
    slotApp.stopSound(bigWinSound);
    bigWinSound = null;
  }
}
