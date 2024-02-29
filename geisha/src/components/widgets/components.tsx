import { SlideTips } from "common/components/slide";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "common/components/text";
import { Layer } from "common/components/layer";
import { toCommaAndFixed } from "common/util/amount";
import * as Arr from "common/util/array";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { Spine_Number } from "./base";
import { useDelayFrameOnce, useMemoConstant } from "common/components/customhook";
import { getLang } from "common/util/assetsLoad";
import { R_Message } from "common/assets";
import { I_NO_LIMIT_SYMBOL } from "common/util/constant";
import { action_doAutoSpin } from "common/model/spin";
import { action_balanceChanged } from "common/model/user";


export function TipsForSpinAndBet({ dataSource, ...layerProps }: { dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const text = useRef<any>(null);
    const sprite = useRef<any>(null);
    const { gameStatus, state } = dataSource.base!;
    const { currency } = state.user;
    const { line } = dataSource.lineWin!;
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;

    let win = 0, existWild = false;
    if (line) {
        existWild = line.existWild;
        if (line.scatterWin) {
            win = state.spin.spinModel!.cost.mul(line.multiplier).div(existWild ? 2 : 1).toNumber();
        } else {
            win = state.spin.spinModel!.credit.mul(line.multiplier).div(existWild ? 2 : 1).toNumber();
        }
    }

    useEffect(() => {
        if (text.current && sprite.current) {
            const { width } = text.current;
            const { width: width2 } = sprite.current;
            if (existWild) {
                text.current.x = -(width + width2) / 2;
                sprite.current.x = text.current.x + width + 10;
            } else {
                text.current.x = -width / 2;
            }
        }
    }, [line])

    const winText = useMemoConstant(getLang(R_Message, 'win'));

    return (
        <Layer {...layerProps}>
            <SlideTips selected={0} duration={3000} visible={gameStatus == 'idle' && !isAutoSpin}>
                <SpriteAtlasLang anchor={0.5} name="Hold for autospin.png"></SpriteAtlasLang>
                <SpriteAtlasLang anchor={0.5} name="Place your bets.png"></SpriteAtlasLang>
            </SlideTips>
            <SpriteAtlasLang anchor={0.5} name="Good luck.png" visible={gameStatus == 'spin' || gameStatus == 'stopping'}></SpriteAtlasLang>
            <Layer visible={isShowWinLine}>
                <Label ref={text} anchor={[0, 0.5]} text={`${winText} ${currency} ${toCommaAndFixed(win)}`} maxScaleLength={400} style={{
                    fill: '#fff109', fontFamily: 'Figtree', fontWeight: '500', fontSize: 35,
                    dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                }}></Label>
                <SpriteAtlas visible={existWild} y={-3} anchor={[0, 0.5]} ref={sprite} name={'WildMultiplier.png'}></SpriteAtlas>
            </Layer>
        </Layer>
    )
}



const SCATTER_MUL_ROW = [0, 102.5, 205]
const SCATTER_MUL_COLUMN = [0, 103, 210, 315, 420];
type ScatterWin = [number, number, number, boolean];
export function ScatterMul({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, state, nextGameStatus } = dataSource.base!;
    const { line } = dataSource.lineWin!;
    const isShowScatter = gameStatus == KCurrentGameStatus.showScatter;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine

    const { current } = useRef<{ columnRowMultipLast: ScatterWin[] }>({ columnRowMultipLast: [] });

    useMemo<ScatterWin[]>(() => {
        if (isShowScatter) {
            const arr: ScatterWin[] = [];
            const scatterLinewins = state.spin.spinModel!.scatterLinewins;
            for (let item of scatterLinewins) {
                const columnRowSymbolArr = item.columnRowSymbolArr;
                if (item.director == 'l2r') {
                    for (let i = 1; i < columnRowSymbolArr.length; i++) {
                        const item = columnRowSymbolArr[i];
                        arr.push([item[0], item[1], [1, 5, 10, 100][i - 1], i == columnRowSymbolArr.length - 1]);
                    }
                } else {
                    for (let i = 1; i < columnRowSymbolArr.length; i++) {
                        const item = columnRowSymbolArr[i];
                        arr.push([item[0], item[1], [1, 5, 10, 100][i - 1], i == columnRowSymbolArr.length - 1]);
                    }
                }
            }
            current.columnRowMultipLast = arr;
        } else if (gameStatus == 'idle' || gameStatus == 'spin') {
            current.columnRowMultipLast = [];
        }
    }, [gameStatus]);

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, current.columnRowMultipLast.length * 200 + 1500, isShowScatter)

    return (
        <Layer visible={gameStatus != 'idle' && gameStatus != 'spin' && gameStatus != 'stopping'}>
            {
                current.columnRowMultipLast.map((item, index) => {
                    let visible = true;
                    if (isShowWinLine) {
                        if (line!.type == 10) {
                            const columnRowSymbol = Arr.atLast(line!.columnRowSymbolArr);
                            visible = columnRowSymbol[0] == item[0] && columnRowSymbol[1] == item[1];
                        } else {
                            visible = false;
                        }
                    }
                    return <SpineNumber2 key={`sw_${index}`} visible={visible} item={item} delay={200 * index}></SpineNumber2>
                })
            }
        </Layer>
    )
}

export function SpineNumber2({ item, delay, ...props }: { item: ScatterWin, delay: number } & ComponentProps<typeof Spine_Number>) {
    const [playing, setPlaying] = useState(false);

    const action: any = useMemo(() => {
        return [0, 'MultiplierWin', false]
    }, []);

    useDelayFrameOnce(() => {
        setPlaying(true);
    }, delay, true);

    function onComplete(e: boolean) {
        setPlaying(e);
    }

    return <Layer>
        <Spine_Number x={SCATTER_MUL_COLUMN[item[0]]} y={SCATTER_MUL_ROW[item[1]]} playing={playing} visible={playing} action={action} skin={`x${item[2]}`} toFrameOneWhenStop={true} onComplete={onComplete.bind(null, item[3])} {...props}></Spine_Number>
    </Layer>
}

export function BalanceMonitor({dataSource}: {dataSource: GameStatusModel}) {
    const { state, dispatch, gameStatus } = dataSource.base!;
    const {balance} = state.user;
    const {spinModel} = state.spin;

    useEffect(() => {
        if (gameStatus == KCurrentGameStatus.showWinLine) {
            dispatch(action_balanceChanged(spinModel!.balance || balance))
        } else if (gameStatus == 'stopping' && spinModel!.payout.isZero() && !balance.eq(spinModel!.balance)) {
            dispatch(action_balanceChanged(spinModel!.balance))
        }
    }, [gameStatus]);

    return <></>;
}