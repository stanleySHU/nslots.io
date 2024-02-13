import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { ISpine_Cannon, Spine_CannonCount } from "./base";
import { isLongCannon } from "./utils";
import { Tween } from "common/components/tween";
import { Polygon } from "common/components/polygon";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { useDelayFrameOnce } from "common/components/customhook";
import { Spine } from "pixi-spine";
import { Graphics } from "pixi.js";

export const ICannonPointMap: { [key: string]: [number, number] } = {
    '00Short': [85, 720],
    '01Short': [85, 785],
    '00Long': [85, 770],
    '10Short': [175, 710],
    '11Short': [175, 775],
    '10Long': [175, 760],
    '20Short': [270, 705],
    '21Short': [270, 770],
    '20Long': [270, 755],
    '30Short': [365, 710],
    '31Short': [365, 775],
    '30Long': [365, 760],
    '40Short': [455, 720],
    '41Short': [455, 785],
    '40Long': [455, 770],
}

export const ICannonBulletPointMap: { [key: string]: [number, number] } = {
    '00Short': [85, 720],
    '01Short': [85, 785],
    '00Long': [85, 770],
    '10Short': [158, 610],
    '11Short': [158, 675],
    '10Long': [175, 625],
    '20Short': [270, 600],
    '21Short': [270, 665],
    '20Long': [270, 615],
    '30Short': [368, 610],
    '31Short': [368, 675],
    '30Long': [342, 625],
    '40Short': [455, 720],
    '41Short': [455, 785],
    '40Long': [455, 770]
}

function getPoint(obj: { [key: string]: [number, number] }, inColumn: number, row: number, isLong: boolean) {
    const type = isLong ? 'Long' : 'Short';
    const key = `${inColumn}${row}${type}`;
    return obj[key];
}

function getCannonPoint(inColumn: number, row: number, isLong: boolean) {
    return getPoint(ICannonPointMap, inColumn, row, isLong);
}

export function getCannonBulletPoint(inColumn: number, row: number, isLong: boolean) {
    return getPoint(ICannonBulletPointMap, inColumn, row, isLong);
}

const ILongRotation = [15 / 180, 5 / 180, 0, -5 / 180, -15 / 180].map(e => e * Math.PI);
const IShortRotation = [5 / 180, -5 / 180, 0, 5 / 180, -5 / 180].map(e => e * Math.PI);
const IBossBattleRotation = [5 / 180, 3 / 180, 0, -3 / 180, -5 / 180].map(e => e * Math.PI);

export function Cannon({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, gameStep } = dataSource.base!;
    const { csMap, showCannonId } = dataSource.cannon!;

    return (
        <Layer>
            {
                Object.keys(csMap).map((inColumn, index) => {
                    const column = Number(inColumn);
                    const item = csMap[column];
                    const row = item.rows[0];
                    const cannonId = item.cannonId;
                    const isLong = isLongCannon(cannonId);
                    const point = getCannonPoint(column, row, isLong);
                    return (
                        <Tween key={`cannon${showCannonId}_${index}`} from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={true}>
                            {
                                ({ k }) => {
                                    let rotation = 0;
                                    if (gameStep == KGameStep.InBossBattle) {
                                        rotation = IBossBattleRotation[column];
                                    } else {
                                        if (isLong) {
                                            rotation = ILongRotation[column];
                                        } else {
                                            rotation = IShortRotation[column];
                                        }
                                    }
                                    rotation *= k;
                                    return (
                                        <Layer>
                                            <SpineCannonCountDelay delay={item.delay} rotation={rotation} x={point[0]} y={point[1]} scale={0.33} cannonId={cannonId}></SpineCannonCountDelay>
                                        </Layer>
                                    )
                                }
                            }
                        </Tween>
                    )

                })
            }
        </Layer>
    )
}

export function SpineCannonCountDelay({ delay, cannonId, ...props }: ComponentProps<typeof Spine_CannonCount> & { delay: number, cannonId: number }) {
    const spine = useRef<Spine>(null);
    const pol = useRef<Graphics>(null);
    const [playing, setPlaying] = useState(false);

    const actions = useMemo<[number, ISpine_Cannon, boolean][]>(() => {
        return {
            9: [[0, 'MDGOLD2cannoncombine0', false], [0, 'MDGOLD2cannonsshoot0', false], [0, 'MDGOLD2cannons_disassemble0', false]],
            90: [[0, 'MDGOLD3cannoncombine0', false], [0, 'MDGOLD3cannonsshoot0', false], [0, 'MDGOLD3cannons_disassemble0', false]],
            1: [[0, 'MDNORMAL2cannoncombine0', false], [0, 'MDNORMAL2cannonsshoot0', false], [0, 'MDNORMAL2cannons_disassemble0', false]],
            10: [[0, 'MDNORMAL3cannoncombine0', false], [0, 'MDNORMAL3cannonsshoot0', false], [0, 'MDNORMAL3cannons_disassemble0', false]]
        }[cannonId]
    }, [cannonId])

    useEffect(() => {
        if (spine.current && pol.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('canon_square')];
            slot.addChild(pol.current);
            pol.current.position.set(500, 0)
        }
    }, [spine]);

    useDelayFrameOnce(() => {
        setPlaying(true);
    }, delay, !playing);

    return <Layer>
        <Spine_CannonCount ref={spine} actions={actions} playing={playing} {...props}></Spine_CannonCount>
        <Polygon ref={pol} path={[[0, -200], [-10, 0], [20, 0], [10, -200]]} rotation={Math.PI / 2} scale={3} color={0xeeeeee} alpha={0.32}></Polygon>
    </Layer>
}