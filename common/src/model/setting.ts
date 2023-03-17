import { ACTION_AUTO_PANEL_OPEN, ACTION_BET_PANEL_OPEN, ACTION_MENU_OPEN, ACTION_PAYTABLE_OPEN, ACTION_SOUND_OPEN, ACTION_VOLUME_CHANGED, KReducerActionOptions } from './actionTypes';

export interface KSettingReducerOptions {
    setting: {
        soundOn: boolean,
        volume: number,
        menuOn: boolean,
        payTableOn: boolean,
        betPanelOn: boolean,
        autoSpinPanelOn: boolean
        // bgm: string
    }
}

export const setting = (state: any = {}, action: KReducerActionOptions) => {
    switch(action.type) {
        case ACTION_SOUND_OPEN: 
            return {
                ...state,
                soundOn: action.value
            }
        case ACTION_VOLUME_CHANGED:
            return {
                ...state
            }
        case ACTION_MENU_OPEN:
            return {
                ...state,
                menuOn: action.value
            }
        case ACTION_PAYTABLE_OPEN: 
            return {
                ...state,
                payTableOn: action.value
            }
        case ACTION_BET_PANEL_OPEN:
            return {
                ...state,
                betPanelOn: action.value
            }
        case ACTION_AUTO_PANEL_OPEN:
            return {
                ...state,
                autoSpinPanelOn: action.value
            }
        default:
            return state;
    }

}

export const settingInitialState: KSettingReducerOptions = {
    setting: {
        soundOn: true,
        volume: 0.5,
        menuOn: false,
        payTableOn: false,
        betPanelOn: false,
        autoSpinPanelOn: false
    }
}