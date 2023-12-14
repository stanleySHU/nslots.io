import { Slide, SlideTips } from "common/components/slide";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Children, ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { Label } from "common/components/text";
import { Layer } from "common/components/layer";
import { DZero, toCommaAndFixed } from "common/util/amount";
import * as Arr from "common/util/array";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { BitmapText } from "@pixi/react";
import { BitmapText as PIXIBitmapText, Sprite as PIXISprite } from "pixi.js";
import { R_Gold_Font, R_Yellow_Font } from "@/assets";
import { Spine_Number } from "./base";
import { useDelayFrameOnce, useMenoConstant } from "common/components/customhook";

{/* <Label l-x={980} l-y={780} p-x={580} p-y={960} anchor={0.5} text={`Hold For Autospin`} style={{fill: '#FFFFFF'}}/> */ }

export function TipsForSpinAndBet({ dataSource, ...layerProps }: { dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const text = useRef<PIXIBitmapText>(null);
    const wild2 = useRef<PIXISprite>(null);
    const { gameStatus, state } = dataSource.base!;
    const { line, nextLine } = dataSource.lineWin!;
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine;

    const bet = state.spin.spinModel?.credit || DZero;
    const win = bet.mul(line ? line.multiplier : 0).toNumber();

    return (
        <Layer {...layerProps}>
            <SlideTips selected={0} duration={3000} visible={gameStatus == 'idle' && !isAutoSpin}>
                <SpriteAtlasLang anchor={0.5} name="Hold for autospin.png"></SpriteAtlasLang>
                <SpriteAtlasLang anchor={0.5} name="Place your bets.png"></SpriteAtlasLang>
            </SlideTips>
            <SpriteAtlasLang anchor={0.5} name="Good luck.png" visible={gameStatus == 'spin' || gameStatus == 'stopping'}></SpriteAtlasLang>
            <Layer visible={isShowWinLine}>
                <BitmapText ref={text} x={0} y={30} anchor={[0.5, 0.5]} text={`Win${toCommaAndFixed(win)}`} style={{fontName: R_Yellow_Font, fontSize: 70, letterSpacing: 0}}/>
            </Layer>
        </Layer>
    )
}



const SCATTER_MUL_ROW = [0, 102.5, 205]
const SCATTER_MUL_COLUMN = [0, 103, 210, 315, 420];
type ScatterWin = [number, number, number, boolean];
export function ScatterMul({dataSource}: {dataSource: GameStatusModel}) {
    const { gameStatus, state, nextGameStatus } = dataSource.base!;
    const { line, nextLine } = dataSource.lineWin!;
    const isShowScatter = gameStatus == KCurrentGameStatus.showScatter;
    const isShowWinLine = gameStatus == KCurrentGameStatus.showWinLine

    const { current } = useRef<{columnRowMultipLast: ScatterWin[]}>({columnRowMultipLast: []});

    useMemo<ScatterWin[]>(() => {
        if (isShowScatter) {
            const arr: ScatterWin[] = [];
            // if (KCurrentGameStatus.showScatter) {
                const scatterLinewins = state.spin.spinModel!.scatterLinewins;
                for (let item of scatterLinewins) {
                    const columnRowSymbolArr = item.columnRowSymbolArr;
                    if (item.director == 'l2r') {
                        for (let i = 1; i < columnRowSymbolArr.length; i++) {
                            const item = columnRowSymbolArr[i];
                            arr.push([item[0], item[1], [1, 5, 10, 100][i-1], i == columnRowSymbolArr.length - 1]);
                        }
                    } else {
                        for (let i = 1; i < columnRowSymbolArr.length; i++) {
                            const item = columnRowSymbolArr[i];
                            arr.push([item[0], item[1], [1, 5, 10, 100][i-1], i == columnRowSymbolArr.length - 1]);
                        }
                    }
                }
            // }
            current.columnRowMultipLast = arr;
        } else if (gameStatus == 'idle' || gameStatus == 'spin') {
            current.columnRowMultipLast = [];
        }
    }, [gameStatus]);

    useDelayFrameOnce(() => {
        nextGameStatus('idle');
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

export function SpineNumber2({item, delay, ...props}: {item: ScatterWin, delay: number} & ComponentProps<typeof Spine_Number>) {
    const [ playing, setPlaying ] = useState(false);

    const action: any = useMemo(() => {
        return  [0, 'MultiplierWin', false]
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

{/* <Sound sound={isScatterStop ? 'scatter_stop' : 'reelstop'} playing={stop && playing} volum={0.7}></Sound> */}