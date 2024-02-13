import { Layer } from "common/components/layer";
import { GameStatusModel, KGameStep } from "../status/type";
import { KeyPress } from "common/services/keyboardService";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { PressButton, SButton } from "common/components/button";
import { R_Uncomponents } from "common/assets";
import { TweenAmountLabel } from "common/components/tweenAnimations";
import { action_setAutoSpinDetail, action_setBetAmount, action_spin, action_stopAutoSpin } from "common/model/spin";
import { action_error_detail } from "common/model/setting";
import { ErrorCodesInservice } from "common/services/errorService";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { Tween } from "common/components/tween";
import { useDelayFrameOnce, useFrame } from "common/components/customhook";
import { Sound } from "common/components/sound";
import { I_BET_AMOUNT_LIST, MAX_ROUNDS } from "./config";
import { Label } from "common/components/text";
import { MaskLayer } from "common/components/maskLayer";
import { Rectangle } from "common/components/rectangle";

export function Spin({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, dispatch, gameStatus, nextGameStatus, gameStep, spunRound } = dataSource?.base!;
    const { onGameStart, onGameGiveUp } = dataSource.actions!;
    const { inFS } = dataSource.fs!;
    const { betLevel, betAmount, autoSpinCount, spinModel } = state.spin;
    const { historyListOn, historyDetail: { on: historyDetailOn }, payTableOn, menuOn } = state.setting;
    const { code } = state.setting.error;
    const { balance } = state.user;
    const isAutoSpin = autoSpinCount == '∞' || autoSpinCount > 0;
    const isIdle = gameStatus == 'idle';
    const isSpin = gameStatus == 'spin';
    const isStoping = gameStatus == 'stopping';
    const isSpinOrStoping = isSpin || isStoping;
    const selected = I_BET_AMOUNT_LIST.indexOf(betAmount.toNumber());
    const existEnoughMoney = balance.greaterThanOrEqualTo(betAmount.mul(betLevel));
    const isGameNotStart = gameStep == KGameStep.notStart;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;
    const isInBossBattle = gameStep == KGameStep.InBossBattle;
    const isBossDestroyed = gameStep == KGameStep.bossDestroyed;
    const keyEnable = !historyListOn && !historyDetailOn && !payTableOn && !menuOn && (isIdle || isAutoSpin);

    function spin() {
        if (!existEnoughMoney) {
            if (isAutoSpin) {
                dispatch(action_stopAutoSpin());
            }
            dispatch(action_error_detail(ErrorCodesInservice.NotEnoughBalance, true, true));
        } else if (!code) {
             dispatch(action_spin());
        }
    }

    function onSpin(e: any = null, fromAuto: boolean = false) {
        if (isGameNotStart) {
            onGameStart(true);
        } else {
            if (isAutoSpin && !fromAuto) {
                dispatch(action_stopAutoSpin());
            } else {
                spin();
            }
        }
    }

    function onAutoSpin() {
        !isAutoSpin && dispatch(action_setAutoSpinDetail('∞', '∞', 0, 0));
    }

    function onMax_Giveup() {
        if (isGameNotStart) {
            const _selected = I_BET_AMOUNT_LIST.length - 1;
            _selected != selected && dispatch(action_setBetAmount(I_BET_AMOUNT_LIST[_selected]))
        } else {
            onGameGiveUp(true);
        }
    }

    function onSub() {
        const _selected = Math.max(selected - 1, 0);
        _selected != selected && dispatch(action_setBetAmount(I_BET_AMOUNT_LIST[_selected]))
    }

    function onAdd() {
        let _selected = Math.min(selected + 1, I_BET_AMOUNT_LIST.length - 1);
        _selected != selected && dispatch(action_setBetAmount(I_BET_AMOUNT_LIST[_selected]))
    }

    const nextSpinIsRsOrFS = ((spinModel?.ng || 0) > 0 );
    useDelayFrameOnce(() => {
        onSpin(null, true);
    }, 500, isIdle && !isGameNotStart && (isAutoSpin || nextSpinIsRsOrFS));

    return (
        <Layer>
            <KeyPress onKeySpace={onSpin} onKeyEnter={onSpin} enable={keyEnable}></KeyPress>
            <Layer y={827}>
                <SpriteAtlas x={2.5} y={-40} name={`footer/Gold footer.png`}></SpriteAtlas>
                <SpriteAtlas name={`footer/footer_background.png`}></SpriteAtlas>
                <Layer x={47} y={-80} visible={!inFS && !isInBossBattle && !isBossDestroyed}>
                    <SpriteAtlas name={`gauge/fuelgauge_meter.png`}></SpriteAtlas>

                    <Tween dep={[spunRound]} from={{ k: 0 }} to={{ k: 1 }} playing={true} repeat={0} duration={500} delay={0}>
                        {
                            ({ k }) => {
                                const r0 = ((58 - 116 * (spunRound! / MAX_ROUNDS)) / 180) * Math.PI;
                                const r1 = ((58 - 116 * ((spunRound! - 1) / MAX_ROUNDS)) / 180) * Math.PI;
                                const r = r0 + (r1 - r0) * Math.sin(Math.PI / 2 + Math.PI / 2 * 3 * k);
                                return (
                                    <MaskLayer x={54} y={64}>
                                        <SpriteAtlas anchor={[0.5, 1]} scale={1.2} rotation={r} name={`gauge/fuelgauge_pointer.png`}></SpriteAtlas>
                                        <Rectangle frame={[-35, -50, 70, 45]}></Rectangle>
                                    </MaskLayer>
                                )
                            }
                        }
                    </Tween>
                    <SpriteAtlas x={22} y={52} name={`gauge/fuelgauge_rolls.png`}></SpriteAtlas>
                    <RollsCountLabel x={55} y={68} spinRound={spunRound!}></RollsCountLabel>
                    <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={!isGameNotStart}>
                        {
                            ({ k }) => {
                                const scale = 1 + Math.sin(Math.PI / 2 * k) * 1;
                                const y = 300 * k;
                                return (
                                    <SpriteAtlas x={54.5} y={54.5 + y} scale={scale} anchor={0.5} name={`gauge/fuelgauge_closedcover.png`} ></SpriteAtlas>
                                )
                            }
                        }
                    </Tween>
                </Layer>
                <Tween from={{ k: 0 }} to={{ k: 1 }} repeat={1000000} duration={2000} playing={MAX_ROUNDS - spunRound! <= 7 && isInShipBattle && !inFS}>
                    {
                        ({ k }) => {
                            return (
                                <Layer>
                                    <SpriteAtlas x={57} y={-70.5} alpha={0.6 * Math.sin(Math.PI * k)} name={"gauge/fuelgauge_warning.png"}></SpriteAtlas>
                                </Layer>
                            )
                        }
                    }
                </Tween>
                <AlarmSound rolls={MAX_ROUNDS - spunRound!} isInShipBattle={isInShipBattle && !inFS}></AlarmSound>
                <Layer x={35} y={30}>
                    <SpriteAtlas anchor={[0.5, 0]} x={65} name={`footer/footer_bet.png`}></SpriteAtlas>
                    <Layer x={4} y={23}>
                        <SpriteAtlas name={`footer/footer_betframe.png`}></SpriteAtlas>
                        <TweenAmountLabel x={63} y={16} anchor={0.5} duration={500} text={betLevel.mul(betAmount)} style={{ fill: '#FFFFFF', dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }} />
                    </Layer>
                    <Layer x={-3} y={48}>
                        <SButton hitFrame={[5, 5, 60, 45]} click={onSub} interactive={isGameNotStart}>
                                <SpriteAtlas res={R_Uncomponents} name={`footer_bet_minus_active.png`} visible={isGameNotStart}></SpriteAtlas>
                                <SpriteAtlas res={R_Uncomponents} name={`footer_bet_minus_inactive.png`} visible={!isGameNotStart}></SpriteAtlas>
                        </SButton>
                        <SButton hitFrame={[10, 5, 60, 45]} x={60} click={onAdd} interactive={isGameNotStart}>
                                <SpriteAtlas res={R_Uncomponents} name={`footer_bet_plus_active.png`} visible={isGameNotStart}></SpriteAtlas>
                                <SpriteAtlas res={R_Uncomponents} name={`footer_bet_plus_inactive.png`} visible={!isGameNotStart}></SpriteAtlas>
                        </SButton>
                    </Layer>
                </Layer>
                <Layer>
                    <PressButton hitFrame={[32, 24, 120, 120]} onpointerup={onSpin} onLongPress={onAutoSpin} x={280} y={50} pivot={[100, 100]} enable={keyEnable}>

                        <WheelHandleWithTween isSpin={isSpinOrStoping}></WheelHandleWithTween>
                        <SpriteAtlas x={93} y={84} visible={true} scale={1} anchor={0.5} res={R_Uncomponents} name={`spin.png`}></SpriteAtlas>
                        <SpriteAtlas x={94} y={86} visible={!isIdle} anchor={0.5} res={R_Uncomponents} name={`spin_press.png`}></SpriteAtlas>
                        <SpriteAtlasLang x={93} y={85} anchor={0.5} scale={0.9} name={`spin_text.png`} visible={!isAutoSpin}></SpriteAtlasLang>
                        <SpriteAtlasLang x={93} y={75} anchor={0.5} scale={0.9} name={`spin_text_auto.png`} visible={isAutoSpin}></SpriteAtlasLang>

                        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={!isGameNotStart}>
                            {
                                ({ k }) => {
                                    const scale = 1 + Math.sin(Math.PI / 2 * k) * 1;
                                    const y = 300 * k;
                                    return <SpriteAtlas x={94} y={86 + y} anchor={0.5} scale={scale} name={`footer/spin_cover.png`} ></SpriteAtlas>
                                }
                            }
                        </Tween>
                    </PressButton>
                </Layer>
                <SButton x={430} y={40} scale={0.8} click={onMax_Giveup} interactive={isIdle}>
                    <SpriteAtlas res={R_Uncomponents} name={`footer_maxbet.png`} visible={isGameNotStart}></SpriteAtlas>
                    <SpriteAtlas x={3} y={3} res={R_Uncomponents} name={`footer_surrender.png`} visible={!isGameNotStart}></SpriteAtlas>
                </SButton>
            </Layer>
        </Layer>
    )
}

