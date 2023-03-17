import { combineReducers } from '@reduxjs/toolkit';

import { merge } from '../util/lang';

import { game, getGameCommonInitialState } from './game';
import { user as _user, userInitialState } from './user';
import { setting as _setting, settingInitialState } from './setting';
import { spin as _spin, spinInitialState } from './spin';
import { sceneManager as _sceneManager, sceneManagerInitialState } from './sceneManager';
import { getReducerAction, getReducerInitial } from '../other/register';


export function getCombineReducers() {
    let user = getReducerAction('user') || _user;
    let setting = getReducerAction('setting') || _setting;
    let spin = getReducerAction('spin')|| _spin;
    let sceneManager = getReducerAction('scene') || _sceneManager;
    let r: {[key: string]: any} = getReducerAction('reducers');
    return combineReducers({game, user, setting, spin, sceneManager, ...r});
}

export function getInitState() {
    let r_user = getReducerInitial('user') || userInitialState;
    let r_setting = getReducerInitial('setting') || settingInitialState;
    let r_spin = getReducerInitial('spin') || spinInitialState;
    let r_scene = getReducerInitial('scene')  || sceneManagerInitialState;
    let r = getReducerInitial('reducers') || {};
    return merge(r_user, r_setting, r_spin, r_scene, getGameCommonInitialState(), r);
}