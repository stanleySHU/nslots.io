import { Animatable } from "../../engine/src/animation/animatable";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import * as director from "../../engine/src/director";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { remove } from "../../engine/src/util/array";
import { delayForSpine } from "../../engine/src/util/async";
import * as tween from "../../engine/src/util/tween";

import {
  SND_FREE_IN,
  bigwin_config,
  coins_config,
  coins_textures,
  free_coin_config,
  free_s_config,
  free_yuanbao_config,
  getFreeSpin_config,
  getImageResource,
  sparkle_texture
} from "../constants";
import { getLanguage } from "../scenes/mainScene";
import { GameMainScene as MainScene } from "../scenes/mainScene.mobile";
import { AnimatedEmitter } from "./emitters";

export type ScatterPosition = {
  col: number;
  row: number;
};

export function fadeInComonentAndVisible(obj: Layer) {
  if (!obj.visible) {
    obj.visible = true;
    tween.fadeIn(obj, 500);
  }
}

export function fadeOutComonentAndVisible(obj: Layer) {
  if (obj.visible) {
    tween.fadeOut(obj, 500, () => {
      obj.visible = false;
    });
  }
}

export function setAnimationStatic(obj: SpineAnimation, anim: string, loop: boolean = false, callback?: () => void, timetrack: number = 0) {
  if (callback) {
    const listener = obj.addCompleteListener((j, i) => {
      obj.removeCompleteListener(listener);
      if (callback) callback();
    });
  }
  obj.setAnimation(timetrack, anim, loop);
  obj.setVisibleAnimated(true);
}

export function setWinScatter(symbol: any) {
  slotApp.playSound(SND_FREE_IN, "default");
  const isTurbo = slotApp.player().isTurbo;
  (symbol.content.spine as SpineAnimation).timeScale = isTurbo ? 2 : 1;

  symbol.content.spine.setAnimation(0, "Scatter_Trigger", true);
  symbol.content.spine.animated = true;

  delayForSpine(isTurbo ? 1000 : 2000).then(() => {
    symbol.content.spine.setAnimation(0, "Scatter_Idle", true);
  });
}

export function setWinAnimation(index: number | string, symbol: any, obj: Layer & { anime: SpineAnimation; wild: SpineAnimation }) {
  const isTurbo = slotApp.player().isTurbo;
  const speed = isTurbo ? 2 : 1;
  (obj.anime as SpineAnimation).timeScale = speed;
  (obj.wild as SpineAnimation).timeScale = speed;

  const sIndex = Number(index);
  const isSuperGold = sIndex > 10;
  if (sIndex != 10) {
    obj.anime.setAnimation(0, "Tile FlipMerged", false);
    obj.anime.animated = true;
  } else {
    obj.anime.setSkin(`Wild_${getLanguage(true)}`);
    setAnimationStatic(obj.anime, "Wild_Trigger", false, () => {
      setAnimationStatic(obj.anime, "wildCollapse", false, () => {
        obj.anime.setVisibleAnimated(false);
      });
    });

    // delayForSpine(500).then(() => {
    //   setAnimationStatic(obj.fx, "multiplier_fx", false, () => {
    //     obj.fx.setVisibleAnimated(false);
    //   });
    // });
  }

  delayForSpine(isTurbo ? 1000 : 2000).then(() => {
    obj.anime.animated = false;
    if (isSuperGold) {
      symbol.idle();
      symbol.parent.addChildAt(symbol, symbol.parent.children.length - 1);
      symbol.content.spine.setSkin(`Wild_${getLanguage(true)}`);
      symbol.content.spine.setAnimation(0, "Wild_Idle", true);
      symbol.content.spine.animated = true;
      symbol.content.spine.tint = 0xffffff;
      symbol.index = 10;
    }
  });

  if (isSuperGold) {
    delayForSpine(isTurbo ? 500 : 1000).then(() => {
      slotApp.playSound("sfx_sym_wild_transform", "default");
      obj.wild.setAnimation(0, "Wild_Trigger", false);
      obj.wild.animated = true;
      obj.wild.visible = true;
    });
  } else {
    obj.wild.visible = false;
  }
}

