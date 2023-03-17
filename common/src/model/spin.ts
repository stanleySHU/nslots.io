import { ACTION_SHOW_WINLINE, ACTION_SPIN, ACTION_SPIN_STOP, ACTION_SPIN_STOPPING, KReducerActionOptions } from "./actionTypes";

export type KSpinStatus = 'spin' | 'stopping' | 'showWinLine' | 'idle' | 'toBonus';

export interface KSpinReducerOptions<T> {
    spin: {
        status: KSpinStatus;  //idle -> 点击spin后 spin -> 接收到消息后 stopping -> spin动画自然结束或强制结束 stop -> win lin -> idle
        responseModel?: T  //spin result
    }
}

export const spin = (state: any = {}, action: KReducerActionOptions) => {
    switch (action.type) {
        case ACTION_SPIN: 
            return {
                ...state,
                status: 'spin'
            }
        case ACTION_SPIN_STOPPING: 
            return {
                ...state,
                status: 'stopping',
                responseModel: action.value
            }
        case ACTION_SHOW_WINLINE: 
            return {
                ...state,
                status: 'showWinLine'
            }
        case ACTION_SPIN_STOP: 
            return {
                ...state,
                status: 'idle'
            }
        default: 
            return state;
    }
}

export const spinInitialState: KSpinReducerOptions<any> = {
    spin: {
        status: 'idle' 
    }
}