import { cloneElement, useMemo, useState } from "react";
import { GameStatusModel, KCurrentGameStatus } from "./type";

export const WinLineStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {  
    const { gameStatus, state, nextGameStatus } = dataSource?.base!;
    const [ linewinIndex, setLinewinIndex ] = useState(0);
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;

    const [linewins, linewinLength] = useMemo(() => {
        if (isShowWinLine) {
            setLinewinIndex(0);
            return [state.spin.spinModel!.linewins, state.spin.spinModel!.linewins.length];
        } else {
            return [[], 0];
        }
    }, [isShowWinLine]);

    function nextLine() {
        if (linewinIndex + 1 >= linewinLength) {
            nextGameStatus();
        } else {
            setLinewinIndex(linewinIndex + 1);
        }
    }

    const _dataSource: GameStatusModel = {
        lineWin: {
            line: linewins[linewinIndex%linewinLength],
            nextLine:  nextLine
        },
        ...dataSource
    }
    
    return cloneElement(children, { dataSource: _dataSource });
}