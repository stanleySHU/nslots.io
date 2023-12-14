import { useContext, useEffect } from "react";
import { GameContext } from "common/AppContext";
import { action_doAutoSpin } from "common/model/spin";
import { I_NO_LIMIT_SYMBOL } from "common/util/constant";
import { GameStatusModel } from "../status/type";

export function AutoSpinAction({dataSource}: {dataSource: GameStatusModel}) {
    const { gameStatus, state, dispatch } = dataSource.base!;

    useEffect(() => {
        if (gameStatus == 'idle' && state.spin.status == 'idle') {
            if (state.spin.autoSpinCount == I_NO_LIMIT_SYMBOL || state.spin.autoSpinCount > 0) {
                dispatch(action_doAutoSpin());
            }
        }
    }, [gameStatus, state.spin.autoSpinCount]);

    return <></>
}