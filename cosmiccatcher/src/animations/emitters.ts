import { Animatable } from "../../engine/src/animation/animatable";
import * as director from "../../engine/src/director";
import { WIN_LEVEL_COINS, WIN_LEVEL_FREQUENCIES } from "../constants";

const SPEED: number = 0.001;

export class AnimatedEmitter implements Animatable {
  private emitter: PIXI.particles.Emitter;
  private elapsed: number;

  constructor(
    private parent,
    assets,
    config,
    private speed = SPEED,
    framerate = 30
  ) {
    const container = new PIXI.Container();
    const textures = [
      {
        textures: assets,
        framerate: framerate,
        loop: true
      }
    ];
    this.emitter = new PIXI.particles.Emitter(container, PIXI.particles.upgradeConfig(config, textures));
    this.emitter.emit = false;
    parent.addChild(container);
    director.juggler.add(this);
  }

  show(level: number) {
    if (!this.emitter) return;
    this.emitter.maxParticles = WIN_LEVEL_COINS[level];
    this.emitter.frequency = WIN_LEVEL_FREQUENCIES[level];
    this.elapsed = Date.now();
    this.emitter.emit = true;
  }

  stop() {
    this.emitter.emit = false;
  }

  destroy() {
    director.juggler.remove(this);
    this.emitter.destroy();
    this.emitter.cleanup();
    this.emitter = null;
    this.parent.removeChildren();
  }

  advanceTime(elapsedFrames: number): boolean {
    if (!this.emitter && this.emitter.emit) return true;
    const now = Date.now();
    this.emitter.update((now - this.elapsed) * this.speed);
    this.elapsed = now;
    return true;
  }
}
