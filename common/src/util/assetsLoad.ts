import { AnimatedSprite, Assets, Spritesheet, Texture } from 'pixi.js';

export interface KRrsourceOptions {
    readonly type?: 'file' | 'rawAtlas' | 'spine',
    readonly id: string,
    readonly src?: string,
    readonly sheet?: {
        readonly frame?: number,
        readonly width: number,
        readonly size: readonly [number, number]
    }
    readonly spine?: {
        readonly rawAtlas?: string,
        readonly json?: string,
        readonly atlas?: string
    }
}

export function loadAssets(configs: readonly KRrsourceOptions[], onProgress: (e: number) => void): Promise<unknown> {
    let ids = [];

    function addResource(config: KRrsourceOptions) {
        ids.push(config.id);
        Assets.add(config.id, config.src);
    }

    for (let item of configs) {
        switch(item.type) {
            default: addResource(item);
        }
    }

    return Assets.load(ids, onProgress);
}

export function getImg(id: string): Texture {
    let t = Assets.get(id);
    return t;
}

export function getAtlas(id: string, name: string): Texture {
    let t: Spritesheet = Assets.get(id);
    return t.textures[name];
}

export function getSheetAnimationTextures(id: string, name: string): Texture[] {
    let t: Spritesheet = Assets.get(id);
    return t.animations[name];
}

export function getJson(id: string) {
    let t = Assets.get(id);
    return t;
}