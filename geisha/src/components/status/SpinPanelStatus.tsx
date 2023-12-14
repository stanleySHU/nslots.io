import { cloneElement, useContext } from "react";
import { useMemo } from "react";
import { KSpinPanelOptons } from 'common/components/spinPanel/type_2';
import { GameStatusModel } from "./type";

export function SpinPanelStatus({ dataSource, children }: { dataSource: GameStatusModel, children: any }) {
    const { gameStatus } = dataSource.base!;

    const [autoBtnEnable, spinBtnEnable, betBtnEnable] = useMemo(() => {
        return [true, true, true];
    }, []);

    return cloneElement(children, {
        themeColor: 0xf2cf75,
        spinEnable: spinBtnEnable,
        betBtnEnable: betBtnEnable,
        autoBtnEnable: autoBtnEnable,
        spinBtnEnable: spinBtnEnable,
        spinBtnStatus:  gameStatus == 'idle' ? 'idle' : gameStatus == 'spin' ? 'spin' : gameStatus == 'stopping' ? 'stopping' : 'skip',
        toBonus: false
    } as KSpinPanelOptons);
}