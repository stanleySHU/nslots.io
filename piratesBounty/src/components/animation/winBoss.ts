import { EmitterConfigV3, behaviors } from "@pixi/particle-emitter";
import { mapWith } from "common/util/array";
import { pad } from "common/util/string";

export const BIG_WIN_PARTICLE: EmitterConfigV3 = {
    lifetime: {
        min: 5,
        max: 8
    },
    frequency: 0.005,
    pos: {
        x: 0,
        y: -60
    },
    maxParticles: 100,
    emitterLifetime: 0.5,
    addAtBack: false,
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
        } ,{
            type: "moveAcceleration",
            config: {
                accel: {
                    x: 0,
                    y: 200
                },
                minStart: 60,
                maxStart: 600,
                rotate: true
            }
        } ,{
            type: "scale",
            config: {
                scale: {
                    list: [
                        {
                            time: 0,
                            value: 0.8
                        },
                        {
                            time: 1,
                            value: 1.5
                        }
                    ]
                },
                minMult: 1.5
            }
        } , {
            type: "spawnShape",
            config: {
                type: 'rect',
                data: {
                    x: -140,
                    y: -5,
                    h: 280,
                    w: 10,
                }
            }

        }, {
            type: "alpha",
            config: {
                alpha: {
                    list: [
                        {
                            time: 0,
                            value: 1
                        },
                        {
                            time: 1,
                            value: 0.8
                        }
                    ]
                }
            }
        }, {
            type: "blendMode",
            config: {
                blendMode: "normal"
            }
        }, {
            type: "rotation",
            config: {
                minStart: 30,
                maxStart: -180,
                minSpeed: 30,
                maxSpeed: 180,
                accel: 600
            }
        }
    ]
}