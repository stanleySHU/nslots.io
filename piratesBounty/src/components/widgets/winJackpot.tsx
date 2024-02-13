import { Layer } from "common/components/layer";
import { GameStatusModel } from "../status/type";
import { Tween } from "common/components/tween";
import { SpriteAtlas } from "common/components/sprite";
import { AnimatedSheet_StarY } from "./base";
import { Easing, Interpolation } from "@tweenjs/tween.js";
import { BLEND_MODES } from "pixi.js";
import { Sound } from "common/components/sound";
import { getShipPoint } from "./fleet";
import { useState } from "react";
import { useDelayFrameOnce } from "common/components/customhook";

export const IShowFlareDuration = 800;
export const IFlareFlyToJackpotDuration = 1000;
export const IWinJackpotDuration = IShowFlareDuration + IFlareFlyToJackpotDuration;

export function WinJackpot({dataSource}: {dataSource: GameStatusModel}) {
    const { getJpInfoTween } = dataSource.jackpot!;

    return <Layer>
        {
            getJpInfoTween.map((item, index) => {
                const { point, jpValue, currentTime, increaseJp, delay, keyId } = item;
                const startPoint = getShipPoint(point.x, point.y);
                return (
                    <WinJackpotStar key={`jpt${keyId}`} startPoint={startPoint} delay={delay}></WinJackpotStar>
                )
            })
        }
    </Layer>
}

export function WinJackpotStar({ startPoint, delay}: { startPoint: number[], delay: number}) {
    const [startX, startY] = startPoint;
    const [endX, endY] = [110, 220];
    const [offsetX, offsetY] = [startX - endX, startY - endY];
    const tween1OffsetY = -50;
    const [playing, setPlaying] = useState(false);

    useDelayFrameOnce(() => {
        setPlaying(true);
    }, delay, true);

    return (
        <Layer x={startX} y={startY} visible={playing}>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={IShowFlareDuration} playing={playing} repeat={0} easing={Easing.Quintic.Out}>
                {
                    ({ k }) => {
                        return (
                            <Layer visible={k < 1}  >
                                <SpriteAtlas y={-50} scale={0.66} anchor={0.5} tint={0x00FFFF} name={`freespin/freegame_flare.png`}></SpriteAtlas>
                                <AnimatedSheet_StarY y={-30 - 20 * k} isPlaying={playing} anchor={0.5} scale={1}></AnimatedSheet_StarY>
                            </Layer>
                        )
                    }
                }
            </Tween>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={IFlareFlyToJackpotDuration} delay={IShowFlareDuration} playing={playing} repeat={0} onComplete={setPlaying.bind(null, false)}>
                {
                    ({ k }, playing) => {
                        k = Math.min(1, k * 1.2);
                        const x = -Interpolation.Bezier([0, startX - 270, offsetX], k)
                        const y = tween1OffsetY - Interpolation.Bezier([0, offsetY + 150, offsetY], k);
                        const scale = 1 - 0.6 * k;
                        return (
                            <Layer x={x} y={y} scale={0.33 * scale} visible={playing && k > 0}>
                                <SpriteAtlas blendMode={BLEND_MODES.SCREEN} visible={true} scale={1} name={'shipmeter_fx.png'} anchor={0.5}></SpriteAtlas>
                                <Sound sound={`star`} playing={k == 1} allowStop={false}></Sound>
                            </Layer>
                        )
                    }
                }
            </Tween>
        </Layer>
    )
}