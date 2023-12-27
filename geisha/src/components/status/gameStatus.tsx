import { GameContext, GameContextOptions } from "common/AppContext"
import { cloneElement, useContext, useMemo, useRef, useState } from "react"
import { SpinModel } from 'common/util/parser/spin/queenBee';
import { GameStatusModel, KCurrentGameStatus, KGameStatus } from "./type";


export const GameStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch } = useContext(GameContext) as GameContextOptions<SpinModel>;
    const { status, spinModel } = state.spin;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{ status: KGameStatus, statusOrder: KGameStatus[]}>({ status: 'idle', statusOrder: [] });

    function nextStatus(newStatus: KGameStatus, update: boolean = true) {
        if (current.status != newStatus) {
            current.status = newStatus;
            update && setForceUpdate(!forceUpdate);
        }
    }

    function nextGameStatus() {
        const t = current.statusOrder.shift();
        t && nextStatus(t, true);
    }

    useMemo(() => {
        current.statusOrder = [];
        let _currentStatus: KGameStatus;
        if (status == 'spin' || status == 'stopping') {
            _currentStatus = status
        } else if (status == 'idle') {
            if (current.status == 'stopping') {
                if (spinModel!.scatterLinewins.length > 0) {
                    current.statusOrder.push(KCurrentGameStatus.showScatter);
                } 
                if (spinModel!.linewins.length > 0) {
                    if (spinModel!.isExist5OfAKind) {
                        current.statusOrder.push(KCurrentGameStatus.show5oak);
                    }  
                    if (spinModel!.isBigWin) {
                        current.statusOrder.push(KCurrentGameStatus.showBigWinAmount);
                    } 
                    current.statusOrder.push(KCurrentGameStatus.showWinAmount);
                    current.statusOrder.push(KCurrentGameStatus.showWinAmount2);
                    current.statusOrder.push(KCurrentGameStatus.showWinLine);
                }
                current.statusOrder.push('idle');
                _currentStatus = current.statusOrder.shift()!;
            } else {
                _currentStatus = 'idle';
            }
        }
        nextStatus(_currentStatus!, false);
    }, [status]);

    const _dataSource: GameStatusModel = {
        base: {
            state: state,
            dispatch: dispatch,
            nextGameStatus: nextGameStatus,
            response: spinModel,
            gameStatus: current.status
        },
        ...dataSource
    };

    return cloneElement(children, { dataSource: _dataSource });
}