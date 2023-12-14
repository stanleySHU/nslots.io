import { Button, PressButton, SPressButton } from "common/components/button"
import { Layer, Orientation } from "common/components/layer"
import { SpriteAtlas } from "common/components/sprite"
import { GameStatusModel, KCurrentGameStatus } from "../status/type"
import { action_setAutoSpinDetail, action_setSpinSpeed, action_spin, action_stopAutoSpin } from "common/model/spin"
import { KeyPress } from "common/services/keyboardService"
import { Tween } from "common/components/tween"
import { ComponentProps, useEffect, useState } from "react"
import { useDelayFrameOnce } from "common/components/customhook"
import { Label } from "common/components/text"
import { BitmapText } from "@pixi/react"
import { R_Gold_Font } from "@/assets"
import { TweenAnimationRotate } from "common/components/tweenAnimations"
import { action_balanceChanged } from "common/model/user"

export function SpinButton({ enable = true, dataSource, ...layerProps }: { enable?: boolean, dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const { dispatch, gameStatus, state } = dataSource.base!;
    const { speedModel, betAmount, betLevel } = state.spin;
    const { balance } = state.user;
    const { code } = state.setting.error;
    const [spinTweenStatus, setSpinTweenStatus] = useState<'idle' | 'fast' | 'stop' | 'skip'>('idle');
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;

    const isShowWinEffect = gameStatus == KCurrentGameStatus.show5oak || gameStatus == KCurrentGameStatus.showBigWinAmount || gameStatus == KCurrentGameStatus.showScatter;
    const existEnoughMoney = balance.greaterThanOrEqualTo(betAmount.mul(betLevel));
    const canSpin = !code && existEnoughMoney && !isShowWinEffect;
    const isIdle = gameStatus == 'idle';

    const isSpinTweenIdle = spinTweenStatus == 'idle';
    const isSpinTweenFast = spinTweenStatus == 'fast';
    const isSpinTweenStop = spinTweenStatus == 'stop';
    const isSpinTweenSkip = spinTweenStatus == 'skip';

    const { historyListOn, historyDetail: { on: historyDetailOn }, payTableOn, menuOn } = state.setting;
    const keyEnable = enable && !historyListOn && !historyDetailOn && !payTableOn && !menuOn;

    function onSpin(e: any = null, fromAuto: boolean = false) {
        if (isAutoSpin && !fromAuto) {
            dispatch(action_stopAutoSpin());
        } else if (canSpin) {
            dispatch(action_spin());
            const cost = betAmount.mul(betLevel);
            dispatch(action_balanceChanged(balance.sub(cost)));
        } else if (!existEnoughMoney) {
            //
        }
    }

    function onAutoSpin() {
        !isAutoSpin && dispatch(action_setAutoSpinDetail('∞', '∞', 0, 0));
    }

    useEffect(() => {
        if (gameStatus == 'spin') {
            setSpinTweenStatus('fast');
        } else if (isIdle) {
            setSpinTweenStatus('idle');
        } else if (gameStatus != 'stopping' && spinTweenStatus != 'fast') {
            setSpinTweenStatus('skip');
        }
    }, [gameStatus]);

    useDelayFrameOnce(() => {
        if (gameStatus == 'stopping') {
            setSpinTweenStatus('stop');
        } else if (isIdle) {
            setSpinTweenStatus('idle');
        } else if (gameStatus != 'spin') {
            setSpinTweenStatus('skip');
        }
    }, 1500, spinTweenStatus == 'fast');

    useDelayFrameOnce(() => {
        onSpin(null, true);
    }, 500, isAutoSpin && isIdle)

    return (
        <Layer>
            <KeyPress onKeySpace={onSpin} enable={keyEnable}></KeyPress>
            <Layer {...layerProps}>
                <PressButton hitFrame={[55, 35, 90, 90]} onpointerup={onSpin} onLongPress={onAutoSpin} pivot={[98, 94]}>
                    <SpriteAtlas name={'spin_light.png'}></SpriteAtlas>
                    <TweenAnimationRotate speed={spinTweenStatus != 'idle' ? 2 : 0.1} >
                        {
                            (rotation) => {
                                return <Layer>
                                    <SpriteAtlas visible={isSpinTweenFast || (isSpinTweenIdle && !isAutoSpin)} x={98} y={80} anchor={[0.49, 0.47]} name={'Spin.png'} rotation={rotation}></SpriteAtlas>
                                    <SpriteAtlas visible={isSpinTweenStop} x={95} y={77} anchor={[0.49, 0.47]} name={'stop.png'}></SpriteAtlas>
                                    <SpriteAtlas visible={isSpinTweenSkip && !isShowWinEffect} x={98} y={75} anchor={[0.49, 0.47]} name={'skip.png'}></SpriteAtlas>
                                    <Layer visible={isAutoSpin && isSpinTweenIdle}>
                                        <SpriteAtlas x={98} y={78} anchor={0.5} scale={1} name={'auto.png'}></SpriteAtlas>
                                        <Label x={99} y={78} anchor={0.5} text={`∞`} style={{ fill: '#FFFFFF', fontSize: 55 }} />
                                    </Layer>
                                </Layer>
                            }
                        }
                    </TweenAnimationRotate>
                </PressButton>
            </Layer>
        </Layer>
    )
}

export const Spin = ({ dataSource }: { dataSource: GameStatusModel }) => {
    const { dispatch, gameStatus, state } = dataSource.base!;
    const { speedModel } = state.spin;
    const [spinTweenStatus, setSpinTweenStatus] = useState<'idle' | 'fast' | 'stop' | 'skip'>('idle');
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;

    const isFastSpin = speedModel == 'fast';
    const isIdle = gameStatus == 'idle';

    function onAuto() {
        if (isAutoSpin) {
            dispatch(action_setAutoSpinDetail(0, 0, 0, 0));
        } else {
            dispatch(action_setAutoSpinDetail('∞', '∞', 0, 0));
        }
    }

    function onTurbo() {
        if (isIdle) dispatch(action_setSpinSpeed(isFastSpin ? 'normal' : 'fast'))
    }

    return (
        <Orientation>
            <Layer l-x={925} l-y={-28} p-x={585} p-y={-90} l-scale={1} p-scale={1.2}>
                {/* l-x={925} l-y={-28} */}
                <SpinButton dataSource={dataSource} l-x={73} l-y={0} p-x={0} p-y={0} l-visible={false} p-visible={true} l-enable={false} p-enable={true}></SpinButton>
                {/* <SPressButton l-x={0} l-y={100} p-x={-120} p-y={-10} onpointerup={onAuto} l-scale={1} p-scale={0.8}>
                    <SpriteAtlas name={"autospin_disable.png"} anchor={0.5} visible={isAutoSpin}></SpriteAtlas>
                    <SpriteAtlas name={"autospin_enable.png"} anchor={0.5} visible={!isAutoSpin}></SpriteAtlas>
                    <Layer visible={isAutoSpin} y={-3}>
                        <BitmapText anchor={0.5} text={`8`} rotation={Math.PI / 2} style={{ fontName: R_Gold_Font, fontSize: 40 }} />
                    </Layer>
                </SPressButton> */}
                {/* <SPressButton l-x={150} l-y={100} p-x={120} p-y={-10} onpointerup={onTurbo} l-scale={1} p-scale={0.8} interactive={isIdle}> */}
                <SPressButton l-x={75} l-y={90} p-x={175} p-y={-10} onpointerup={onTurbo} l-scale={1} p-scale={0.8} interactive={isIdle}>
                    <SpriteAtlas name={"turbo_disable.png"} anchor={0.5} visible={isFastSpin || !isIdle}></SpriteAtlas>
                    <SpriteAtlas name={"turbo_enable.png"} anchor={0.5} visible={!isFastSpin && isIdle}></SpriteAtlas>
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