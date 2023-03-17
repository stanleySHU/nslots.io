
// import { KEY_ACTION_REDUCERS, KEY_ACTION_REDUCERS_INIT, KEY_ACTION_USER, KEY_ACTION_USER_INIT, KEY_ACTION_SETTING, KEY_ACTION_SETTING_INIT,
//     KEY_ACTION_SPIN, KEY_ACTION_SPIN_INIT  } from '../model/actionTypes'

import { KReducerActionOptions } from "../model/actionTypes";
import { Injector } from "../util/injector";
const injector = Injector.Obj;

// register reducer
type reducerActionType = 'user' | 'setting' | 'spin' | 'scene' | 'reducers' | 'table';
export function registerReducerAction(key: reducerActionType, value: (state: any, action: KReducerActionOptions) => any) {
    injector.map(`action_fc:${key}`).toValue(value);
}

export function getReducerAction(key: reducerActionType): (state: any, action: KReducerActionOptions) => any {
    return injector.get(`action_fc:${key}`)
}

export function registerReducerInitial(key: reducerActionType, value: any) {
    injector.map(`action_init:${key}`).toValue(value);
}

export function getReducerInitial<T = any>(key: reducerActionType): any{
    return injector.get(`action_init:${key}`)
}

//register net & parser
import { KHttpServiceOptions } from '../util/api'
const IHttpService = 'httpService';
export function registerHttpService(value) {
    return injector.map(IHttpService).toSingleton(value);
}

export function getHttpService(): KHttpServiceOptions {
    return injector.get(IHttpService);
}

type parserTypes = 'spin';
export function registerHttpParser(key: parserTypes, value) {
    return injector.map(`parser:${key}`).toValue(value);
}

export function getHttpParser(key: parserTypes) {
    return injector.get(`parser:${key}`);
}

//component
type symoblType = 'symbol' | 'symbolActive';
type componentTypes = 'viewport' | symoblType;
export function registerComponents(key: componentTypes, e: any) {
    injector.map(`components:${key}`).toValue(e);
}

export function getComponent(key: componentTypes): any {
    return injector.get(`components:${key}`);
} 

export function registerSymobl(type: symoblType, id: number, e) {
    registerComponents(`${type}:${id}` as any, e);
}

export function getSymbol(type: symoblType, id: number) {
    return getComponent(`${type}:${id}` as any);
}

export function registerSymoblByArr(type: symoblType, ...args) {
    args.map((item, i) => registerSymobl(type, i, item));
}