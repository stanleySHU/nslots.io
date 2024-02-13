import { Layer } from "common/components/layer";
import { GameStatusModel, KGameStep } from "../status/type";
import { SpriteAtlas } from "common/components/sprite";
import { Label } from "common/components/text";
import { Tween } from "common/components/tween";
import { R_Uncomponents } from "common/assets";
import { MaskLayer } from "common/components/maskLayer";
import { Rectangle } from "common/components/rectangle";
import { useEffect, useMemo, useRef, useState } from "react";
import { BOSS_HP, JACKPOT, PLAYER_HP } from "./config";
import { Easing } from "@tweenjs/tween.js";
import { SlotContext } from "common/model/context";

export const I_Player_HP_Changed = 'I_Player_HP_Changed';
export const I_Boss_HP_Changed = 'I_Boss_HP_Changed';

export function Hp({ ...props }: { dataSource: GameStatusModel }) {
    const { dataSource } = props;
    const { state, gameStatus, nextGameStatus, gameStep } = dataSource.base!;
    const { spinModel } = state.spin;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{
        lastBossHP: number, lastPlayerHP: number, playerHP: number, bossHP: number
    }>({
        lastBossHP: BOSS_HP, lastPlayerHP: PLAYER_HP, playerHP: PLAYER_HP, bossHP: BOSS_HP
    });
    const { playerHP, bossHP } = current;
    const isInBossBattle = gameStep == KGameStep.InBossBattle;
    const isBossDestroyed = gameStep == KGameStep.bossDestroyed;

    const [currentBossHPX, lastBossHPX] = useMemo(() => {
        const _currentHP = bossHP, _lastHP = current.lastBossHP,
            _currentX = 210 * (_currentHP / BOSS_HP) - 210,
            _lastX = 210 * (_lastHP / BOSS_HP) - 210;
        current.lastBossHP = bossHP;
        return [_currentX, _lastX];
    }, [bossHP]);

    const [currentPlayerHPX, lastPlayerHPX] = useMemo(() => {
        const _currentHP = playerHP, _lastHP = current.lastPlayerHP,
            _currentX = 210 * (_currentHP / PLAYER_HP) - 210,
            _lastX = 210 * (_lastHP / PLAYER_HP) - 210;
        current.lastPlayerHP = playerHP;
        return [_currentX, _lastX];
    }, [playerHP]);

    useEffect(() => {
        if (isInBossBattle) {
            current.bossHP = spinModel!.bossHP;
            current.playerHP = spinModel!.playerHP;
        }

        const context = SlotContext.Obj;
        function setPlayerHP(e: number) {
            current.playerHP = e;
            setForceUpdate(!forceUpdate);
        }
        function setBossHP(e: number) {
            current.bossHP = e;
            setForceUpdate(!forceUpdate);
        }
        context.notice.on(I_Player_HP_Changed, setPlayerHP);
        context.notice.on(I_Boss_HP_Changed, setBossHP);
        return () => {
            context.notice.off(I_Player_HP_Changed, setPlayerHP);
            context.notice.off(I_Boss_HP_Changed, setBossHP);
        }
    }, []);

    // isBossDestroyed
    return (
        <Layer visible={isInBossBattle || isBossDestroyed}>
            <Layer>
                <Tween from={{ t: 1 }} to={{ t: 0 }} duration={1000} repeat={0} playing={isBossDestroyed} easing={Easing.Cubic.Out}>
                    {
                        ({ t }) => {
                            return (
                                <Tween from={{ k: 0 }} to={{ k: 1 }} duration={1000} repeat={0} playing={isInBossBattle || isBossDestroyed} easing={Easing.Cubic.Out}>
                                    {
                                        ({ k }) => {
                                            return (
                                                <Layer y={-240 + 200 * k * t}>
                                                    <Tween from={{ k: 0 }} to={{ k: 1 }} duration={2000} repeat={100000000} yoyo={true} playing={isInBossBattle}>
                                                        {
                                                            ({ k }) => {
                                                                return (
                                                                    <Layer>
                                                                        <Layer x={5} y={10 * k}>
                                                                            <SpriteAtlas x={40} y={30} scale={1} name={`hp/bosshpchains.png`}></SpriteAtlas>
                                                                            <SpriteAtlas x={9} y={135} scale={0.33} name={`hp/bosshp_back.png`}></SpriteAtlas>
                                                                            <Tween dep={[bossHP]} from={{ k: 0 }} to={{ k: 1 }} playing={true} duration={1000}>
                                                                                {
                                                                                    ({ k }) => {
                                                                                        const x = lastBossHPX - (lastBossHPX - currentBossHPX) * k;
                                                                                        return (
                                                                                            <MaskLayer x={13} y={136}>
                                                                                                <Layer>
                                                                                                    <SpriteAtlas res={R_Uncomponents} name={`bosshp.png`} scale={0.33} ></SpriteAtlas>
                                                                                                    <Rectangle color={0xDC143C} x={currentBossHPX + 210} frame={[0, 0, 100, 22]}></Rectangle>
                                                                                                </Layer>
                                                                                                <Rectangle x={x} frame={[0, 0, 210, 24]}></Rectangle>
                                                                                            </MaskLayer>
                                                                                        )
                                                                                    }
                                                                                }
                                                                            </Tween>

                                                                            <Label x={118} y={150} anchor={0.5} text={`${bossHP}/${BOSS_HP}`} style={{ fill: '#FFFFFF', fontSize: 16, dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 0, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }} />
                                                                            <SpriteAtlas y={112} name={`bosshpframe.png`} res={R_Uncomponents}></SpriteAtlas>
                                                                        </Layer>
                                                                        <Layer x={300} y={10 * k}>
                                                                            <SpriteAtlas x={40} y={30} scale={1} name={`hp/bosshpchains.png`}></SpriteAtlas>
                                                                            <SpriteAtlas x={10} y={137} scale={1} name={`hp/playerhp_back.png`}></SpriteAtlas>
                                                                            <Layer y={111}>
                                                                                <Tween dep={[playerHP]} from={{ k: 0 }} to={{ k: 1 }} playing={true} duration={1000}>
                                                                                    {
                                                                                        ({ k }) => {
                                                                                            const x = lastPlayerHPX - (lastPlayerHPX - currentPlayerHPX) * k;
                                                                                            return (
                                                                                                <MaskLayer x={12} y={27}>
                                                                                                    <Layer>
                                                                                                        <SpriteAtlas res={R_Uncomponents} name={`playerhp.png`}></SpriteAtlas>
                                                                                                        <Rectangle color={0xDC143C} x={currentPlayerHPX + 210} frame={[0, 0, lastPlayerHPX - currentPlayerHPX, 22]}></Rectangle>
                                                                                                    </Layer>
                                                                                                    <Rectangle x={x} frame={[0, 0, 210, 22]}></Rectangle>
                                                                                                </MaskLayer>
                                                                                            )
                                                                                        }
                                                                                    }
                                                                                </Tween>
                                                                                <Label x={118} y={38} anchor={0.5} text={`${playerHP}/${PLAYER_HP}`} style={{ fill: '#FFFFFF', fontSize: 16, dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 0, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }} />
                                                                                <SpriteAtlas name={`playerhpframe.png`} res={R_Uncomponents}></SpriteAtlas>
                                                                            </Layer>
                                                                        </Layer>
                                                                    </Layer>
                                                                )
                                                            }
                                                        }
                                                    </Tween>
                                                    <Layer x={198} y={85}>
                                                        <SpriteAtlas name={`jackpot/jackpot_frame2.png`}></SpriteAtlas>
                                                        <SpriteAtlas x={4} y={-13} name={`jackpot/jackpot_label.png`}></SpriteAtlas>
                                                        <Layer y={-26}>
                                                            <SpriteAtlas x={22} y={44} scale={0.1} name={`jackpot/jackpot_chest.png`}></SpriteAtlas>
                                                            <Layer x={67} y={49}>
                                                                <SpriteAtlas scale={0.33} name={`jackpot/jackpot_numberframe.png`}></SpriteAtlas>
                                                                <Label x={31} y={10} anchor={0.5} text={state.spin.spinModel?.jackpot || JACKPOT} style={{ fill: '#FFFFFF', fontSize: 16, fontWeight: '900' }} />
                                                            </Layer>
                                                            <SpriteAtlas x={53} y={52} scale={0.15} name={`jackpot/_X.png`}></SpriteAtlas>
                                                        </Layer>
                                                    </Layer>
                                                </Layer>
                                            )
                                        }
                                    }
                                </Tween>
                            )
                        }
                    }
                </Tween>
            </Layer>
        </Layer>
    )
}