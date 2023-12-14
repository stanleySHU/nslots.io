import { GameContext, GameContextOptions } from "common/AppContext"
import { cloneElement, useContext, useMemo, useRef, useState } from "react"
import { SpinModel } from 'common/util/parser/spin/queenBee';
import { GameStatusModel, KCurrentGameStatus, KGameStatus } from "./type";


export const GameStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch } = useContext(GameContext) as GameContextOptions<SpinModel>;
    const { status, spinModel } = state.spin;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{ status: KGameStatus }>({ status: 'idle' });

    function nextStatus(newStatus: KGameStatus, update: boolean = true) {
        if (current.status != newStatus) {
            if (current.status == KCurrentGameStatus.showScatter) {
                if (spinModel!.isExist5OfAKind) {
                    newStatus = KCurrentGameStatus.show5oak;
                } else if (spinModel!.isBigWin) {
                    newStatus = KCurrentGameStatus.showBigWinAmount;
                } else {
                    newStatus = KCurrentGameStatus.showWinAmount;
                }
            } else if (current.status == KCurrentGameStatus.show5oak) {
                if (spinModel!.isBigWin) {
                    newStatus = KCurrentGameStatus.showBigWinAmount;
                } else {
                    newStatus = KCurrentGameStatus.showWinAmount;
                }
            }
            current.status = newStatus;
            update && setForceUpdate(!forceUpdate);
        }
    }

    useMemo(() => {
        let _currentStatus: KGameStatus;
        if (status == 'spin' || status == 'stopping') {
            _currentStatus = status
        } else if (status == 'idle') {
            if (current.status == 'stopping') {
                if (spinModel!.scatterLinewins.length > 0) {
                    _currentStatus = KCurrentGameStatus.showScatter;
                } else if (spinModel!.linewins.length > 0) {
                    if (spinModel!.isExist5OfAKind) {
                        _currentStatus = KCurrentGameStatus.show5oak
                    } else if (spinModel!.isBigWin) {
                        _currentStatus = KCurrentGameStatus.showBigWinAmount;
                    } else {
                        _currentStatus = KCurrentGameStatus.showWinAmount;
                    }
                } else {
                    _currentStatus = status
                }
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
            nextGameStatus: nextStatus,
            response: spinModel,
            gameStatus: current.status
        },
        ...dataSource
    };

    return cloneElement(children, { dataSource: _dataSource });
}