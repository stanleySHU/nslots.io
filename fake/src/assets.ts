import { KRrsourceOptions } from "common/util/assetsLoad";
import { mergePreloadAssetsConfig, mergeLoadingAssetsConfig } from 'common/assets';
import { Languages } from "common/model/context/baseContext";

export function getPreloadAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergePreloadAssetsConfig(lang, [])
}

export function getLoadingAssetsConfig(lang: Languages): KRrsourceOptions[] {
    return mergeLoadingAssetsConfig(lang, []);
}

