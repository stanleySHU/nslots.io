import { useEffect } from "react";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { action_balanceChanged } from "common/model/user";

export function BalanceMonitor({dataSource}: {dataSource: GameStatusModel}) {
    const { state, dispatch, gameStatus } = dataSource.base!;
    const { inFS } = dataSource.fs!;
    const isSpin = gameStatus == 'spin';
    const {balance} = state.user;
    const {betAmount, spinModel} = state.spin;

    const isRespin = spinModel && spinModel.isExistRespin;
    useEffect(() => {
        if (isSpin && !isRespin && !inFS) {
            dispatch(action_balanceChanged(balance.sub(betAmount)));
        } else if (gameStatus == KCurrentGameStatus.showWinAmount) {
            dispatch(action_balanceChanged(state.spin.spinModel!.balance));
        } 
    }, [gameStatus]);

    return <></>;
}