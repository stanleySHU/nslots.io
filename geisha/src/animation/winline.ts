import { Emitter, upgradeConfig, behaviors } from '@pixi/particle-emitter';
import { Container, Sprite, Point, IPointData, Ticker, Texture } from 'pixi.js'
import { Tween, Interpolation, Easing } from '@tweenjs/tween.js'
import { getTexture } from 'common/util/assetsLoad';
import { R_Components } from 'common/assets';

function line_particle(): any {
    return {
        framerate: 3,
        loop: true,
        textures: [
            getTexture(R_Components, 'particle_Orange_Solid_01.png'),
            getTexture(R_Components, 'particle_Orange_Solid_02.png'),
            getTexture(R_Components, 'particle_Orange_Solid_03.png')
        ]
    };
}

function particle_textures(): any {
    return {
        framerate: 1,
        loop: true,
        textures: [
            getTexture(R_Components, 'line_particle.png')
        ]
    }
}

function star_particle(): Texture {
    return getTexture(R_Components, 'particle_blue_01.png');
}

export class WinLine extends Container {
    private m_starHead: Sprite;

    private m_lineParticle: Emitter;
    private m_outlineParticle: Emitter;
    private m_lineParticleContainer: Container;

    private m_particleEmitter: Emitter;
    private m_particleContainer: Container;
    private m_symbolHitParticleEmitter: Emitter;

    private tween: any;
    private m_targetCoords: any;
    private m_startCoords: any;

    private m_controlPoints: IPointData[];
    private m_targetCoordsArray: IPointData[];

    private m_delay: number;

    private m_emitting: boolean = false;
    private m_reached: boolean = false;

    constructor() {
        super();

        this.m_controlPoints = [];
        this.m_targetCoordsArray = [];

        this.createLineParticle();
        this.createParticle();

        this.m_starHead = new Sprite(star_particle());
        this.m_starHead.scale.set(1.3);
        this.m_starHead.anchor.set(0.5);
        this.addChild(this.m_starHead);

        this.m_delay = 0;
    }

