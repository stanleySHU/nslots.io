import { EmitterConfigV3, behaviors, upgradeConfig } from "@pixi/particle-emitter";
import { mapWith } from "common/util/array";

export function get_WIN_COINS_PARTICLE(lifeTimeSecond: number): EmitterConfigV3 {
    return upgradeConfig({
        "alpha": {
            "start": 1,
            "end": 0.8
        },
        "scale": {
            "start": 0.4,
            "end": 1.6,
            "minimumScaleMultiplier": 1
        },
        "color": {
            "start": "#ffffff",
            "end": "#ffffff"
        },
        "speed": {
            "start": 400,
            "end": 10,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 0,
            "y": 1000
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": -120,
            "max": -60
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 45,
            "max": 135
        },
        "lifetime": {
            "min": 0.9,
            "max": 2
        },
        "blendMode": "normal",
        "frequency": 0.05,
        "emitterLifetime": lifeTimeSecond,
        "maxParticles": 20,
        "pos": {
            "x": -25,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": 0,
            "w": 50,
            "h": 0
        }
    }, {
        framerate: 0,
        loop: true,
        textures: mapWith(19, (i) => {
            return `japCoins${i + 1}.png`
        })
    });
}

export function get_WIN_SAKURE_PARTICLE(lifeTimeSecond: number): EmitterConfigV3 {
    return upgradeConfig({
        "alpha": {
            "start": 1,
            "end": 0.8
        },
        "scale": {
            "start": 0.4,
            "end": 1.6,
            "minimumScaleMultiplier": 1
        },
        "color": {
            "start": "#ffffff",
            "end": "#ffffff"
        },
        "speed": {
            "start": 400,
            "end": 10,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 0,
            "y": 1000
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": -120,
            "max": -60
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 45,
            "max": 135
        },
        "lifetime": {
            "min": 0.9,
            "max": 2
        },
        "blendMode": "normal",
        "frequency": 0.05,
        "emitterLifetime": lifeTimeSecond,
        "maxParticles": 20,
        "pos": {
            "x": -25,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": 0,
            "w": 50,
            "h": 0
        }
    }, {
        framerate: 0,
        loop: true,
        textures: mapWith(20, (i) => {
            return `sakuraPetal_small_${i + 1}.png`
        })
    });
}


export function get_BIG_WIN_COINS_PARTICLE(lifeTimeSecond: number): EmitterConfigV3 {
    return upgradeConfig({
        "alpha": {
            "start": 1,
            "end": 1
        },
        "scale": {
            "start": 0.4,
            "end": 1.6,
            "minimumScaleMultiplier": 1
        },
        "color": {
            "start": "#e3bb6b",
            "end": "#ffffff"
        },
        "speed": {
            "start": 500,
            "end": 1,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 100,
            "y": 1200
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 230,
            "max": 260
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 0,
            "max": 360
        },
        "lifetime": {
            "min": 1.5,
            "max": 3
        },
        "blendMode": "normal",
        "frequency": 0.02,
        "emitterLifetime": lifeTimeSecond,
        "maxParticles": 50,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": 0,
            "w": 50,
            "h": 0
        }
    }, {
        framerate: 0,
        loop: true,
        textures: mapWith(19, (i) => {
            return `japCoins${i + 1}.png`
        })
    })
}

export function get_BIG_WIN_SAKURE_PARTICLE(lifeTimeSecond: number): EmitterConfigV3 {
    return upgradeConfig({
        "alpha": {
            "start": 1,
            "end": 1
        },
        "scale": {
            "start": 0.4,
            "end": 1.6,
            "minimumScaleMultiplier": 1
        },
        "color": {
            "start": "#e3bb6b",
            "end": "#ffffff"
        },
        "speed": {
            "start": 500,
            "end": 1,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 100,
            "y": 1200
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 230,
            "max": 260
        },
        "noRotation": false,
        "rotationSpeed": {
            "min": 0,
            "max": 360
        },
        "lifetime": {
            "min": 1.5,
            "max": 3
        },
        "blendMode": "normal",
        "frequency": 0.02,
        "emitterLifetime": lifeTimeSecond,
        "maxParticles": 50,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": 0,
            "w": 50,
            "h": 0
        }
    }, {
        framerate: 0,
        loop: true,
        textures: mapWith(20, (i) => {
            return `sakuraPetal_small_${i + 1}.png`
        })
    })
}