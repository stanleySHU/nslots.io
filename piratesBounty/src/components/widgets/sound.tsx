import { GameContext } from "common/AppContext";
import { Sound, SoundBgm } from "common/components/sound";
import { atLast } from "common/util/array";
import { useContext, useEffect, useMemo, useState } from "react";
import { GameStatusModel, KCurrentGameStatus, KGameStatus, KGameStep } from "../status/type";
import { Tween } from "common/components/tween";
import { SlotContext } from "common/model/context";

export const I_Check_BGM = 'I_Check_BGM';

export function BgmSounds({}) {
    const {state} = useContext(GameContext);
    const scene = atLast(state.sceneManager.scenes);
    const [ gameStatus, setGamesStatus ] = useState<KGameStatus>('idle');
    const [ gameStep, setGameStep ] = useState<KGameStep>(KGameStep.notStart);
    const [ isFs, setIsFs ] = useState(false);

    const isInBossBattle = gameStep == KGameStep.InBossBattle;
    const isWin = gameStatus == KCurrentGameStatus.win;
    const isShipOut = gameStatus == KCurrentGameStatus.showShipBattleOut;

    useEffect(() => {
        const notice = SlotContext.Obj.notice;
        const func = (gameStatus: KGameStatus, gameStep: KGameStep, isFs: boolean) => {
            setGamesStatus(gameStatus);
            setGameStep(gameStep);
            setIsFs(isFs);
        }
        notice.on(I_Check_BGM, func);
        return () => {
            notice.off(I_Check_BGM, func);
        }
    }, []);

    const [sound, volum] = useMemo(() => {
        if (scene == 'main') {
            if (isWin) {
                return ['bossbattlewin_bgm', 1]
            } else if (isShipOut) {
                return ['boss_wecolme_bgm', 1]
            } else if (isInBossBattle) {
                return ["boss_bgm", 1];
             } else {
                return isFs ? ['fs_bgm', 1] : ['bgm', 1]
            } 
        } else if (scene == 'premain') {
            return ['bgm-loading', 1];
        }
        return ['', 1];
    }, [scene, isShipOut, isInBossBattle, isFs, isWin]);
    const fadeInPlaying = scene == 'premain' || (scene == 'main' && sound == 'bgm');

    return (
        <>
            <Tween dep={[sound]} from={{k : 0}} to={{k: 1}} playing={fadeInPlaying} duration={5000}>
                {
                    ({k}) => {
                        k = fadeInPlaying ? k : 1;
                        return <SoundBgm sound={sound} playing={!!sound} volum={volum * 0.1 + volum * 0.9 * k} ></SoundBgm>
                    }
                }
            </Tween>
        </>
    )
}

export function GameSounds({dataSource}: {dataSource: GameStatusModel}) {
    const { state: {spin: {status} }, gameStatus} = dataSource.base!;
    // const { show: showFog } = dataSource.fog!;

    const isSpin = gameStatus == 'spin';
    const isStopping = gameStatus == 'stopping';
    return (
        <>
            <Sound sound='spin' playing={isSpin} allowStop={false}></Sound>
            {/* <Sound sound='start' playing={showFog} allowStop={false}></Sound> */}
            <Sound sound="reel_spin_loop_bgm" playing={isSpin || isStopping} loop={true} volum={1}></Sound>
            {/* <Sound sound="fs_bgm" playing={inFreeSpin && dataSource.boss!.status == KBossStatus.NotInBattle} loop={true} allowStop={true} volum={1}></Sound> */}
            <Sound sound='normalwin' playing={gameStatus == KCurrentGameStatus.showWinAmount} allowStop={true} volum={0.5}></Sound>
            <Sound sound='freegamewin' playing={gameStatus == KCurrentGameStatus.showFreeSpinWinAmount} allowStop={true} volum={1}></Sound>
            <Sound sound='cageopen' playing={gameStatus == KCurrentGameStatus.showGateOpen} allowStop={false}></Sound>
            <Sound sound='cageclose' playing={gameStatus == KCurrentGameStatus.showGateClose } allowStop={false}></Sound>
            <Sound sound='jng_leveldefeat' playing={gameStatus == KCurrentGameStatus.loseInBossBattle} allowStop={true} softBgm={false}></Sound>
        </>
    )
}