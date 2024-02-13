import { Layer } from "common/components/layer";
import { GameStatusModel } from "../status/type";
import { ComponentProps, useEffect, useState } from "react";
import { AnimatedSheet_Splash } from "./base";
import { getShipPoint } from "./fleet";
import { useDelayFrameOnce } from "common/components/customhook";
import { Sound } from "common/components/sound";

export function Splashs({dataSource}: {dataSource: GameStatusModel}) {
    const { splashArr } = dataSource.fleet!;
    const { showCannonId } = dataSource.cannon!;
    return (
        <Layer>
            {
                splashArr.map(({targetPoints, delay}, index) => {
                    const [targetX, targetY] = getShipPoint(targetPoints.x, targetPoints.y);
                    return <Splash key={`splash${showCannonId}_${index}`} delay={delay} x={targetX} y={targetY} ></Splash>
                })
            }
        </Layer>
    )
}

export function Splash({ delay, ...layerProps }: ComponentProps<typeof Layer> & { delay: number }) {
    const [playing, setPlaying] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);

    useDelayFrameOnce(() => {
        setPlaying(true);
        setDone(true);
    }, delay, !playing && !done)
    
    return (
        <Layer {...layerProps}>
            <Sound playing={playing} sound='fire_missedcannon' allowStop={false}></Sound>
            <AnimatedSheet_Splash scale={1.5} isPlaying={playing} visible={playing} pivot={[28, 60]} onLoop={setPlaying.bind(null, false)}></AnimatedSheet_Splash>
        </Layer>
    )
}