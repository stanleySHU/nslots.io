import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Easing } from "@tweenjs/tween.js";
import { Tween } from "common/components/tween";
import { SpriteAtlas } from "common/components/sprite";
import { Sound } from "common/components/sound";
import { ComponentProps, useMemo, useState } from "react";
import { GOLD_BULLET_PNG_NAME, IRON_BULLET_PNG_NAME, I_PLAYER_CANNON_HIT_BOSS_DURATION, I_PLAYER_CANNON_HIT_CAPTION_DURATION, I_PLAYER_CANNON_HIT_OTHERSHIP_DURATION, I_PLAYER_CANNON_HIT_SHIP_DURATION } from "./config";
import { BLEND_MODES, IPointData } from "pixi.js";
import { Parabola } from "common/util/math";
import { getShipPoint } from "./fleet";
import { getCannonBulletPoint } from "./cannon";

export function Bullet({ dataSource }: { dataSource: GameStatusModel }) {
    const { bulletHitCaptialMap, bulletHitShipMap, bulletHitOtherShipMap } = dataSource.bullet!;
    const { showCannonId } = dataSource.cannon!;

    return (
        <Layer>
            <Layer>
                {
                    Object.keys(bulletHitShipMap).map((inColumn, index) => {
                        const column = Number(inColumn);
                        const item = bulletHitShipMap[column];
                        const { delay, targetPoints, isGold, isFromLong, gunInRow } = item;
                        const startPoint = getCannonBulletPoint(column, gunInRow, isFromLong);
                        const endPoint = getShipPoint(targetPoints!.x, targetPoints!.y);
                        return <BulletHitShip key={`hitShip${showCannonId}${index}`} delay={delay} shipInRow={targetPoints!.y} isGold={isGold} startPoint={startPoint} endPoint={endPoint}></BulletHitShip>
                    })
                }
            </Layer>
            <Layer>
                {
                    Object.keys(bulletHitCaptialMap).map((inColumn, index) => {
                        const column = Number(inColumn);
                        const item = bulletHitCaptialMap[column];
                        const { delay, isGold, isFromLong, gunInRow } = item;
                        const startPoint = getCannonBulletPoint(column, gunInRow, isFromLong);
                        return <BulletHitCaptain key={`hitCaptial${showCannonId}${index}`} delay={delay} distance={5} isGold={isGold} startPoint={startPoint}></BulletHitCaptain>
                    })
                }
            </Layer>
            <Layer>
                {
                    Object.keys(bulletHitOtherShipMap).map((inColumn, index) => {
                        const column = Number(inColumn);
                        const item = bulletHitOtherShipMap[column];
                        const { delay, targetPoints } = item;
                        return <BulletHitOtherShip key={`hitOtherShip${showCannonId}${index}`} delay={delay} targetPoint={targetPoints!}></BulletHitOtherShip>
                    })
                }
            </Layer>
        </Layer>
    )
}

// export function 

export function BulletHitShip({ delay, shipInRow, isGold, startPoint, endPoint, ...layerProps }: ComponentProps<typeof Layer> & { delay: number, shipInRow: number, isGold: boolean, startPoint: number[], endPoint: number[] }) {
    const [step, setStep] = useState<'explode' | 'idle'>('idle');

    const png = useMemo(() => {
        return isGold ? GOLD_BULLET_PNG_NAME : IRON_BULLET_PNG_NAME;
    }, [isGold])

    const [startX, startY] = startPoint;
    const [endX, endY] = endPoint;
    const [offsetX, offsetY] = [startX - endX, startY - endY];

    const [midX, midY] = [startX - offsetX * 0.6, startY - (offsetY + [70, 60, 50, 40, 30, 20][shipInRow])];

    const [offset1X, offset1Y] = [startX - midX, startY - midY];
    const [offset2X, offset2Y] = [midX - endX, midY - endY];
    const [scale1, scale2] = [0.7 - 0.15 * shipInRow, 0.5 - 0.12 * shipInRow];

    const offset1Time = 0.5;
    const offset2Time = 1 - offset1Time;

    function cal(k: number): [number, number, number] {
        let scale = 1, x, y;
        if (k < offset1Time) {
            const k1 = k * (1 / offset1Time), k2 = Easing.Quadratic.Out(k1);
            scale = 1 - (1 - scale1) * k2;
            x = startX - offset1X * k1;
            y = startY - offset1Y * k2;
        } else {
            const k1 = (k - offset1Time) * (1 / offset2Time), k2 = Easing.Cubic.In(k1);
            scale = scale1 - (scale1 - scale2) * k2;
            x = midX - offset2X * k1;
            y = midY - offset2Y * k2;
        }
        return [scale, x, y];
    }

    function onTween1Complete() {
        setStep('explode');
    }

    return (
        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={133} easing={Easing.Cubic.Out} playing={step == 'explode'}>
            {
                ({ k }) => {
                    const alpha = 1 - k;
                    const _scale = 1 + 0.7 * k;

                    return <Tween from={{ k: 0 }} to={{ k: 1 }} duration={I_PLAYER_CANNON_HIT_SHIP_DURATION} playing={true} repeat={0} onComplete={onTween1Complete} delay={delay}>
                        {
                            ({ k }) => {
                                const [scale, x, y] = cal(k);
                                return (
                                    <Layer {...layerProps} x={x} y={y} scale={scale * _scale} alpha={alpha} visible={k != 0}>
                                        <SpriteAtlas scale={0.2} name={png} anchor={0.5}></SpriteAtlas>
                                        <Sound sound='shoot' playing={k > 0} allowStop={false}></Sound>
                                    </Layer>
                                )
                            }
                        }
                    </Tween>
                }
            }
        </Tween>
    )
}

