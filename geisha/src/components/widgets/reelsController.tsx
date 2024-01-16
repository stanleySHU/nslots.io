import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { mapWith } from "common/util/array";
import { action_spinStop } from "common/model/spin";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { MaskLayer } from "common/components/maskLayer";
import { Layer } from "common/components/layer";
import { ReelController } from "common/components/spinTween/default";
import { Sound } from "common/components/sound";
import { Rectangle } from "common/components/rectangle";
import { useDelayFrameOnce, useFrame, useMemoConstant } from "common/components/customhook";
import { Symbol, SymbolActive } from "./symbol";
import { isPresent } from "common/util/lang";
import { ScatterMul } from "./components";
import { WinlinePanel } from "./winlinePanel";

const I_SYMBOL_XS = [0, 105, 210, 315, 420];

export function ReelsController({ children, dataSource }: { dataSource: GameStatusModel, children: (e: any) => any }) {
    const { gameStatus, response, dispatch, state } = dataSource.base!;
    const { speedModel } = state.spin;
    const { current } = useRef<{ startSpinIndex: number, stopSpinIndex: number, stopedColumn: number[], stopping: boolean }>({ startSpinIndex: 0, stopSpinIndex: -1, stopedColumn: [], stopping: false });
    const [forceUpdate, setForceUpdate] = useState(false);
    const isStopping = gameStatus == 'stopping';
    const isPlaying = gameStatus == 'spin' || isStopping;
    const isFastSpin = speedModel == 'fast';

    const statusModel: any = useMemo(() => {
        return mapWith(5, (i) => {
            return {
                playing: isPlaying && i <= current.startSpinIndex && current.stopedColumn.indexOf(i) < 0,
                stop: isStopping && i <= current.stopSpinIndex,
                result: response ? response.columnSymbolsMap[i] : [],
                init: response ? response.columnSymbolsMap[i] : [],
                onEnd: (inColumn: number) => {
                    let index = current.stopedColumn.indexOf(inColumn);
                    if (index < 0) {
                        current.stopedColumn.push(inColumn);
                        if (current.stopedColumn.length == 5) {
                            dispatch(action_spinStop());
                        } else {
                            setForceUpdate(!forceUpdate);
                        }
                    }
                }
            }
        });
    }, [gameStatus, current.startSpinIndex, current.stopSpinIndex]);

    useFrame(50, () => {
        current.startSpinIndex++;
        setForceUpdate(!forceUpdate);
    }, isPlaying && current.startSpinIndex < 5)

    useFrame(400, () => {
        if (isFastSpin) {
            current.stopSpinIndex = 5;
        } else {
            current.stopSpinIndex++;
        }
        setForceUpdate(!forceUpdate);
    }, current.stopping && isStopping && current.stopSpinIndex < 5 && current.startSpinIndex == 5)

    useDelayFrameOnce(() => {
        current.stopping = true;
        setForceUpdate(!forceUpdate);
    }, isFastSpin ? 0 : 1000, isStopping && current.stopSpinIndex < 5 && current.startSpinIndex == 5 && !current.stopping);

    useEffect(() => {
        if (!isPlaying) {
            if (isFastSpin) {
                current.startSpinIndex = 5;
            } else {
                current.startSpinIndex = 0;
            }
            current.stopSpinIndex = -1;
            current.stopedColumn = [];
            current.stopping = false;
            setForceUpdate(!forceUpdate);
        }
    }, [isPlaying]);

    return children(statusModel)
}

