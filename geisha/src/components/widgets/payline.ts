import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import { Container, Point, IPointData, Texture, SimpleRope, BLEND_MODES } from 'pixi.js'
import { getTexture } from 'common/util/assetsLoad';
import { R_Components } from 'common/assets';


function linearInterpolation(pT: number, p1: number, p2: number) {
    return (p2 - p1) * pT + p1;
}

function clipInput(k: number, arr: number[]) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
}

function getTangent(k: number, factor: number, array: number[]) {
    return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}

function cubicInterpolation(array: number[], t: number, tangentFactor: number = 1) {
    const k = Math.floor(t);
    const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}

function fireball_textures(): any {
    return {
        framerate: 3,
        loop: true,
        textures: [
            getTexture(R_Components, 'ember_01.png'),
            getTexture(R_Components, 'ember_02.png'),
            getTexture(R_Components, 'ember_03.png')
        ]
    };
}

function trail_texture(): Texture {
    const texture = getTexture(R_Components, 'trail_particle.png');
    return texture;
}

export class GeishaPayline extends Container {
    private HistorySize: number = 30;
    private RopeSize: number = 20;

    private m_trailTexture: Texture;
    private m_historyX: number[];
    private m_historyY: number[];
    private m_points: Point[];

    private m_targetPoints: Point[];

    private m_rope: SimpleRope;

    private m_fireballParticle: Emitter;
    private m_fireballParticleContainer: Container;

    private m_enable: boolean;

    private m_totalTime: number = 1000;
    private m_startTime: number = 0;
    private m_counter: number = 0;

    private m_historyX_copy: number[] = [];
    private m_historyY_copy: number[] = [];

    public onComplete?: () => void;

    constructor(m_totalTime: number) {
        super();
        this.m_totalTime = m_totalTime;
        this.onStart();
    }

    onStart(): void {
        this.initHistory();
        this.initRopePoints();
        this.createRope();

        this.createFireballParticle();
    }

    public onUpdate(delta: number, pDeltaTime: number): void {
        pDeltaTime = pDeltaTime / 0.8;
        if (this.m_fireballParticle) {
            this.m_fireballParticle.update(pDeltaTime);
        }

        if (!this.m_enable)
            return;


        this.m_startTime += pDeltaTime;
        const counter = Math.min(Math.round(((this.m_startTime / this.m_totalTime) * this.m_targetPoints.length)), this.m_targetPoints.length - 1);
        if (this.m_counter != counter || counter == this.m_targetPoints.length - 1) {
            this.m_counter = counter;
            this.m_historyX.pop();
            this.m_historyX.unshift(this.m_targetPoints[counter].x);

            this.m_historyY.pop();
            this.m_historyY.unshift(this.m_targetPoints[counter].y);

            this.m_fireballParticle.updateSpawnPos(this.m_targetPoints[counter].x, this.m_targetPoints[counter].y);

            if (this.m_historyX[this.m_historyX.length - 1] == this.m_targetPoints[counter].x &&
                this.m_historyY[this.m_historyY.length - 1] == this.m_targetPoints[counter].y && counter >= this.m_targetPoints.length - 1) {
                this.play(false);
                this.resrtHistory();
                this.onComplete && this.onComplete();
            }

            for (let i = 0; i < this.RopeSize; i++) {
                const p = this.m_points[i];

                // Smoothing the curve
                const ix = cubicInterpolation(this.m_historyX, i / this.RopeSize * this.HistorySize);
                const iy = cubicInterpolation(this.m_historyY, i / this.RopeSize * this.HistorySize);

                p.x = ix;
                p.y = iy;
            }
        }
    }

