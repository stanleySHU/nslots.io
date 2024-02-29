import { cloneElement, useMemo, useState } from "react";
import { GameStatusModel, KCurrentGameStatus } from "./type";

export const WinLineStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {  
    const { gameStatus, state, nextGameStatus } = dataSource?.base!;
    const [ linewinIndex, setLinewinIndex ] = useState(0);
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;

    const [linewins, linewinLength] = useMemo(() => {
        if (isShowWinLine) {
            setLinewinIndex(0);
            return [state.spin.spinModel!.linewins.sort((a, b) => {
                if (a.existWild) {
                    return 1;
                } else if (b.existWild) {
                    return -1;
                }
                if (a.director == b.director) {
                    return a.id - b.id;
                } else if (a.director == 'l2r') {
                    return -1;
                } else {
                    return 1;
                }
            }), state.spin.spinModel!.linewins.length];
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