export function Reel({ dataSource, ...layerProps }: { dataSource: GameStatusModel } & ComponentProps<typeof MaskLayer>) {
    const { gameStatus, state } = dataSource.base!;
    const { line } = dataSource.lineWin!;
    const { speedModel } = state.spin;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount || gameStatus == KCurrentGameStatus.showWinAmount2;
    const isFastSpin = speedModel == 'fast';
    const isSpin = gameStatus == 'spin';
    const isStopping = gameStatus == 'stopping';
    const isSpinAndStopping = isSpin || isStopping;

    function isActiveSymbol(inColumn: number, inRow: number) {
        if (isShowWinLine) {
            for (let item of line.columnRowSymbolArr!) {
                const [column, row, symbol] = item;
                if (column == inColumn && row == inRow - 1) {
                    return true;
                }
            }
        } else if (isShowWinAmount) {
            for (let _line of state.spin.spinModel!.linewins) {
                for (let item of _line.columnRowSymbolArr!) {
                    const [column, row, symbol] = item;
                    if (column == inColumn && row == inRow - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const _symbols = useMemoConstant(mapWith(12, i => i));
    const _symbols1 = useMemoConstant(mapWith(11, i => i));

    const [accTime, decTime, speed] = useMemo(() => {
        return isFastSpin ? [500, 500, 16] : [800, 500, 16];
    }, [isFastSpin]);

    return (
        <Layer {...layerProps}>
            <MaskLayer active={isSpinAndStopping || gameStatus == KCurrentGameStatus.showWinAmount || gameStatus == KCurrentGameStatus.showWinAmount2 || gameStatus == KCurrentGameStatus.showWinLine}>
                <Layer>
                    <ReelsController dataSource={dataSource}>
                        {
                            (models) => {
                                return I_SYMBOL_XS.map((x, inColumn) => {
                                    const model = models[inColumn];
                                    const { playing, stop } = model;
                                    const isScatterStop = model.result.indexOf(10) >= 0;
                                    const __symbols = (inColumn == 0 || inColumn == 4) ? _symbols1 : _symbols;
                                    return (
                                        <Layer key={`reel${inColumn}`} x={x}>
                                            {/* decEasing={Easing.Back.Out} */}
                                            <ReelController {...model} spinStatus={state.spin.status} inColumn={inColumn} startSpeed={-4} endSpeed={-4} speed={speed} accTime={accTime} decTime={decTime} cellCount={3} symbols={__symbols}>
                                                {
                                                    (models, inSpin, blur) => {
                                                        return models.map((model, inRow) => {
                                                            const { k, ...newModel } = model;
                                                            let active = isActiveSymbol(inColumn, inRow);
                                                            active = active && isShowWinLine;

                                                            return (
                                                                <Symbol key={`symbol_${inRow}`} inSpin={playing} inBlur={blur} active={active} y={105.5 * k - 0.5} {...newModel}></Symbol>
                                                            )
                                                        })
                                                    }
                                                }
                                            </ReelController>
                                            <Sound sound={isScatterStop ? 'scatter_stop' : ''} playing={stop && playing} volum={0.7}></Sound>
                                        </Layer>
                                    )
                                })
                            }
                        }
                    </ReelsController>
                </Layer>
                <Rectangle frame={[-50, -50, 520, 315]} color={0x000000} ></Rectangle>
            </MaskLayer>
            <Layer>
                <ShowWinLine dataSource={dataSource}></ShowWinLine>
                <ScatterMul dataSource={dataSource}></ScatterMul>
            </Layer>
        </Layer>
    )
}

// showWinLineEffect ? [-50, -100, 520, 415] : 

export function ShowWinLine({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, state } = dataSource.base!;
    const { line, nextLine } = dataSource.lineWin!;
    const { speedModel } = state.spin;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount || gameStatus == KCurrentGameStatus.showWinAmount2;
    const isFastSpin = speedModel == 'fast';

    function onSymbolActiveComplete(symbol: number) {
        isShowWinLine && symbol == line.type && nextLine();
    }

    const [lineIds, isScatter] = useMemo(() => {
        if (isShowWinAmount) {
            return state.spin.spinModel!.lineMultiplier.isZero() ? [null, false] : [state.spin.spinModel!.linewins.map((item) => isPresent(item.id) ? (item.id + (item.director == 'l2r' ? 0 : 9)) : null), false];
        } else {
            if (line) {
                return [line.id! + (line.director == 'l2r' ? 0 : 9), line.type == 10]
            } else {
                return [null, false];
            }
        }
    }, [line, isShowWinAmount])

    return <Layer>
        {
            line?.columnRowSymbolArr.map((item, index) => {
                const [inColumn, inRow, symbol] = item;
                return <SymbolActive key={`symbol_${index}`} x={I_SYMBOL_XS[inColumn]} y={105 * inRow} selected={symbol!} onComplete={onSymbolActiveComplete}></SymbolActive>
            })
        }
        <MaskLayer active={gameStatus == KCurrentGameStatus.showWinAmount || gameStatus == KCurrentGameStatus.showWinAmount2 || gameStatus == KCurrentGameStatus.showWinLine}>
            <Layer>
                <WinlinePanel isShowWinAmount={isShowWinAmount} lineId={lineIds} isScatter={isScatter} ></WinlinePanel>
            </Layer>
            <Rectangle frame={[-50, -50, 520, 315]} color={0x000000} ></Rectangle>
        </MaskLayer>
        <Sound dep={[line]} sound={`symbol_${line?.type}`} volum={1} playing={isPresent(line?.type)} softBgm={true}></Sound>
    </Layer>
}

