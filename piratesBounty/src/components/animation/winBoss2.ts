import { EmitterConfigV3, behaviors } from "@pixi/particle-emitter";
import { mapWith } from "common/util/array";
import { pad } from "common/util/string";

export const BIG_WIN_PARTICLE: EmitterConfigV3 = {
    lifetime: {
        min: 1,
        max: 1
    },
    frequency: 0.033,
    pos: {
        x: 0,
        y: 0
    },
    maxParticles: 600,
    emitterLifetime: -1,
    addAtBack: false,
    particlesPerWave: 1,
    behaviors: [
        {
            type: 'animatedRandom',
            config: {
                "anims": [
                    {
                        framerate: 20,
                        loop: true,
                        textures: [
                            ...mapWith(20, (i) => {
                                return `gpiCoins_00${pad(i + 1, 2)}.png`
                            })
                        ]
                    }
                ]
            }
        }, {
            type: "moveAcceleration",
            config: {
                accel: {
                    x: 0,
                    y: 0
                },
                minStart: 200,
                maxStart: 700,
                rotate: true
            }
        }, {    //
            type: "scale",
            config: {
                scale: {
                    list: [
                        {
                            time: 0,
                            value: 0.3
                        },
                        {
                            time: 1,
                            value: 2
                        }
                    ]
                },
                minMult: 1
            }
        }, {
            type: "spawnBurst",
            config: {
                spacing: 90,
                start: 0,
                distance: 40,
            }
        }, { //
            type: "blendMode",
            config: {
                blendMode: "add"
            }
        }, { //
            type: "rotation",
            config: {
                minStart: 0,
                maxStart: 360,
                minSpeed: 0,
                maxSpeed: 360,
                accel: 600
            }
        }, { //
            type: 'color',
            config: {
                color: {
                    list: [{ value: '#e6e6e6', time: 0 }, { value: '#ffffff', time: 1 }]
                }
            }
        }
    ]
}