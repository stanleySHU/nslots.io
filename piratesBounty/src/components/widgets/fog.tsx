import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { SpineCount_Fog } from "./base";
import { useMemo, useRef } from "react";

export function Fog({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, nextGameStatus, dispatch } = dataSource.base!;
    const { onFogOut, onForceUpdateAll } = dataSource.actions!;
    const { current } = useRef<{ actions: any, playing: boolean }>({ actions: [], playing: false });

    const isFogIn = gameStatus == KCurrentGameStatus.showFogIn;
    const isFogOut = gameStatus == KCurrentGameStatus.showFogOut;

    useMemo(() => {
        if (isFogIn) {
            current.actions = [[0, 'FOG_IN', false], [0, 'FOG_Idle', true]];
            current.playing = true;
        }
    }, [isFogIn]);

    function onLoop() {
        if (isFogOut) {
            if (current.actions[0][1] == 'FOG_OUT') {
                current.playing = false;
                nextGameStatus();
            } else {
                onFogOut();
                onForceUpdateAll();
                current.actions = [[0, 'FOG_OUT', false]];
            }
        } else {
            nextGameStatus();
        }
    }
    
    return (
        <Layer x={270} y={960} visible={current.playing}>
            <SpineCount_Fog scale={1} timeScale={1} repeat={100000} onLoop={onLoop} playing={current.playing} actions={current.actions}></SpineCount_Fog>
        </Layer>
    )
}