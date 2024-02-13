import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { SpriteAtlas } from "common/components/sprite";
import { Rectangle } from "common/components/rectangle";
import { BitmapText } from "@pixi/react";
import { R_Font_Gold, R_Font_White } from "@/assets";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tween } from "common/components/tween";
import { Easing } from "@tweenjs/tween.js";
import { toCommaAndFixed } from "common/util/amount";
import { Sound } from "common/components/sound";
import { BitmapLabel } from "common/components/bitmapText";
import { useDelayFrameOnce, useMemoConstant } from "common/components/customhook";
import { Spine_Boat } from "./base";
import { Label } from "common/components/text";
import { isPresent } from "common/util/lang";
import { IGameOverStatus } from "common/util/parser/spin/piratesBounty";

export function WinAmount({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, gameStatus, gameStep } = dataSource.base!;
    const { inFS, fsWinAmount } = dataSource.fs!;
    const { destoryShips } = dataSource.fleet!;
    const [winAmountPanel, setWinAmountPanel] = useState<'ilde' | 'show' | 'hide'>('ilde');
    const { spinModel } = state.spin;
    const { current } = useRef<{ 
        winAmount: string, fsWinAmount: number, fsWinAmountFormat: string, fsDestoryeedShipCountMap: {[key: number]: number}
    }>({ 
        winAmount: '0', fsWinAmount: 0, fsWinAmountFormat: '0', fsDestoryeedShipCountMap: {}
    });
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount;
    const isShowFreeWinAmount = gameStatus == KCurrentGameStatus.showFreeSpinWinAmount;
    const { fsDestoryeedShipCountMap } = current;
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;

    useMemo(() => {
        if (inFS && isShowCannon) {
            destoryShips.forEach((ships) => {
                ships.forEach((ship) => {
                    const count = fsDestoryeedShipCountMap[ship];
                    if (isPresent(count)) {
                        fsDestoryeedShipCountMap[ship] = count + 1;
                    } else {
                        fsDestoryeedShipCountMap[ship] = 1;
                    }
                })
            })
        }
    }, [isShowCannon])

    useMemo(() => {
        if (inFS) {
            current.fsDestoryeedShipCountMap = {};
        }
    }, [inFS])

    useMemo(() => {
        if (isShowWinAmount || isShowFreeWinAmount) {
            setWinAmountPanel('show');
            let payout = spinModel!.payout.toNumber();
            if (spinModel!.status == IGameOverStatus.GameOverWinBossBattle) {
                payout = spinModel!.payout.sub(spinModel!.credit.mul(spinModel!.jackpot)).toNumber();
            }
            current.winAmount = toCommaAndFixed(payout);
            current.fsWinAmount += payout;
            current.fsWinAmountFormat = toCommaAndFixed(current.fsWinAmount);
        } else if (winAmountPanel == 'show') {
            setWinAmountPanel('hide');
        }
    }, [gameStatus]);

    const [shipPapperX, freeSpinDeathShipCount] = useMemo(() => {
        if (isShowFreeWinAmount) {
            let length = 0, count = 0;
            for (let key in fsDestoryeedShipCountMap) {
                length++;
                count += fsDestoryeedShipCountMap[key];
            }
            const xs = length == 4 ? [120, 220, 320, 420] : length == 3 ? [170, 270, 370] : length == 2 ? [220, 320] : [270];
            return [xs, count]
        }
        return [[], 0];
    }, [isShowFreeWinAmount])

    const isWinAmountPanelIdle = winAmountPanel == 'ilde';
    const isWinAmountPanelShow = winAmountPanel == 'show';

    const winAmountEasing = isWinAmountPanelShow ? Easing.Elastic.Out : Easing.Elastic.In;
    const winAmountDuration = isWinAmountPanelShow ? 1000 : 500;

    const showFreeWin = isShowFreeWinAmount && !isWinAmountPanelIdle;
    const showWin = isShowWinAmount && !isWinAmountPanelIdle;

    return (
        <Layer>
            {showFreeWin ? <Layer>
                <Rectangle frame={[0, 0, 540, 960]} alpha={0} color={0x000000} interactive={true}></Rectangle>
                <Rectangle frame={[0, 625, 540, 150]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
                <Layer x={0} y={480} visible={gameStep == KGameStep.inShipBattle}>
                    <Tween from={{ k: 0 }} to={{ k: 1 }} playing={true} duration={500} easing={Easing.Cubic.In}>
                        {
                            ({ k }) => {
                                return <Layer>
                                    {
                                        Object.keys(fsDestoryeedShipCountMap!).map((key, index) => {
                                            const _key = Number(key);
                                            const count = fsDestoryeedShipCountMap![_key];
                                            return (
                                                <Layer key={`boatPaper${index}`} x={shipPapperX[index] + 100 - 100 * k} alpha={k}>
                                                    <SpriteAtlas name={`freespin/totalwin_paper.png`} scale={0.5} anchor={0.5}></SpriteAtlas>
                                                    <Spine_Boat x={0} y={25} scale={0.25 - (_key - 1) * 0.03} visible={k} playing={false} action={useMemoConstant([0, `Lv${key}boat_mid`, false]) as any}></Spine_Boat>
                                                    <Label x={0} y={-38} anchor={0.5} text={`${count}`} style={{ align: 'center', fill: '#333333', fontWeight: 'bolder' }}></Label>
                                                </Layer>
                                            )
                                        })
                                    }
                                </Layer>
                            }
                        }
                    </Tween>
                </Layer>
                <Tween from={{ k: 0 }} to={{ k: 1 }} playing={showFreeWin} duration={winAmountDuration} easing={winAmountEasing} onComplete={() => { !isWinAmountPanelShow && setWinAmountPanel('ilde') }}>
                    {
                        ({ k }) => {
                            let kScale, kAlpha;
                            if (isWinAmountPanelShow) {
                                kScale = k;
                                kAlpha = 0.3 + 0.7 * k;
                            } else {
                                kScale = 1;
                                kAlpha = 1;
                            }

                            return (
                                <Layer y={450} alpha={kAlpha}>
                                    <SpriteAtlas scale={1} x={-170} y={0} name={`freespin/totalwin_banner.png`}></SpriteAtlas>
                                    <SpriteAtlas y={150} name={`freespin/totalwin_goldborder.png`}></SpriteAtlas>
                                    <SpriteAtlas y={150} name={`freespin/totalwin_goldborder.png`}></SpriteAtlas>
                                    <SpriteAtlas x={100} y={200} name={`freespin/totalwin_glow.png`}></SpriteAtlas>
                                    <SpriteAtlas x={110} y={160} name={`freespin/totalwin_flare.png`}></SpriteAtlas>
                                    <BitmapText x={270} y={300} anchor={0.5} text={current.fsWinAmountFormat} style={{ fontName: R_Font_Gold, fontSize: 100, letterSpacing: -5 }} />
                                </Layer>
                            )
                        }
                    }
                </Tween>
                <Tween from={{ k: 0 }} to={{ k: 1 }} playing={true} repeat={0} delay={500} duration={500} easing={Easing.Back.Out}>
                    {
                        ({ k }) => {
                            return <Layer x={450} y={600} alpha={k} scale={k} visible={gameStep == KGameStep.inShipBattle}>
                                <SpriteAtlas name={`freespin/totalwin_star.png`} scale={0.33} anchor={0.5}></SpriteAtlas>
                                <BitmapText x={-7} y={30} anchor={0.5} rotation={Math.PI * 0.09} text={`${freeSpinDeathShipCount}`} style={{ fontName: R_Font_White, fontSize: 100, letterSpacing: -5 }} />
                            </Layer>
                        }
                    }
                </Tween>
            </Layer> : <></>
            }
            <Tween dep={[winAmountPanel]} from={{ k: 0 }} to={{ k: 1 }} playing={showWin} duration={winAmountDuration} easing={winAmountEasing} onComplete={() => { !isWinAmountPanelShow && setWinAmountPanel('ilde') }}>
                {
                    ({ k }) => {
                        let kY, kScale, kAlpha;
                        if (isWinAmountPanelShow) {
                            kY = kScale = k;
                            kAlpha = 0.3 + 0.7 * k;
                        } else {
                            kScale = 1;
                            kY = kAlpha = 1 - k;
                        }

                        return (
                            <Layer x={272} y={735 - 30 * kY} scale={0.6 + kScale * 0.4} alpha={kAlpha} pivot={[92, 55]} visible={showWin}>
                                <SpriteAtlas name={`tips/totalwin_frame_small.png`}></SpriteAtlas>
                                <BitmapLabel x={95} y={65} anchor={[0.5, 0.22]} text={current.winAmount} maxScaleLength={160} style={{ align: 'justify', fontName: R_Font_White, fontSize: 90, letterSpacing: -4 }} />
                            </Layer>
                        )
                    }
                }
            </Tween>
        </Layer>
    )
}