    public play(pStartPoint: IPointData, pEndPoint: IPointData): void {
        if (this.tween) {
            this.tween = null;
        }

        var midpoint = { x: (pStartPoint.x), y: (pStartPoint.y) };
        midpoint.y += 400;
        midpoint.x -= 200;


        var xpoints = [pStartPoint.x, midpoint.x, pEndPoint.x];
        var ypoints = [pStartPoint.y, midpoint.y, pEndPoint.y];

        this.m_targetCoords = { x: pStartPoint.x, y: pStartPoint.y };

        this.m_lineParticle.emit = false;
        this.m_outlineParticle.emit = false;
        this.m_particleEmitter.emit = false;
        this.m_delay = 0;

        this.m_lineParticle.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);
        this.m_outlineParticle.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);
        this.m_particleEmitter.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);

        this.m_starHead.position.set(this.m_targetCoords.x, this.m_targetCoords.y);

        this.tween = new Tween(this.m_targetCoords)
            .to({ x: xpoints, y: ypoints }, 1000)
            .interpolation(Interpolation.Bezier)
            .easing(Easing.Circular.In)
            .onUpdate((ob) => {

                this.m_starHead.position.set(this.m_targetCoords.x, this.m_targetCoords.y);

                this.m_lineParticle.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);
                this.m_outlineParticle.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);

                if (!this.m_particleEmitter.emit) {
                    this.m_delay += Ticker.shared.elapsedMS;
                    if (this.m_delay >= 4) {
                        this.m_particleEmitter.emit = true;
                    }
                }
                this.m_particleEmitter.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);
            }).onStart(() => {

                this.m_lineParticle.emit = true;
                this.m_outlineParticle.emit = true;
                this.resetReached();
                this.m_emitting = true;
            })
            .onComplete(() => {
                this.m_symbolHitParticleEmitter.updateOwnerPos(this.m_targetCoords.x, this.m_targetCoords.y);
                this.m_symbolHitParticleEmitter.playOnce(() => {
                    this.m_emitting = false;
                });

                this.m_targetCoords = { x: pStartPoint.x, y: pStartPoint.y };
                this.m_reached = true;

            })
            .start();
    }

    onUpdate(pDeltaTime: number) {
        if (this.m_lineParticle) {
            this.m_lineParticle.update(pDeltaTime);
        }

        if (this.m_particleEmitter) {
            this.m_particleEmitter.update(pDeltaTime);
        }

        if (this.m_symbolHitParticleEmitter) {
            this.m_symbolHitParticleEmitter.update(pDeltaTime);
        }
    }

    destroy() {
        if (this.tween) this.tween.stop();
        if (this.m_lineParticle) this.m_lineParticle.destroy();
        if (this.m_outlineParticle) this.m_outlineParticle.destroy();
        if (this.m_particleEmitter) this.m_particleEmitter.destroy();
        if (this.parent) this.parent.removeChild(this);
        super.destroy();
    }

    get emitting(): boolean {
        return this.m_emitting;
    }

    get reached(): boolean {
        return this.m_reached;
    }

    resetReached() {
        this.m_reached = false;
    }

    private createLineParticle() {
        this.m_lineParticleContainer = new Container();
        this.addChild(this.m_lineParticleContainer);

        this.m_lineParticle = this.createStarLineEmitter(this.m_lineParticleContainer, line_particle());
        this.m_outlineParticle = this.createLineEmitter(this.m_lineParticleContainer, line_particle());
    }

    private createLineEmitter(parentContainer: Container, pTextures: string[]): Emitter {
        const config = upgradeConfig({
            alpha: {
                start: 1,
                end: 0
            },
            scale: {
                start: 1.3,
                end: 0.3,
                minimumScaleMultiplier: 0.5
            },
            color: {
                start: '#ff5400',
                end: '#ff5400'
            },
            speed: {
                start: 0,
                end: 0,
                minimumSpeedMultiplier: 1
            },
            acceleration: {
                x: 0,
                y: 0
            },
            maxSpeed: 0,
            startRotation: {
                min: 0,
                max: 0
            },
            noRotation: false,
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.3,
                max: 0.3
            },
            blendMode: 'add',
            frequency: 0.0001,
            emitterLifetime: -1,
            maxParticles: 1000,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: true,
            spawnType: 'point',
            particlesPerWave: 1,
            particleSpacing: 0,
            angleStart: 0
        }, pTextures);
        const emitter = new Emitter(parentContainer, config)

        //emitter.emit = true;

        return emitter;
    }

    private createStarLineEmitter(parentContainer: Container, pTextures: string[]): Emitter {
        const emitter = new Emitter(parentContainer, upgradeConfig({
            alpha: {
                start: 1,
                end: 0
            },
            scale: {
                start: 1,
                end: 0.5,
                minimumScaleMultiplier: 0.7
            },
            color: {
                start: '#ffffff',
                end: '#ffffff'
            },
            speed: {
                start: 50,
                end: 0,
                minimumSpeedMultiplier: 0.5
            },
            acceleration: {
                x: -10,
                y: 0
            },
            maxSpeed: 100,
            startRotation: {
                min: 0,
                max: 0
            },
            noRotation: false,
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.3,
                max: 0.1
            },
            blendMode: 'add',
            frequency: 0.0001,
            emitterLifetime: 1.1,
            maxParticles: 2500,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: true,
            spawnType: 'point',
            particlesPerWave: 1,
            particleSpacing: 0,
            angleStart: 0
        }, pTextures));

        emitter.emit = false;

        return emitter;
    }

    private createParticle() {
        this.m_particleContainer = new Container();
        this.addChild(this.m_particleContainer);

        this.m_particleEmitter = this.createParticleEmitter();
        this.m_symbolHitParticleEmitter = this.createParticleEmitter();

        this.m_symbolHitParticleEmitter.particlesPerWave = 1;
        this.m_symbolHitParticleEmitter.emitterLifetime = 0.3;
        this.m_symbolHitParticleEmitter.frequency = 0.01;
    }

    private createParticleEmitter(): Emitter {
        const emitter = new Emitter(this.m_particleContainer, upgradeConfig({
            alpha: {
                start: 1.0,
                end: 0
            },
            scale: {
                start: 0.4,
                end: 0.3,
            },
            minimumScaleMultiplier: 0.5,
            color: {
                start: '0xffffff',
                end: '0xffffff',
            },
            speed: {
                start: 100,
                end: 50,
            },
            minimumSpeedMultiplier: 0.5,
            maxSpeed: 50,
            startRotation: {
                min: 10,
                max: 270,
            },
            rotationSpeed: {
                min: 0,
                max: 0,
            },
            lifetime: {
                min: 1,
                max: 1,
            },
            acceleration: {
                x: 0,
                y: 0
            },
            blendMode: 'add',
            frequency: 0.02,
            emitterLifetime: 1.5,
            maxParticles: 2500,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: 'point',
            particlesPerWave: 1,
            particleSpacing: 1,
            angleStart: 0,
        }, particle_textures()))

        emitter.emit = false;

        return emitter;
    }
}