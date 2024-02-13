import { Layer } from "common/components/layer";
import { GameStatusModel } from "../status/type";
import { ComponentProps, useMemo, useState } from "react";
import { AnimatedSheetCount_Explosion, Spine_Boat } from "./base";
import { Tween } from "common/components/tween";
import { Easing } from "@tweenjs/tween.js";
import { Sound } from "common/components/sound";
import { BitmapText } from "@pixi/react";
import { R_Font_Gold } from "@/assets";
import { ShipModel } from "../status/fleetStatus";
import { useDelayFrameOnce } from "common/components/customhook";

export const IShipPointScale = [
    [[140, 437, 1.4], [158, 367, 0.97], [176, 327, 0.8], [204, 287, 0.57], [220, 262, 0.4]],
    [[270, 437, 1.4], [270, 367, 0.97], [270, 327, 0.8], [270, 287, 0.57], [270, 262, 0.4]],
    [[400, 437, 1.4], [382, 367, 0.97], [364, 327, 0.8], [336, 287, 0.57], [320, 262, 0.4]]
]

export function getShipPoint(inColumn: number, row: number) {
    const t = IShipPointScale[inColumn][row];
    return [t[0], t[1]];
}

export function Fleet({ dataSource }: { dataSource: GameStatusModel }) {
    const { fleet } = dataSource.fleet!;
    const { showCannonId } = dataSource.cannon!;

    return (
        <Layer>
            {
                fleet.map((subFleet, i) => {
                    return (
                        <Layer key={`3fleet${i}`}>
                            {
                                subFleet.map((ship, j) => {
                                    return <Ship key={`${showCannonId}fleet${j}`} shipModel={ship} />
                                })
                            }
                        </Layer>
                    )
                })
            }
        </Layer>
    )
}


export function Ship({ shipModel }: { shipModel: ShipModel }) {
    const { inColumn, inRow, nextRow, action, isDestory, pt, moveDelay, destoryDelay, moveDuration, isMove } = shipModel;
    const [destoryed, setDestoryed] = useState<boolean>(false);
    const [move, setMove] = useState<boolean>(false);

    const [fromX, fromY, fromScale] = useMemo(() => {
        let t = IShipPointScale[inColumn][inRow];
        if (t) {
            return t;
        } else {
            t = [...IShipPointScale[inColumn][4]];
            t[2] = 0;
            return t;
        }
    }, [inColumn, inRow]);

    const [toX, toY, toScale] = useMemo(() => {
        let t = IShipPointScale[inColumn][nextRow];
        if (t) {
            return t;
        } else {
            t = [...IShipPointScale[inColumn][4]];
            t[2] = 0;
            return t;
        }
    }, [inColumn, nextRow]);

    useDelayFrameOnce(() => {
        setDestoryed(true);
    }, destoryDelay, isDestory);

    useDelayFrameOnce(() => {
        setMove(true);
    }, moveDelay, isMove);

    return (
        <Layer>
            <Tween from={{ x: fromX, y: fromY, scale: fromScale }} to={{ x: toX, y: toY, scale: toScale }} playing={move} duration={moveDuration} >
                {
                    ({ x, y, scale }) => {
                        return (
                            <Layer x={x} y={y} scale={scale * 0.33}>
                                <Tween from={{ k: 1 }} to={{ k: 0 }} duration={100} playing={destoryed} >
                                    {
                                        ({ k }) => {
                                            return (
                                                <Layer>
                                                    <Spine_Boat visible={k} playing={true} action={action}></Spine_Boat>
                                                    <Sound sound='kill_ship' playing={k < 1} allowStop={false}></Sound>
                                                </Layer>
                                            )
                                        }
                                    }
                                </Tween>
                            </Layer>
                        )
                    }
                }
            </Tween>
            <SheetExplosion x={toX - 70} y={toY - 85} repeat={1} isPlaying={destoryed}></SheetExplosion>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={1000} playing={destoryed}>
                {
                    ({ k }, playing) => {
                        let _k: number = 0;
                        if (k < 0.3) {
                            _k = Easing.Cubic.Out(k / 0.3);
                        } else {
                            _k = 1;
                        }
                        const y = _k * -40;
                        const scale = _k;
                        const alpha = k < 0.8 ? 1 : 1 - (k - 0.8) / 0.2;
                        return <Layer x={toX} y={toY} visible={playing} alpha={alpha}>
                            <BitmapText y={y} anchor={[0.5, 0.3]} scale={toScale * scale} text={`${pt}PT`} style={{ fontName: R_Font_Gold, fontSize: 65, letterSpacing: -6 }} />
                        </Layer>
                    }
                }
            </Tween>
        </Layer>
    )
}

export function SheetExplosion({ isPlaying, ...layerProps }: ComponentProps<typeof AnimatedSheetCount_Explosion>) {
    const [playing, setPlaying] = useState<boolean>(false);

    useMemo(() => {
        setPlaying(isPlaying);
    }, [isPlaying])

    return <AnimatedSheetCount_Explosion {...layerProps} visible={playing} isPlaying={playing} onLoop={setPlaying.bind(null, false)}></AnimatedSheetCount_Explosion>
}