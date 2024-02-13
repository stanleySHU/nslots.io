import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { SpriteAtlas } from "common/components/sprite";
import { Label } from "common/components/text";
import { Tween } from "common/components/tween";
import { AnimatedSheet_StarY } from "./base";
import { useMemo, useRef } from "react";

export function JackpotPanel({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, gameStatus, gameStep } = dataSource.base!;
    const { jpValue } = dataSource.jackpot!;
    const isShowShipBattleOut = gameStatus == KCurrentGameStatus.showShipBattleOut;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;

    return (
        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={600} delay={500} playing={isShowShipBattleOut} repeat={0}>
            {
                ({ k }) => {
                    return (
                        <Layer x={15 - k * 250} y={138} visible={isInShipBattle}>
                            <Layer x={70} y={-30}>
                                <Tween from={{ k: 0 }} to={{ k: 1 }} duration={10000} playing={isInShipBattle} repeat={Number.MAX_VALUE}>
                                    {
                                        ({ k }) => {
                                            const t = Math.PI * 2 * k;
                                            return (
                                                <Layer>
                                                    <SpriteAtlas rotation={t} scale={0.33} anchor={0.5} name={`freespin/freegame_flare.png`}></SpriteAtlas>
                                                </Layer>
                                            )
                                        }
                                    }
                                </Tween>
                                <AnimatedSheet_StarY isPlaying={true} scale={1} x={-27} y={-35}></AnimatedSheet_StarY>
                            </Layer>
                            <SpriteAtlas name={`jackpot/jackpot_frame2.png`}></SpriteAtlas>
                            <SpriteAtlas x={4} y={-13} name={`jackpot/jackpot_label.png`}></SpriteAtlas>
                            <IncreaseJpTween jpValue={jpValue}></IncreaseJpTween>
                            <Layer y={35} x={143}>
                                <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={isShowShipBattleOut} repeat={0}>
                                    {
                                        ({ k }) => {
                                            const rotation = Math.PI * k;
                                            return <SpriteAtlas rotation={rotation} anchor={[0.03, 0.5]} name={`jackpot/jackpot_pointer.png`}></SpriteAtlas>
                                        }
                                    }
                                </Tween>
                            </Layer>
                            <Layer x={98} y={35}>
                                <Tween dep={[jpValue]} from={{ k: 0 }} to={{ k: 1 }} duration={1000} playing={true} repeat={0}>
                                    {
                                        ({ k }) => {
                                            const t = Math.PI * 2 * k / 20;
                                            return <SpriteAtlas visible={k > 0 && k < 1} rotation={t} scale={0.3} alpha={0.33} tint={0x00FFFF} anchor={0.5} name={`freespin/freegame_flare.png`}></SpriteAtlas>
                                        }
                                    }
                                </Tween>
                            </Layer>
                        </Layer>
                    )
                }
            }
        </Tween>
    )
}

export function IncreaseJpTween({ jpValue }: { jpValue: number }) {
    const { current } = useRef<{ lastJpValue: number, increaseJP: number }>({ 
        lastJpValue: jpValue,
        increaseJP: 0
    });

    useMemo(() => {
        if (current.lastJpValue > 0 && jpValue > current.lastJpValue) {
            current.increaseJP = jpValue - current.lastJpValue;
        }
        current.lastJpValue = jpValue;
    }, [jpValue]);


    return (
        <Layer>
            <Layer y={-25}>
                <SpriteAtlas x={22} y={44} scale={0.1} name={`jackpot/jackpot_chest.png`}></SpriteAtlas>
                <Layer x={67} y={49}>
                    <SpriteAtlas scale={0.33} name={`jackpot/jackpot_numberframe.png`}></SpriteAtlas>
                    <Tween dep={[jpValue]} from={{ k: 0 }} to={{ k: 1 }} duration={600} playing={true} delay={0} repeat={0}>
                        {
                            ({ k }) => {
                                const scale = 0.5 + 0.5 * Math.sin(Math.PI * k);
                                let points = 0;  //jackpot;
                                if (current.increaseJP) {
                                    points = jpValue + ((Math.round(k) - 1) * current.increaseJP);
                                } else {
                                    points = jpValue;
                                }

                                return <Label x={31} y={11} scale={scale} anchor={0.5} text={`${points}`} style={{ fill: '#FFFFFF', fontSize: 36, fontWeight: '900', dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }} />
                            }
                        }
                    </Tween>
                </Layer>
                <SpriteAtlas x={53} y={52} scale={0.15} name={`jackpot/_X.png`}></SpriteAtlas>
            </Layer>
        </Layer>
    )
}