import * as animatable from "../engine/src/animation/animatable";
import { Register } from "../engine/src/core/registry";
import * as director from "../engine/src/director";

@Register({ tag: "winLineEmitter", category: "service" })
export class Emitter implements animatable.Animatable {
  emitter: PIXI.particles.Emitter;
  data: any = null;
  frequency: number = 1;
  px: number = 0;
  py: number = 0;

  constructor(
    private particles: string[],
    private dataSrc: string,
  ) {}

  init(parent: PIXI.Container, frequency: number, px: number, py: number) {
    if (!this.particles || !this.dataSrc) {
      throw "Emitter need a list of particle image and json options";
    }
    this.frequency = frequency * 0.001;
    this.px = px;
    this.py = py;
    const container: any = new PIXI.Container();
    const particleImages = this.resolveParticleImages();
    if (!this.data) this.data = director.resourceManager.json(this.dataSrc);
    this.emitter = new PIXI.particles.Emitter(container, PIXI.particles.upgradeConfig(this.data, particleImages));
    this.emitter.updateSpawnPos(this.px, this.py);
    parent.addChild(container);
  }

  resolveParticleImages() {
    const images = [];
    for (let i = 0; i < this.particles.length; i++) {
      images.push(director.resourceManager.resolve(this.particles[i]));
    }
    return images;
  }

  show() {
    if (!this.emitter) return;
    director.juggler.add(this);
    this.emitter.emit = true;
    this.advanceTime(0);
  }

  updatePosition(px: number, py: number) {
    this.px = px;
    this.py = py;
  }

  advanceTime(elapsedFrames: number): boolean {
    this.emitter.updateSpawnPos(this.px, this.py);
    this.emitter.update(elapsedFrames * this.frequency);
    return true;
  }

  destroy() {
    if (!this.emitter) return;
    director.juggler.remove(this);
    this.emitter.emit = false;
    this.emitter.destroy();
  }
}
