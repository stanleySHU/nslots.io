import { useEffect } from "react";
import { action_balanceChanged } from "common/model/user";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";

export function BalanceMonitor({dataSource}: {dataSource: GameStatusModel}) {
    const { state, dispatch, gameStatus } = dataSource.base!;
    const {balance} = state.user;
    const {betAmount, betLevel, status, spinModel} = state.spin;

    useEffect(() => {
        // if (gameStatus == 'spin') {
        //     const cost = betAmount.mul(betLevel);
        //     dispatch(action_balanceChanged(balance.sub(cost)));
        // } else 
        if (gameStatus == KCurrentGameStatus.showWinLine) {
            dispatch(action_balanceChanged(spinModel?.balance || balance))
        }
    }, [gameStatus]);

    return <></>;
}