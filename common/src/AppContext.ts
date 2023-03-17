import { createContext } from "react";
import { KReducerActionOptions } from "./model/actionTypes";

import { GameCommonReducerOptions } from './model/context';
import { KReducerSceneManagerOptions } from './model/sceneManager';
import { KSettingReducerOptions } from './model/setting';
import { KSpinReducerOptions } from './model/spin';
import { KUserReducerOptions } from './model/user';

import { BaseSpinModel } from './util/parser/spin/type'

interface AppStateOptions extends GameCommonReducerOptions, KReducerSceneManagerOptions, KSettingReducerOptions, KSpinReducerOptions<BaseSpinModel>, KUserReducerOptions {

}

export interface GameContextOptions {
    state: AppStateOptions,
    dispatch: (e: KReducerActionOptions) => any
}
export const GameContext = createContext<GameContextOptions>({} as any);