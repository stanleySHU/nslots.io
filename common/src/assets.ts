import { mapWith } from './util/array';
import { KRrsourceOptions } from './util/assetsLoad';
export function getCommonResourceUrl(e: string): string {
    return new URL(`./`, import.meta.url).href + `/../../common/assets/${e}`;
}

export function getGameResourceUrl(e: string, basePath: string): string {
    return `./assets/${e}`
}

function merge(...args: KRrsourceOptions[][]): KRrsourceOptions[] {
    let map = {};
    for (let configs of args) {
        for (let config of configs) {
            map[config.id] = config;
        }
    }
    return Object.values(map);
}

export const R_Loading_Bg = 'Loading_Bg';
export const R_Message = 'message';
function getPreloadAssetsConfig(basePath: string): KRrsourceOptions[]  {
    return [
        {   id: R_Message,
            type: 'file',
            src: getGameResourceUrl('text/cs.json', basePath)
        }, {
            id: R_Loading_Bg,
            type: 'file',
            src: getGameResourceUrl('mobile/loadingcs.jpg', basePath)
        }
    ]
}

export function mergePreloadAssetsConfig(basePath, ...args: KRrsourceOptions[][]): KRrsourceOptions[] {
    return merge(getPreloadAssetsConfig(basePath), ...args);
}


export function getInfoPageId(i: number) { return `info_${i}` }
export const R_Game_Bg = 'game_Bg'
export const R_Font = 'font';
export const R_Symbol = 'symbol';
export const R_SpinPanel = 'spin_panel';
export const R_Sounds = 'sounds';
export const R_Icons = 'icons';
export function getLoadingAssetsConfig(basePath: string): KRrsourceOptions[]  {
    return [
        // {
        //     id: R_Font,
        //     src: getCommonResourceUrl('font/cs.xml')
        // }, 
        {
            id: R_Game_Bg,
            src: getGameResourceUrl('mobile/bg-game.jpg', basePath)
        }, {
            id: R_Symbol,
            src: getGameResourceUrl('mobile/symbols/symbol.json', basePath)
        }, {
            id:R_Sounds,
            src: getGameResourceUrl('sound/sounds.json', basePath)
        }, {
            id: R_Icons,
            src: getCommonResourceUrl('src/icons/type_1.json'),
        }
    ];
}

export function mergeLoadingAssetsConfig(basePath, ...args: KRrsourceOptions[][]): KRrsourceOptions[] {
    return merge(getLoadingAssetsConfig(basePath), ...args);
}

export function getActiveSymbolId(i: number): string {
    return `symbol_active_${i}`;
}
export function getActiveSymbol(count: number, type: 'png' | 'json', basePath: string): KRrsourceOptions[] {
    return mapWith(count, (i) => {
        return {
            id: getActiveSymbolId(i),
            src: getGameResourceUrl(`mobile/symbols/${i}.${type}`, basePath)
        }
    });
}