    public setPoints(pPoints: IPointData[]): void {
        this.resetRope();

        if (!this.m_targetPoints) {
            this.m_targetPoints = [];
        }

        this.m_targetPoints = [];

        for (let i = 0; i < pPoints.length - 1; i++) {
            let t = 0;
            for (let x = 0; x < 10; x++) {
                const newX = linearInterpolation(t, pPoints[i].x, pPoints[i + 1].x);
                const newY = linearInterpolation(t, pPoints[i].y, pPoints[i + 1].y);

                this.m_targetPoints.push(new Point(newX, newY));
                t += (1 / 10);
            }

            for (let i = 0; i < this.HistorySize; i++) {
                this.m_historyX[i] = pPoints[0].x;
                this.m_historyY[i] = pPoints[0].y;
            }
        }
        this.m_historyX_copy = [...this.m_historyX];
        this.m_historyY_copy = [...this.m_historyY];

        this.m_fireballParticle.updateSpawnPos(pPoints[0].x, pPoints[0].y);
    }

    public play(e: boolean) {
        this.m_startTime = 0;
        this.visible = e;
        this.m_fireballParticle.emit = e;
        this.m_enable = e;
        this.resrtHistory();
    }

    private initHistory(): void {
        this.m_historyX = [];
        this.m_historyY = [];

        for (let i = 0; i < this.HistorySize; i++) {
            this.m_historyX.push(0);
            this.m_historyY.push(0);
        }
    }
    resrtHistory() {
        this.m_historyX = [...this.m_historyX_copy];
        this.m_historyY = [...this.m_historyY_copy];
    }

    private initRopePoints(): void {
        this.m_points = [];

        for (let i = 0; i < this.RopeSize; i++) {
            this.m_points.push(new Point(0, 0));
        }
    }

    private createRope(): void {
        this.m_trailTexture = trail_texture();
        this.m_rope = new SimpleRope(this.m_trailTexture, this.m_points);

        this.m_rope.blendMode = BLEND_MODES.SCREEN;

        this.addChild(this.m_rope);
    }

    private resetRope(): void {
        for (let i = 0; i < this.RopeSize; i++) {
            this.m_points[i].set(0, 0);
        }
    }

    private createFireballParticle() {
        this.m_fireballParticleContainer = new Container();
        this.m_rope.addChild(this.m_fireballParticleContainer);

        this.createEmitter(this.m_fireballParticleContainer);
    }

    private createEmitter(parentContainer: Container): void {
        const em = {
            alpha: {
                start: 1.0,
                end: 0
            },
            scale: {
                start: 1,
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
                min: 0,
                max: 360,
            },
            rotationSpeed: {
                min: 0,
                max: 0,
            },
            lifetime: {
                min: 1,
                max: 2,
            },
            acceleration: {
                x: 0,
                y: 0
            },
            blendMode: 'screen',
            frequency: 0.03,
            emitterLifetime: -1,
            maxParticles: 1000,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: 'point',
            particlesPerWave: 1,
            particleSpacing: 1,
            angleStart: 0
        }
        // const em = {
        //     "alpha": {
        //         "start": 1,
        //         "end": 0
        //     },
        //     "scale": {
        //         "start": 3,
        //         "end": 0.5,
        //         "minimumScaleMultiplier": 1
        //     },
        //     "color": {
        //         "start": "#ffffff",
        //         "end": "#fcc368"
        //     },
        //     "speed": {
        //         "start": 30,
        //         "end": 0,
        //         "minimumSpeedMultiplier": 1
        //     },
        //     "acceleration": {
        //         "x": 300,
        //         "y": 0
        //     },
        //     "maxSpeed": 0,
        //     "startRotation": {
        //         "min": -60,
        //         "max": 60
        //     },
        //     "noRotation": false,
        //     "rotationSpeed": {
        //         "min": 0,
        //         "max": 0
        //     },
        //     "lifetime": {
        //         "min": 0.5,
        //         "max": 2
        //     },
        //     "blendMode": "screen",
        //     "frequency": 0.001,
        //     "emitterLifetime": -1,
        //     "maxParticles": 100,
        //     "pos": {
        //         "x": 0,
        //         "y": 0
        //     },
        //     "addAtBack": false,
        //     "spawnType": "point"
        // };
        const config = upgradeConfig(em, fireball_textures())

        this.m_fireballParticle = new Emitter(parentContainer, config);
        this.m_fireballParticle.emit = false;
        //-IMPORTANT
    }
}