export function BulletHitCaptain({ delay, distance, isGold, startPoint, ...layerProps }: ComponentProps<typeof Layer> & { delay: number, distance: number, isGold: boolean, startPoint: number[] }) {
    const png = useMemo(() => {
        return isGold ? GOLD_BULLET_PNG_NAME : IRON_BULLET_PNG_NAME;
    }, [isGold])
    distance = Math.min(4, distance);

    const [startX, startY] = startPoint;
    const [endX, endY] = [270, 155]
    const [offsetX, offsetY] = [startX - endX, startY - endY];

    const [midX, midY] = [startX - offsetX * 0.6, startY - (offsetY + [70, 85, 100, 150, 130][distance])];

    const [offset1X, offset1Y] = [startX - midX, startY - midY];
    const [offset2X, offset2Y] = [midX - endX, midY - endY];
    const [scale1, scale2] = [0.8 - 0.12 * distance, 0.6 - 0.1 * distance];

    const offset1Time = 0.4;
    const offset2Time = 1 - offset1Time;

    function cal(k: number): [number, number, number] {
        let scale = 1, x, y;
        if (k < offset1Time) {
            const k1 = k * (1 / offset1Time), k2 = Easing.Quadratic.Out(k1);
            scale = 1 - (1 - scale1) * k2;
            x = startX - offset1X * k1;
            y = startY - offset1Y * k2;
        } else {
            const k1 = (k - offset1Time) * (1 / offset2Time), k2 = Easing.Cubic.In(k1);
            scale = scale1 - (scale1 - scale2) * k2;
            x = midX - offset2X * k1;
            y = midY - offset2Y * k2;
        }
        return [scale, x, y];
    }

    return (
        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={I_PLAYER_CANNON_HIT_CAPTION_DURATION} playing={true} repeat={0} delay={delay}>
            {
                ({ k }) => {
                    const [scale, x, y] = cal(k);
                    return (
                        <Layer {...layerProps} x={x} y={y} scale={scale} visible={k < 1 && k > 0}>
                            <SpriteAtlas scale={0.2} name={png} anchor={0.5}></SpriteAtlas>
                            <Sound sound='shoot' playing={k > 0} allowStop={false}></Sound>
                        </Layer>
                    )
                }
            }
        </Tween>
    )
}

export function BulletHitOtherShip({ targetPoint, delay }: { targetPoint: IPointData, delay: number }) {
    const startPoint = getShipPoint(targetPoint.x, targetPoint.y);
    const [startX, startY] = startPoint;

    let leftTargetX: number, leftTargetY: number, rightTargetX: number, rightTargetY: number, frontTargetX: number, frontTargetY: number;

    [frontTargetX, frontTargetY] = getShipPoint(targetPoint.x, targetPoint.y + 1);
    if (targetPoint.x == 0) {
        [rightTargetX, rightTargetY] = getShipPoint(targetPoint.x + 1, targetPoint.y);
        [leftTargetX, leftTargetY] = [startX - (rightTargetX - startX), rightTargetY]
    } else if (targetPoint.x == 2) {
        [leftTargetX, leftTargetY] = getShipPoint(targetPoint.x - 1, targetPoint.y);
        [rightTargetX, rightTargetY] = [startX + (startX - leftTargetX), leftTargetY]
    } else {
        [rightTargetX, rightTargetY] = getShipPoint(targetPoint.x + 1, targetPoint.y);
        [leftTargetX, leftTargetY] = getShipPoint(targetPoint.x - 1, targetPoint.y);
    }

    const [leftOffsetX, leftOffsetY] = [startX - leftTargetX!, startY - leftTargetY!];
    const [rightOffsetX, rightOffsetY] = [startX - rightTargetX!, startY - rightTargetY!];
    const [frontOffsetX, frontOffsetY] = [startX - frontTargetX!, startY - frontTargetY!];

    const parabola = Parabola.withVertex([0.5, 0.33]);
    return (
        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={I_PLAYER_CANNON_HIT_OTHERSHIP_DURATION} playing={true} repeat={0} delay={delay}>
            {
                ({ k }) => {
                    let leftX = 0, leftY = 0, leftScale = 0.33, rightX = 0, rightY = 0, rightScale = 0.33, frontX = 0, frontY = 0, frontScale = 0.33;
                    rightX = rightOffsetX * k, leftX = leftOffsetX * k, frontY = -frontOffsetY * k;
                    const _k = parabola(k);
                    leftY = -_k * leftOffsetX + leftOffsetY * k;
                    rightY = _k * rightOffsetX + rightOffsetY * k;
                    frontX = -_k * frontOffsetY + frontOffsetX * k;
                    return (
                        <Layer x={startX} y={startY} visible={k > 0 && k < 1}>
                            <SpriteAtlas blendMode={BLEND_MODES.SCREEN} x={leftX} y={leftY} visible={true} scale={leftScale} name={'shipmeter_fx.png'} anchor={0.5}></SpriteAtlas>
                            <SpriteAtlas blendMode={BLEND_MODES.SCREEN} x={rightX} y={rightY} visible={true} scale={rightScale} name={'shipmeter_fx.png'} anchor={0.5}></SpriteAtlas>
                            <SpriteAtlas blendMode={BLEND_MODES.SCREEN} x={frontX} y={frontY} visible={true} scale={frontScale} name={'shipmeter_fx.png'} anchor={0.5}></SpriteAtlas>
                        </Layer>
                    )
                }
            }
        </Tween>
    )
}