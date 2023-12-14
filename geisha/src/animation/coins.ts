import { EmitterConfigV3, behaviors } from "@pixi/particle-emitter";
import { mapWith } from "../../../common/src/util/array";

export const COINS_ANIMATION: EmitterConfigV3 = {
    lifetime: {
        min: 1.2,
        max: 1.2
    },
    frequency: 0.1,
    pos: {
        x: 0,
        y: 0
    },
    maxParticles: 11,
    emitterLifetime: -1,
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
                                return `coin_${i + 1}.png`
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
                    y: 2400
                },
                minStart: 200,
                maxStart: 900,
                rotate: true
            }
        } ,{
            type: "scale",
            config: {
                scale: {
                    list: [
                        {
                            time: 0,
                            value: 1
                        },
                        {
                            time: 1,
                            value: 3
                        }
                    ]
                },
                minMult: 1
            }
        } , {
            type: "rotationStatic",
            config: {
                min: 230,
                max: 310
            }
        } , {
            type: 'color',
            config: {
                color: {
                    list: [{value: '#e6e6e6', time: 0}, {value: '#ffffff', time: 1}]
                }
            }
        }
    ]
}