export const RollsCountLabel = ({ spinRound, ...layerProps }: { spinRound: number } & ComponentProps<typeof Label>) => {
    const [count, setCount] = useState(spinRound);

    useEffect(() => {
        setCount(spinRound);
    }, [spinRound]);

    return <Label anchor={0.5} text={`${MAX_ROUNDS - count}`} style={{
        fontSize: 18, fill: '#00a000', fontWeight: 'bolder', wordWrap: true, wordWrapWidth: 300, breakWords: false,
        dropShadow: true, dropShadowColor: '#00a000', dropShadowBlur: 1, dropShadowAngle: Math.PI / 12, dropShadowDistance: 1
    }} {...layerProps}></Label>
}

export function WheelHandleWithTween({isSpin}: {isSpin: boolean}) {
    const { current } = useRef<{rotation: number}>({rotation: 0});

    return (
        <Layer x={93} y={84}>
            <Tween dep={[isSpin]} from={{ k: 0 }} to={{ k: 1 }} duration={18000} repeat={100000000} playing={true}>
                {
                    ({ k }) => {
                        let _r;

                        if (isSpin) {
                            current.rotation = (current.rotation + 6) % 360;
                            _r = current.rotation;
                        } else {
                            _r = current.rotation + Math.sin(Math.PI * 2 * k) * 30
                        }

                        const rotation = Math.PI * 2 * _r / 360;

                        return <SpriteAtlas scale={1} rotation={rotation} pivot={[111.5,112.5]} name={`footer/WheelHandle.png`}></SpriteAtlas>
                    }
                }
            </Tween>
        </Layer>
    )
}

export function AlarmSound({rolls, isInShipBattle}: {rolls: number, isInShipBattle: boolean}) {
    const [dep, setDep] = useState(0);
    const playing = rolls <= 7 && rolls > 0 && isInShipBattle;

    useFrame(5000, () => {
        setDep(dep + 1);
    }, playing);
    return <Sound dep={[dep]} sound='warning' playing={playing} allowStop={true} volum={1} soft={0.7} softBgm={true}></Sound>
}