import { getReducerInitial } from "../other/register";
import { KReducerActionOptions } from "./actionTypes";
import { GameCommonReducerOptions, getUrlConfig, TableLinesOptions } from "./context";

export const game = (state: any = {}, action: KReducerActionOptions) => {
    return state;
}

export function getGameCommonInitialState(): GameCommonReducerOptions {
    return {
        game: {
            url: getUrlConfig(),
            table: getReducerInitial<TableLinesOptions>('table') || {}
        }
    }
}
