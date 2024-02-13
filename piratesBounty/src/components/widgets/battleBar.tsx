import { Layer } from "common/components/layer";
import { GameStatusModel, KBossStatus } from "../status/type";
import { ISpine_Bosswarning, Spine_Bosswarning } from "./base";
import { useMemo } from "react";

export function BattleBar({ dataSource }: { dataSource: GameStatusModel }) {
    
    const action = useMemo<[number, ISpine_Bosswarning, boolean]>(() => {
        return [0, 'bosswarning_L', true];
    }, [])

    const isPlaying = false
    return (
        <Layer>
            <Spine_Bosswarning scale={0.33} x={9} y={960} visible={isPlaying} playing={isPlaying} action={action}></Spine_Bosswarning>
        </Layer>
    )
}