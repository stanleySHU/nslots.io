import { ACTION_SIGN_IN, ACTION_BALANCE_CHANGED, ACTION_GET_BALANCE, KReducerActionOptions } from "./actionTypes"

export interface KUserReducerOptions {
    user: {
        loggingIn: boolean,
        memberName: string,
        currency: string,
        isTestAccount: boolean,
        amount: number
    }
}

export const user = (state: any = {}, action: KReducerActionOptions) => {
    switch (action.type) {
        case ACTION_SIGN_IN:
            return {
                //update name, is test accounr, currency
            }
        case ACTION_GET_BALANCE:
            return {    //map currency and amount {'rmb': 100}
                ...state,
                amount: action.value.amount,
                currency: action.value.currency
            }
        case ACTION_BALANCE_CHANGED: 
            return {    //update amount by current currency
                ...state,
                amount: action.value.amount,
            }
        default:
            return state
    }
}

export const userInitialState: KUserReducerOptions = {
   user: {
    loggingIn: false,
    memberName: 'w88',
    currency: 'RMB',
    isTestAccount: true,
    amount: 0
   }
}