export class SceneAnimation implements Animatable {
  private coinsEmitter: AnimatedEmitter;
  private getFreeEmitter: PIXI.particles.Emitter;
  private bigWinEmitter: PIXI.particles.Emitter;
  private freeWinEmitter_yuanbao: PIXI.particles.Emitter;
  private freeWinEmitter_coin: PIXI.particles.Emitter;
  private freeWinEmitter_s: PIXI.particles.Emitter;
  animated: boolean = true;
  private coin_active: boolean = false;
  private activeArr: PIXI.particles.Emitter[] = [];
  private elapsed = Date.now();

  constructor(public scene: MainScene) {
    this.coinsEmitter = new AnimatedEmitter(scene.wineffectbox, coins_textures(), coins_config, 0.0012);

    const bigWinContainer = new PIXI.Container();
    const getFreeContainer = new PIXI.Container();
    const freeWinContainer = new PIXI.Container();

    this.getFreeEmitter = new PIXI.particles.Emitter(getFreeContainer, PIXI.particles.upgradeConfig(getFreeSpin_config, sparkle_texture()));

    this.bigWinEmitter = new PIXI.particles.Emitter(bigWinContainer, PIXI.particles.upgradeConfig(bigwin_config, sparkle_texture()));

    this.freeWinEmitter_yuanbao = new PIXI.particles.Emitter(
      freeWinContainer,
      PIXI.particles.upgradeConfig(free_yuanbao_config, getImageResource("yuanbao"))
    );
    this.freeWinEmitter_coin = new PIXI.particles.Emitter(freeWinContainer, PIXI.particles.upgradeConfig(free_coin_config, coins_textures()));
    this.freeWinEmitter_s = new PIXI.particles.Emitter(freeWinContainer, PIXI.particles.upgradeConfig(free_s_config, sparkle_texture()));

    scene.bigWinEffectbox.addChild(bigWinContainer);
    scene.getFreeEffectbox.addChild(getFreeContainer);
    scene.freeWinEffectbox.addChild(freeWinContainer);

    director.juggler.add(this);
  }

  playGetFreeEffect() {
    this.activeArr.push(this.getFreeEmitter);
    this.getFreeEmitter.playOnce();
  }

  stopGetFreeEffect() {
    remove(this.activeArr, this.getFreeEmitter);
    this.getFreeEmitter.cleanup();
  }

  playBigWinEffect() {
    this.activeArr.push(this.bigWinEmitter);
    this.bigWinEmitter.playOnce();
  }

  stopBigWinEffect() {
    remove(this.activeArr, this.bigWinEmitter);
    this.bigWinEmitter.cleanup();
  }

  playFreeWinEffect() {
    this.activeArr.push(this.freeWinEmitter_yuanbao);
    this.activeArr.push(this.freeWinEmitter_coin);
    this.activeArr.push(this.freeWinEmitter_s);
    this.freeWinEmitter_yuanbao.playOnce();
    this.freeWinEmitter_coin.playOnce();
    this.freeWinEmitter_s.playOnce();
  }

  stopFreeWinEffect() {
    remove(this.activeArr, this.freeWinEmitter_yuanbao);
    remove(this.activeArr, this.freeWinEmitter_coin);
    remove(this.activeArr, this.freeWinEmitter_s);
    this.freeWinEmitter_yuanbao.cleanup();
    this.freeWinEmitter_coin.cleanup();
    this.freeWinEmitter_s.cleanup();
  }

  private playSmallWinEffect(winLevel: number) {
    if (!this.coin_active || !this.coinsEmitter) return;
    this.coinsEmitter.show(winLevel);
  }

  playWinEffect(winLevel: number) {
    if (this.coin_active) return;
    this.coin_active = true;

    this.playSmallWinEffect(winLevel);
  }

  removeWinEffect(): Promise<void> {
    this.coin_active = false;
    if (this.coinsEmitter) this.coinsEmitter.stop();
    return Promise.resolve();
  }

  advanceTime(elapsedFrames: number): boolean {
    const now = Date.now();
    const t = now - this.elapsed;
    for (const item of this.activeArr) {
      item.update(t / 1000);
    }
    this.elapsed = now;
    return true;
  }

  exit() {}
}
