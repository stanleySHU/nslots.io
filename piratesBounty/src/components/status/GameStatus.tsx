import { cloneElement, useEffect, useMemo, useRef, useState } from "react"
import { IGameNextSpinStatus, IGameOverStatus, SpinModel } from 'common/util/parser/spin/piratesBounty';
import { useDelayFrameOnce, useGameContext } from "common/components/customhook";
import { GameStatusModel, KGameStatus, GameStatusComponent, KCurrentGameStatus, KGameStep } from "./type";
import { getApiService } from "common/other/register";
import { action_loaded } from "common/model/spin";
import { SlotContext } from "common/model/context";
import { I_Check_BGM } from "../widgets/sound";

export function GameStatus(props: GameStatusComponent) {
    const { children, dataSource } = props;
    const { state, dispatch } = useGameContext<SpinModel>();
    const { status, spinModel, betAmount } = state.spin;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{
        status: KGameStatus, 
        statusOrder: KGameStatus[],
        inFS: boolean,
        fsCount: number,
        gameStep: KGameStep,
        showGameStartTip: boolean,
        showGiveUpTip: boolean,
        onFogOut: () => void,
        spunRound: number,
    }>({
        status: 'idle', 
        statusOrder: [],
        inFS: false,
        fsCount: 0,
        gameStep: KGameStep.notStart,
        showGameStartTip: false,
        showGiveUpTip: false,
        onFogOut: () => {},
        spunRound: 0
    });

    const isInShipBattle = current.gameStep == KGameStep.inShipBattle;
    const isShowCannon = current.status == KCurrentGameStatus.showCannon;
    const isLoseInShip = current.status == KCurrentGameStatus.loseInShip;
    const isLoseInBoss = current.status == KCurrentGameStatus.loseInBossBattle;
    const isFogOut = current.status == KCurrentGameStatus.showFogOut;

    function nextStatus(newStatus: KGameStatus, update: boolean = true) {
        if (current.status != newStatus) {

            if (newStatus == KCurrentGameStatus.showGateOpen) {
                current.inFS = true;
            } else if (newStatus == KCurrentGameStatus.showGateClose) {
                current.inFS = false;
            } else if (newStatus == KCurrentGameStatus.showBossIn) {
                current.gameStep = KGameStep.InBossBattle;
            } else if (newStatus == KCurrentGameStatus.win) {
                current.gameStep = KGameStep.bossDestroyed;
            }

            current.status = newStatus;
            update && setForceUpdate(!forceUpdate);
        }
    }

    function nextGameStatus() {
        const t = current.statusOrder.shift();        
        t && nextStatus(t, true);
    }

    function onForceUpdateAll() {
        setForceUpdate(!forceUpdate);
    }

    function onGoToNotStart() {
        current.gameStep = KGameStep.notStart;
        current.inFS = false;
        current.fsCount = 0;
        current.spunRound = 0;
    }

    function onGoToShipBattle() {
        current.gameStep = KGameStep.inShipBattle;
    }

    function onRequestStart(cont = false) {
        const api = getApiService();

        current.onFogOut = onGoToShipBattle;
        current.statusOrder = [KCurrentGameStatus.showFogIn];        
        nextGameStatus();

        const hand = cont ? api.continue : api.start;
        hand.call(api, betAmount.toNumber()).then((model) => {
            if (!model.code) {
                current.statusOrder = [KCurrentGameStatus.showFogOut, 'idle'];
                dispatch(action_loaded(model));
            }
        });
    }

    function onRequestGiveUp() {
        current.onFogOut = onGoToNotStart;
        current.statusOrder = [KCurrentGameStatus.showFogIn, KCurrentGameStatus.showFogOut, 'idle'];        
        nextGameStatus();
    }

    function onGameStart(e: boolean) {
        if (e) {
            if (current.showGameStartTip) {
                current.showGameStartTip = false;
                onRequestStart();
            } else {
                current.showGameStartTip = true;
            }
        } else {
            current.showGameStartTip = false;
        }
        setForceUpdate(!forceUpdate);
    }

    function onGameGiveUp(e: boolean) {
        if (e) {
            if (current.showGiveUpTip || isLoseInShip || isLoseInBoss) {
                current.showGiveUpTip = false;
                onRequestGiveUp();
            } else {
                current.showGiveUpTip = true;
            }
        } else {
            current.showGiveUpTip = false;
        }
        setForceUpdate(!forceUpdate);
    }

    function onGoToInit() {
        current.onFogOut = onGoToNotStart;
        current.statusOrder = [KCurrentGameStatus.showFogIn, KCurrentGameStatus.showFogOut, 'idle']; 
        nextGameStatus();
    }

    function onContinue() {
        onRequestStart(true);
    }

    useMemo(() => {
        current.statusOrder = [];
        let _currentStatus: KGameStatus;
        if (status == 'spin') {
            _currentStatus = status;
            if (!current.inFS && state.spin.spinModel?.isExistRespin == false) {
                current.spunRound++;
            }
        } else if (status == 'stopping') {
            _currentStatus = status
            current.fsCount = spinModel!.fs;
        } else if (status == 'idle') {
            if (current.status == 'stopping') {
                const isExistScatter = spinModel!.isExistNormalScatter || spinModel!.isExistSuperScatter;
                const isExistRespin = spinModel!.isExistRespin;
                const isExistCannon = spinModel!.isExistCannon;
                if (isExistScatter && isExistRespin) {
                    if (!current.inFS) {
                        current.statusOrder.push(KCurrentGameStatus.showGetScatter);
                    } else {
                        current.statusOrder.push(KCurrentGameStatus.showGetFreeSpin);
                    }
                }
                if (state.spin.spinModel!.playerHit > 0) {
                    current.statusOrder.push(KCurrentGameStatus.bossHit);
                }
                if (isExistRespin) {
                    current.statusOrder.push(KCurrentGameStatus.showActiveGear);
                }
                if (isExistCannon) {
                    current.statusOrder.push(KCurrentGameStatus.showCannon);
                }
                if (spinModel!.payout.gt(0)) {
                    current.statusOrder.push(KCurrentGameStatus.showWinAmount);
                }
                if (!isExistRespin && !current.inFS && spinModel!.fs > 0) {
                    current.statusOrder.push(KCurrentGameStatus.showGetFreeSpin);
                    current.statusOrder.push(KCurrentGameStatus.showGateOpen);
                }
                if (current.inFS && ((!isExistRespin &&spinModel!.fs == 0) || spinModel!.status == IGameOverStatus.GameOverWinBossBattle || spinModel!.status == IGameOverStatus.GameOverLoseBossBattle)) {
                    current.statusOrder.push(KCurrentGameStatus.showFreeSpinWinAmount);
                    current.statusOrder.push(KCurrentGameStatus.showGateClose);
                }
                if (current.gameStep == KGameStep.inShipBattle && spinModel!.isNoMoreShip) {
                    current.statusOrder.push(KCurrentGameStatus.showShipBattleOut);
                    current.statusOrder.push(KCurrentGameStatus.showBossIn);
                }
                const status = spinModel!.status;
                if (status == IGameOverStatus.GameOverWinBossBattle) {
                    current.statusOrder.push(KCurrentGameStatus.bossDestory);
                    current.statusOrder.push(KCurrentGameStatus.win);
                } else if (status == IGameOverStatus.GameOverLoseShipBattle) {
                    current.statusOrder.push(KCurrentGameStatus.loseInShip);
                } else if (status == IGameOverStatus.GameOverLoseBossBattle) {
                    current.statusOrder.push(KCurrentGameStatus.loseInBossBattle);
                }

                current.statusOrder.push('idle');
                _currentStatus = current.statusOrder.shift()!;
            } else {
                _currentStatus = 'idle';
            }
        }
        nextStatus(_currentStatus!, false);
    }, [status]);
    
    useMemo(() => {
        if (spinModel) {
            current.spunRound = spinModel.r;
            if (spinModel.ng == IGameNextSpinStatus.fSpin || spinModel.ng == IGameNextSpinStatus.frSpin) {
                current.inFS = true;
                current.fsCount = spinModel.fs;
            }
            if (spinModel.isNoMoreShip) {
                current.gameStep = KGameStep.InBossBattle;
            } else {
                current.gameStep = KGameStep.inShipBattle;
            }
            const status = spinModel.status;
            if (status == IGameOverStatus.GameOverLoseShipBattle) {
                current.status = KCurrentGameStatus.loseInShip;
            } else if (status == IGameOverStatus.GameOverLoseBossBattle) {
                current.status = KCurrentGameStatus.loseInBossBattle;
            } else if (status == IGameOverStatus.GameOverWinBossBattle) {
                current.statusOrder.push(KCurrentGameStatus.bossDestory);
                current.status = KCurrentGameStatus.bossDestory;
                current.statusOrder = [KCurrentGameStatus.win];
            }
        }
    }, []);

    useEffect(() => {
        SlotContext.Obj.notice.emit(I_Check_BGM, current.status, current.gameStep, current.inFS);
    }, [current.gameStep, current.status, current.inFS]);

    useMemo(() => {
        if (isInShipBattle) {
            current.spunRound = spinModel!.r;
        }
    }, [isFogOut]);

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 2500, current.status == KCurrentGameStatus.showGetScatter);

    const showCannonnextStarusDelay = useMemo(() => {
        if (isInShipBattle && spinModel && spinModel.isNoMoreShip) {
            return 3000;
        } else {
            return 2000;
        }
    }, [isShowCannon])
    useDelayFrameOnce(() => {
        nextGameStatus();
    }, showCannonnextStarusDelay, isShowCannon)

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 1500, current.status == KCurrentGameStatus.showWinAmount);

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 4000, current.status == KCurrentGameStatus.showFreeSpinWinAmount);

    const _dataSource: GameStatusModel = {
        ...dataSource,
        base: {
            state: state,
            dispatch: dispatch,
            nextGameStatus: nextGameStatus,
            gameStatus: current.status,
            gameStep: current.gameStep,
            spunRound: current.spunRound
        },
        actions: {
            onGameStart: onGameStart,
            onForceUpdateAll: onForceUpdateAll,
            onGameGiveUp: onGameGiveUp,
            onFogOut: current.onFogOut,
            onGoToInit: onGoToInit,
            onContinue: onContinue
        },
        tips: {
            showGameStartTip: current.showGameStartTip,
            showGiveUpTip: current.showGiveUpTip
        },
        fs: {
            fsCount: current.fsCount,
            inFS: current.inFS
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}
