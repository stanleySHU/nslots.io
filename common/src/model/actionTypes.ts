export interface KReducerActionOptions {
    type: string,
    value?: any
}

//other 
// export const KEY_ACTION_REDUCERS = 'action:reducers';
// export const KEY_ACTION_REDUCERS_INIT = 'action:reducers_init';
//user
// export const KEY_ACTION_USER = 'action:user';
// export const KEY_ACTION_USER_INIT = 'action:user_init';
export const ACTION_SIGN_IN = 'action_sign_in'
export const ACTION_GET_BALANCE = "action_get_balance";
export const ACTION_BALANCE_CHANGED = "action_balance_change";
//setting
// export const KEY_ACTION_SETTING = 'action:setting';
// export const KEY_ACTION_SETTING_INIT = 'action:setting_init';
export const ACTION_SOUND_OPEN = 'action_sound_open';
export const ACTION_VOLUME_CHANGED = 'action_volume_changed'
export const ACTION_MENU_OPEN = 'action_menu_open';
export const ACTION_PAYTABLE_OPEN = 'action_paytable_open';
export const ACTION_BET_PANEL_OPEN = 'action_betpanel_open';
export const ACTION_AUTO_PANEL_OPEN = 'action_auto_panel_open';
//spin
// export const KEY_ACTION_SPIN = 'action:spin';
// export const KEY_ACTION_SPIN_INIT = 'action:spin_init';
export const ACTION_SPIN = 'action_spin';
export const ACTION_SPIN_STOPPING = 'action_spin_stopping';
export const ACTION_SPIN_STOP = 'action_spin_stop';
export const ACTION_SHOW_WINLINE = 'action_spin_show_win_line';
//scene
// export const KEY_ACTION_SCENE = 'action:scene';
// export const KEY_ACTION_SCENE_INIT = 'action:scene_init';

export const ACTION_SCENE_PUSH = 'action_scene_push';
export const ACTION_SCENE_POP = 'action_scene_pop';
export const ACTION_SCENE_REPLACE = 'action_scene_replace';
export const ACTION_SCENE_TO_ROOT = 'action_scene_to_root';