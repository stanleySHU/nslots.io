import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { ISpine_SeaBg, Spine_SeaBg } from "./base";
import { useMemo, useRef } from "react";

export function Sea({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, gameStep } = dataSource.base!;
    const isInBossBattle = gameStep == KGameStep.InBossBattle || gameStep == KGameStep.bossDestroyed;
    const { current } = useRef<{actions: [number, ISpine_SeaBg, boolean][]}>({actions: []});

    useMemo(() => {
        if (gameStatus == KCurrentGameStatus.showShipBattleOut) {
            current.actions = [[0, 'MorningToSunset', false], [0, 'SunsetLoop', true]];
        } else if (!isInBossBattle) {
            current.actions = [[0, 'MorningMob', true]];
        } else if (isInBossBattle) {
            if (current.actions.length == 0) {
                current.actions = [[0, 'SunsetLoop', true]];
            }
        }
    }, [gameStep, gameStatus])
    

    return (
        <Layer>
            <Spine_SeaBg scale={0.35} x={286} y={966} playing={true} actions={current.actions}></Spine_SeaBg>
        </Layer>
    )
} 
