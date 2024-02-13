import { KRrsourceOptions } from "common/util/assetsLoad";
import { mergePreloadAssetsConfig, mergeLoadingAssetsConfig, R_Symbol, R_Game_Bg_L, R_Uncomponents, R_PreloadComponent } from 'common/assets';
import { Languages } from "common/model/context/baseContext";

export const R_Spine_SeaBg = 'Sea_Bg';
export const R_Spine_TitleScreen = 'titlescreen';
export const R_Preview_Bg_L = 'preview_Bg_L'


export function getPreloadAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergePreloadAssetsConfig(lang, [
        {
            id: R_Spine_SeaBg,
            src: `compress/atlas/Ocean_Animation.json`
        }, {
            id: R_Preview_Bg_L,
            src: 'compress/bg-preview-l@1x.[avif,webp,jpg]'
        }, {
            id: R_Spine_TitleScreen,
            src: `compress/atlas/titlescreen@1x.[avif,webp,png].json`
        }, {
            id: R_PreloadComponent,
            src: 'compress/preload@1x.[avif,webp,png].json'
        }
    ])
}

export const R_Spine_Cannon = 'cannonsmain';
export const R_Spine_Grates = 'Grates';
export const R_Spine_Fog = 'Fog@1x';
export const R_Spine_BossShip = 'Boss Ship';
export const R_Spine_Boat = 'BOAT_EXPORTS';
export const R_Spine_Explosion = 'Explosion';
export const R_Spine_Victory_Screen = 'Victory Screen';
export const R_Spine_BOSSWARNING = 'BOSSWARNING';
export const R_Spine_HYPER = 'HYPER';
// export const R_Spine_Squid = 'Squid';
export const R_Spine_ShipCannon = 'Ship Cannon@';
export const R_Spine_ShieldFinal = 'Shield_final@1x';
export const R_Spine_Speech = 'Speech';
export const R_Spine_BossShipRear = 'Boss Ship Rear';
export const R_Spine_Banner1 = 'banner1';
export const R_Spine_Banner2 = 'banner2';
export const R_Spine_Banner3 = 'banner3';
export const R_Spine_Banner4 = 'banner4';
export const R_Spine_Banner5 = 'banner5';
export const R_Spine_BossFightText = 'bossfighttext';
export const R_Spine_PopUp = 'popUpTween';

export const R_Mascot = 'mascot';
export const R_Gear = 'gear';
export const R_Star = 'star';
export const R_Explosion = 'sheet_explosion';
export const R_FireIdle = 'fireIdle';
export const R_Splash = 'splash';
export const R_Coins = 'coins';
export const R_CannonFire = 'cannonFire';
export const R_Heal = 'hral';

export const R_Font_Gold = 'goldFont@1x';
export const R_Font_Rb = 'rbFont@1x';
export const R_Font_Red = 'redFont@1x';
export const R_Font_Silver = 'silverFont@1x';
export const R_Font_White = 'whiteFont@1x';
export const R_Font_Win = 'winFont@1x';

export function getLoadingAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergeLoadingAssetsConfig(lang, [
        {
            id: R_Uncomponents,
            src: `uncompress/components@1x.[avif,webp,png].json`
        }, {
            id: R_Mascot,
            src: `compress/mascot-_default@1x.[avif,webp,png].json`
        }, {
            id: R_Gear,
            src: `compress/gear-_default@1x.[webp,avif,png].json`
        }, {
            id: R_Star,
            src: `compress/star-_default@1x.[avif,webp,png].json`
        }, {
            id: R_Coins,
            src: `compress/coins@1x.[webp,avif,png].json`
        }, {
            id: R_Splash,
            src: `compress/splash@1x.[png,webp,avif].json`
        }, {
            id: R_Symbol,
            src: `compress/symbols/symbol@1x.[webp,avif,png].json`
        }, {
            id: R_Explosion,
            src: `compress/explosion@1x.[avif,webp,png].json`
        }, {
            id: R_FireIdle,
            src: `compress/fireIdle@1x.[webp,avif,png].json`
        }, {
            id: R_CannonFire,
            src: 'compress/cannonFire@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Cannon,
            src: `compress/atlas/cannons@1x.[avif,webp,png].json`
        }, {
            id: R_Spine_Grates,
            src: `compress/atlas/Grates@1x.[avif,webp,png].json`
        }, {
            id: R_Spine_Fog,
            src: `compress/atlas/Fog@1x.[webp,avif,png].json`
        }, {
            id: R_Spine_BossShip,
            src: `compress/atlas/BossShip@1x.[webp,avif,png].json`
        }, {
            id: R_Spine_Boat,
            src: `compress/atlas/frigates@1x.[webp,png,avif].json`
        }, {
            id: R_Spine_Explosion,
            src: 'compress/atlas/Explosion@1x.[avif,webp,png[].json',
        }, {
            id: R_Spine_Victory_Screen,
            src: 'compress/atlas/VictoryScreen_MapandKnife@1x.[avif,webp,png].json',
        }, {
            id: R_Spine_BOSSWARNING,
            src: 'compress/atlas/BOSSWARNING@1x.[avif,webp,png].json',
        }, {
            id: R_Spine_HYPER,
            src: 'compress/atlas/hyperbanner@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_ShipCannon,
            src: 'compress/atlas/ShipCannon@1x.[webp,avif,png].json'
        }, {
            id: R_Spine_ShieldFinal,
            src: 'compress/atlas/shields@1x.[webp,avif,png].json'
        }, {
            id: R_Spine_Speech,
            src: 'compress/atlas/Speechbubbles@1x.[webp,avif,png].json'
        }, {
            id: R_Spine_BossShipRear,
            src: 'compress/atlas/BOSSSHIPREAR@1x.[webp,avif,png].json'
        }, {
            id: R_Spine_Banner1,
            src: 'compress/atlas/banner1@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Banner2,
            src: 'compress/atlas/banner2@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Banner3,
            src: 'compress/atlas/Banner3@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Banner4,
            src: 'compress/atlas/Banner4@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_Banner5,
            src: 'compress/atlas/Banner5@1x.[avif,webp,png].json'
        }, {
            id: R_Spine_BossFightText,
            src: 'compress/atlas/BossFightText@1x.[webp,png,avif].json'
        }, {
            id: R_Spine_PopUp,
            src: 'compress/atlas/PopUp@1x.[avif,webp,png].json'
        }, {
            id: R_Heal,
            src: 'compress/heal@1x.json'
        }, {
            id: R_Font_Gold,
            src: `font/goldFont@1x.xml`
        }, {
            id: R_Font_Rb,
            src: `font/rbFont@1x.xml`
        }, {
            id: R_Font_Red,
            src: `font/redFont@1x.xml`
        }, {
            id: R_Font_Silver,
            src: `font/silverFont@1x.xml`
        }, {
            id: R_Font_White,
            src: `font/whiteFont@1x.xml`
        }, {
            id: R_Font_Win,
            src: `font/winFont@1x.xml`
        }
    ]);
}

