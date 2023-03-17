import * as QueryString from '../util/querystring';
import { isMobile } from 'pixi.js'
import { getReducerInitial } from '../other/register';

export interface TableLinesOptions {
    readonly row: number,
    readonly column: number,
    readonly payLineMap: {readonly [key: string]: number[]};
    readonly winLinePathMap: {readonly [key: string]: [number, number][]}
    readonly bonusSymbols?: number[]
    readonly symbolSize: [number, number];
    readonly symbolFrame: [number, number]
}

export interface URLConfigOption {
    operator: string,
    funPLay: boolean,
    showLog: boolean,
    token: string | undefined,
    lang: Languages,
    platform: KPlatformType
}

export interface GameCommonReducerOptions {
    game: {
        url: URLConfigOption,    
        table: TableLinesOptions
    }
}

export type KPlatformType = 'web' | 'mobile' | 'mini' | 'desktop';

export enum Languages {
    English = "en",
    Chinese = "cs",
    Vietnamese = "vn",
    Thai = "th",
    Khmer = "kh", // Cambodia
    Indonesian = "id",
    Korean = "kr",
    Japanese = "jp"
}

export function configureLanguage(): Languages {
    let lang: Languages = QueryString.getParameter('lang', Languages.English) as Languages;
    switch (true) {
      case (lang.indexOf("us") >= 0):
      case (lang.indexOf("en") >= 0): lang = Languages.English; break;
      case (lang.indexOf("cn") >= 0):
      case (lang.indexOf("zh") >= 0):
      case (lang.indexOf("zn") >= 0):
      case (lang.indexOf("cs") >= 0): lang = Languages.Chinese; break;
      case (lang.indexOf("th") >= 0): lang = Languages.Thai; break;
      case (lang.indexOf("vi") >= 0):
      case (lang.indexOf("vn") >= 0): lang = Languages.Vietnamese; break;
      case (lang.indexOf("ko") >= 0):
      case (lang.indexOf("kr") >= 0): lang = Languages.Korean; break;
      case (lang.indexOf("km") >= 0):
      case (lang.indexOf("kh") >= 0): lang = Languages.Khmer; break;
      case (lang.indexOf("id") >= 0): lang = Languages.Indonesian; break;
      case (lang.indexOf("ja") >= 0):
      case (lang.indexOf("jp") >= 0): lang = Languages.Japanese; break;
      default: lang = Languages.English;
    }
    return lang;
}

export function getUrlConfig(): URLConfigOption {
    return {
        operator: QueryString.getParameter('op', '1'),
        funPLay: QueryString.getParameter('fun', '1') == '1',
        showLog: QueryString.getParameter('log', '0') == '1',
        token: QueryString.getParameter('token') || QueryString.getParameter('s'),
        lang: configureLanguage(),
        platform: (QueryString.getParameter('p') || (isMobile.any ? 'mobile' : 'web')) as KPlatformType
    };
}

export function getWinlinePathMap(map: {readonly [key: string]: number[]}): {readonly [key: string]: [number, number][]} {
    let res = {};
    for (let id in map) {
        let symbolIndexs = map[id], length = symbolIndexs.length, path = [];
        for (let i = 0; i < length; i++) {
            let index = symbolIndexs[i];
            path.push([i + 0.5, index + 0.5]);
        }
        let firstIndex = symbolIndexs[0];
        path.unshift([0, firstIndex + 0.5]);
        let lastIndex = symbolIndexs[length - 1];
        path.push([length, lastIndex + 0.5]);
        res[id] = path;
    }   
    return res;
}