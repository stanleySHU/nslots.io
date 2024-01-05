import { AppStateOptions } from "common/AppContext"
import { KReducerActionOptions } from "common/model/actionTypes"
import { KSpinStatus } from "common/model/spin";
import { SpinModel } from "common/util/parser/spin/queenBee"
import { KLineWinOptions } from "common/util/parser/spin/queenBee";


export enum KCurrentGameStatus {
    showScatter = 'showScatter',
    show5oak = 'show5oak',
    showWinAmount = 'showWinAmount',
    showWinAmount2 = 'showWinAmount2',
    showBigWinAmount = 'showBigWinAmount',
    showWinLine = 'showWinLine'
}
export type KGameStatus = KSpinStatus | KCurrentGameStatus;

export interface GameStatusModel {
    base?: {
        state: AppStateOptions<SpinModel>,
        dispatch: (e: KReducerActionOptions) => any,
        nextGameStatus: () => void,
        gameStatus: KGameStatus,
        response?: SpinModel,
    },
    lineWin?: {
        line: KLineWinOptions,
        nextLine: () => void
    }
}
