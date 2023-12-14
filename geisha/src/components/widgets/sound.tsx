import { GameContext } from "common/AppContext";
import { Sound, SoundBgm } from "common/components/sound";
import { atLast } from "common/util/array";
import { useContext, useEffect, useMemo, useState } from "react"
import { useDelayFrameOnce, useMenoConstant } from "common/components/customhook";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";

export function BgmSounds() {
    const {state} = useContext(GameContext);
    const scene = atLast(state.sceneManager.scenes);

    const sound = useMemo(() => {
        if (state.setting.payTableOn) {
            return 'bgm-info';
        } else if (scene == 'main') {
            return 'bgm'
        } else if (scene == 'premain') {
            return 'loading_bgm';
        } 
    }, [scene, state.setting.payTableOn]);


    return <SoundBgm sound={sound} playing={!!sound}></SoundBgm>
}

export function GameSounds({dataSource}: {dataSource: GameStatusModel}) {
    const { gameStatus, state, nextGameStatus } = dataSource.base!;
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount;
    const isSpin = state.spin.status == 'spin';
    const isStopping = state.spin.status == 'stopping';
    const isFastSpin = state.spin.speedModel == 'fast';

    const [winSound, delay]= useMemo(() => {
            const type = state.spin.spinModel?.winType;
            if (type == 'big') {
                return ['', 1900];
            } else if (type == 'high') {
                return ['HighWin', 22500];
            } else if (type == 'medium') {
                return ['MediumWin', 9000];
            } else if (type == 'normal') {
                return ['NormalWin', 5000]
            } else {
                return ['SmallWin', 3000];
            }
    }, [isShowWinAmount]);

    useDelayFrameOnce(() => {
        nextGameStatus(KCurrentGameStatus.showWinLine);
    }, delay, isShowWinAmount)

    return (
        <>
            <Sound sound='spin' playing={isSpin}></Sound>
            <SoundForSpin isSpin={isSpin} isStopping={isStopping} isFast={isFastSpin}></SoundForSpin>
            <Sound softBgm={true} sound={winSound} playing={isShowWinAmount} allowStop={true}></Sound> 
            <Sound sound="reelstop" playing={!!state.spin.spinModel && state.spin.status == 'idle'} allowStop={true}></Sound>
            <Sound sound='bigwin' playing={gameStatus == KCurrentGameStatus.showBigWinAmount} allowStop={true}></Sound>
            <Sound sound='jng_5kindwin_win' playing={gameStatus == KCurrentGameStatus.show5oak} allowStop={true}></Sound>
        </>
    )
}

export function SoundForSpin({isSpin, isStopping, isFast}: {isSpin: boolean, isStopping: boolean, isFast: boolean}) {
    const [step, setStep] = useState<'idle' | 'spinUp' |  'spin' | 'spinDown'>('idle'); 
    const isSpinUp = step == 'spinUp';

    useEffect(() => {
        if (isSpin) {
            setStep(isFast ? 'spin' : 'spinUp');
        } else if (!(isSpin || isStopping)) {
            setStep('idle')
        }
    }, [isSpin, isStopping])

    useDelayFrameOnce(() => {
        setStep('spinDown');
    }, 2000, isStopping && !isFast);

    useDelayFrameOnce(() => {
        setStep('spin');
    }, 873, isSpinUp);

    return <>
        <Sound sound='reel_spin_bgm2' playing={step == 'spinDown'} allowStop={true}></Sound>
        <Sound sound='reel_spin_bgm' playing={step == 'spin'} loop={true} allowStop={true}></Sound>
        <Sound sound='reel_spin_bgm2' playing={isSpinUp} allowStop={true}></Sound>
    </>
}

