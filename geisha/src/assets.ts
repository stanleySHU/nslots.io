import { KRrsourceOptions } from "common/util/assetsLoad";
import { mergePreloadAssetsConfig, mergeLoadingAssetsConfig, R_Game_Bg_L, R_Symbol, R_PreloadComponent } from 'common/assets';
import { Languages } from "common/model/context/baseContext";

export const R_Preview_Bg_L = 'preview_Bg_L'

export function getPreloadAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergePreloadAssetsConfig(lang, [
        {
            id: R_Preview_Bg_L,
            src: 'compress/bg-preview-l@2x.[avif,webp,jpg]'
        }, {
            id: R_PreloadComponent,
            src: 'compress/preload@1x.[avif,webp,png].json',
            
        }
    ])
}

export const R_Spine_Number = 'UI_Numbers';
export const R_Spine_All = 'spine_all';
export const R_Spine_spin = 'spine_spin';
export const R_Symbol_Active = 'symbol_active'
export const R_Gold_Font = 'goldFont@1x';
export const R_Yellow_Font = 'yellowFont@1x';

export function getLoadingAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergeLoadingAssetsConfig(lang, [
        {
            id: R_Gold_Font,
            src: 'font/goldFont@1x.xml'
        }, {
            id: R_Yellow_Font,
            src: 'font/yellowFont@1x.xml'
        }, {
            id: R_Game_Bg_L,
            src: 'compress/bg-game-l@2x.[avif,webp,png]'
        }, {
            id: R_Spine_All,
            src: 'compress/atlas/@1x/all@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Number,
            src: 'compress/atlas/UI_Numbers@1x.json'
        }, {
            id: R_Spine_spin,
            src: 'compress/atlas/SpinButton@1x.[avif,webp,png].json'
        }
    ]);
}

