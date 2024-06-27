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
    // this.emitter.particleConstructor = particles.AnimatedParticle;
    // this.emitter.particleImages[0].textures = assets;
    // this.emitter.particleImages[0].framerate = framerate;
    // this.emitter.particleImages[0].loop = true;
    this.emitter.emit = false;
    parent.addChild(container);
    director.juggler.add(this);
  }

  show(level = 0) {
    if (!this.emitter) return;
    if (level > 0) {
      this.emitter.maxParticles = WIN_LEVEL_COINS[level - 1];
      this.emitter.frequency = WIN_LEVEL_FREQUENCIES[level - 1];
    }
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
    if (!this.emitter) return true;
    const now = Date.now();
    this.emitter.update((now - this.elapsed) * this.speed);
    this.elapsed = now;
    return true;
  }
}
