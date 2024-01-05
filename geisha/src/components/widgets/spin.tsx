import { PressButton, SPressButton } from "common/components/button"
import { Layer, Orientation } from "common/components/layer"
import { SpriteAtlas } from "common/components/sprite"
import { GameStatusModel, KCurrentGameStatus } from "../status/type"
import { action_setAutoSpinDetail, action_setSpinSpeed, action_spin, action_stopAutoSpin } from "common/model/spin"
import { KeyPress } from "common/services/keyboardService"
import { Tween } from "common/components/tween"
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react"
import { useDelayFrameOnce } from "common/components/customhook"
import { BitmapText } from "@pixi/react"
import { R_Gold_Font } from "@/assets"
import { TweenAnimationRotate } from "common/components/tweenAnimations"
import { action_balanceChanged } from "common/model/user"
import { I_Spine_Spin, Spine_Spin } from "./base"
import { Spine } from "pixi-spine"

export function SpinButton({ enable = true, dataSource, ...layerProps }: { enable?: boolean, dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const autoSpine = useRef<Spine>(null);
    const autoSprite = useRef<any>(null);
    const { dispatch, gameStatus, state, nextGameStatus } = dataSource.base!;
    const { betAmount, betLevel } = state.spin;
    const { balance } = state.user;
    const { code } = state.setting.error;
    const [spinTweenStatus, setSpinTweenStatus] = useState<'idle' | 'fast' | 'fast1500' | 'stop' | 'skip'>('idle');
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;

    const isShowWinEffect = gameStatus == KCurrentGameStatus.show5oak || gameStatus == KCurrentGameStatus.showBigWinAmount || gameStatus == KCurrentGameStatus.showScatter;
    const existEnoughMoney = balance.greaterThanOrEqualTo(betAmount.mul(betLevel));
    const canSpin = !code && existEnoughMoney && !isShowWinEffect;
    const isIdle = gameStatus == 'idle';

    const isSpinTweenIdle = spinTweenStatus == 'idle';
    const isSpinTweenFast = spinTweenStatus == 'fast' || spinTweenStatus == 'fast1500';
    const isSpinTweenStop = spinTweenStatus == 'stop';
    const isSpinTweenSkip = spinTweenStatus == 'skip';

    const { historyListOn, historyDetail: { on: historyDetailOn }, payTableOn, menuOn } = state.setting;
    const keyEnable = enable && !historyListOn && !historyDetailOn && !payTableOn && !menuOn;

    function onSpin(e: any = null, fromAuto: boolean = false) {
        if (isAutoSpin && !fromAuto) {
            dispatch(action_stopAutoSpin());
        } else if (canSpin) {
            if (gameStatus == KCurrentGameStatus.showWinAmount2) {
                nextGameStatus();
            } else if (gameStatus == KCurrentGameStatus.showWinLine) {
                if (isAutoSpin) {
                    dispatch(action_spin());
                } else {
                    nextGameStatus();
                }
            } else {
                dispatch(action_spin());
            }
        } else if (!existEnoughMoney) {
            //
        }
    }

    function onAutoSpin() {
        !isAutoSpin && dispatch(action_setAutoSpinDetail('∞', '∞', 0, 0));
    }

    useEffect(() => {
        if (gameStatus == 'spin') {
            const cost = betAmount.mul(betLevel);
            dispatch(action_balanceChanged(balance.sub(cost)));
        }
    }, [gameStatus]);

    useEffect(() => {
        if (gameStatus == 'spin') {
            setSpinTweenStatus('fast');
        } else if (isIdle) {
            setSpinTweenStatus('idle');
        } else if (gameStatus != 'stopping' && spinTweenStatus != 'fast') {
            setSpinTweenStatus('skip');
        } else if (gameStatus == 'stopping' && spinTweenStatus == 'fast1500') {
            setSpinTweenStatus('stop');
        }
    }, [gameStatus]);

    useDelayFrameOnce(() => {
        if (gameStatus == 'stopping') {
            setSpinTweenStatus('stop');
        } else if (isIdle) {
            setSpinTweenStatus('idle');
        } else if (gameStatus != 'spin') {
            setSpinTweenStatus('skip');
        } else {
            setSpinTweenStatus('fast1500');
        }
    }, 1500, spinTweenStatus == 'fast');

    useDelayFrameOnce(() => {
        onSpin(null, true);
    }, 500, isAutoSpin && isIdle)

    useEffect(() => {
        if (autoSpine.current && autoSprite.current) {
            // Counter
            const slot1 = autoSpine.current.slotContainers[autoSpine.current.skeleton.findSlotIndex('Counter')];
            slot1.addChild(autoSprite.current);
        }
    }, [autoSpine, autoSprite])

    const showSpin = isSpinTweenFast || (isSpinTweenIdle && !isAutoSpin);
    const showSkin = isSpinTweenSkip && !isShowWinEffect;
    const showSkinEnable = showSkin && gameStatus != KCurrentGameStatus.showWinAmount;
    const spinButtonEnable = keyEnable && !isSpinTweenFast && (!isSpinTweenSkip || showSkinEnable);
    const disableSpin = !showSpin && !isSpinTweenStop && !showSkinEnable && !(isAutoSpin && isSpinTweenIdle);

    const spinAction = useMemo<[number, I_Spine_Spin, boolean]>(() => {
        if (isAutoSpin) {
            return  [0, 'Auto', true]
        } else {
            return [0, 'Idle', true];
        }
    }, [isAutoSpin])
    
    return (
        <Layer>
            <KeyPress onKeySpace={onSpin.bind(null, null, true)} onKeyEnter={onSpin.bind(null, null, true)} enable={spinButtonEnable}></KeyPress>
            <Layer {...layerProps}>
                <PressButton hitFrame={[55, 35, 90, 90]} onpointerup={onSpin} onLongPress={onAutoSpin} pivot={[98, 94]} interactive={spinButtonEnable}>
                    <Layer x={97} y={81}>
                        <Spine_Spin ref={autoSpine} scale={0.5} action={spinAction} playing={true} timeScale={1} tint={disableSpin ? 0xaaaaaa : 0xffffff}></Spine_Spin>
                    </Layer>
                    <TweenAnimationRotate speed={spinTweenStatus != 'idle' ? 2 : 0.1} >
                        {
                            (rotation) => {
                                return <Layer>
                                    <SpriteAtlas visible={showSpin} x={98} y={79} anchor={[0.49, 0.47]} name={'Spin.png'} rotation={rotation}></SpriteAtlas>
                                    <SpriteAtlas visible={isSpinTweenStop} x={96} y={75} anchor={[0.49, 0.47]} name={'stop.png'}></SpriteAtlas>
                                    <SpriteAtlas visible={showSkinEnable} x={97} y={74} anchor={[0.49, 0.47]} name={'skip.png'}></SpriteAtlas>
                                </Layer>
                            }
                        }
                    </TweenAnimationRotate>
                </PressButton>
            </Layer>
            <BitmapText ref={autoSprite} visible={isAutoSpin && isSpinTweenIdle} x={-6} y={0} anchor={0.5} rotation={Math.PI/2} scale={[2, -2]} text={`8`} style={{ fontName: R_Gold_Font, fontSize: 60, letterSpacing: 3 }} />
        </Layer>
    )
}

export const Spin = ({ dataSource }: { dataSource: GameStatusModel }) => {
    const { dispatch, gameStatus, state } = dataSource.base!;
    const { speedModel } = state.spin;
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;

    const isFastSpin = speedModel == 'fast';
    const isIdle = gameStatus == 'idle';

    function onTurbo() {
        if (isIdle) dispatch(action_setSpinSpeed(isFastSpin ? 'normal' : 'fast'))
    }

    return (
        <Orientation>
            <Layer l-x={925} l-y={-28} p-x={585} p-y={-90} l-scale={1} p-scale={1.2}>
                <SpinButton dataSource={dataSource} l-x={73} l-y={0} p-x={0} p-y={0} l-visible={false} p-visible={true} l-enable={false} p-enable={true}></SpinButton>
                <SPressButton l-x={75} l-y={90} p-x={175} p-y={-10} onpointerup={onTurbo} l-scale={1} p-scale={0.8} interactive={isIdle && !isAutoSpin}>
                    <SpriteAtlas name={"turbo_disable.png"} anchor={0.5} visible={isFastSpin || !isIdle || isAutoSpin}></SpriteAtlas>
                    <SpriteAtlas name={"turbo_enable.png"} anchor={0.5} visible={!isFastSpin && isIdle && !isAutoSpin}></SpriteAtlas>
                    <Tween from={{ k: 0 }} to={{ k: 1 }} playing={isFastSpin} duration={2000} repeat={1000000}>
                        {
                            ({ k }) => {
                                return <SpriteAtlas visible={isFastSpin} alpha={0.5 + Math.sin(Math.PI * 2 * k) * 0.5} name={"turbo_activate.png"} anchor={0.5} y={-2}></SpriteAtlas>
                            }
                        }
                    </Tween>
                </SPressButton>
            </Layer>
        </Orientation>
    )
}