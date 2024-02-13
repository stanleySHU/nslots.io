import { Layer } from "common/components/layer";
import { SpriteAtlas } from "common/components/sprite";
import { GameStatusModel, KBossStatus, KGameStep } from "../status/type";
import { BitmapText, useTick } from "@pixi/react";
import { R_Font_Gold, R_Font_Rb, R_Font_Red, R_Font_Silver } from "@/assets";
import { useEffect, useMemo, useRef, useState } from "react";
import { toComma } from "common/util/amount";
import { MaskLayer } from "common/components/maskLayer";
import { Rectangle } from "common/components/rectangle";
import { Tween } from "common/components/tween";
import { Label } from "common/components/text";
import { R_Uncomponents } from "common/assets";
import { atLast } from "common/util/array";
import { I_POINTS_LIST, I_POINTS_ODD_LIST } from "./config";
import { Sound } from "common/components/sound";
import { AnimatedSheet_Coins } from "./base";
import { Easing } from "@tweenjs/tween.js";

const I_QAUGE_Y = [555, 517, 490, 450, 385, 292, 193, 93, 27];
const IPointUpTweemTime = 200;

export function PointBar({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, gameStatus, gameStep } = dataSource.base!;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{ lastPoints: number, descPoints: number, coins: { updated: boolean, points: number[], ys: number[] } }>({ lastPoints: 0, descPoints: 0, coins: { updated: false, points: [], ys: [] } });
    const betAmount = state.spin.betAmount.toNumber();
    const points = Math.min(dataSource.points!.accPoints || 0, atLast(I_POINTS_LIST));
    const isExistSpinModel = state.spin.spinModel != null;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;
    const isInBossBattle = gameStep == KGameStep.InBossBattle && false;
    
    const amounts = useMemo(() => {
        return I_POINTS_ODD_LIST.map(v => toComma(v * betAmount));
    }, [betAmount])

    function calY(points: number): [number, number, number] {
        let index = 0;
        for (let i = 1; i < I_POINTS_LIST.length; i++) {
            if (I_POINTS_LIST[i] >= points) {
                index = i - 1;
                break;
            }
        }
        const minPoint = I_POINTS_LIST[index], maxPoint = I_POINTS_LIST[index + 1],
            minY = I_QAUGE_Y[index], maxY = I_QAUGE_Y[index + 1];
        return [minY - (minY - maxY) * (points - minPoint) / (maxPoint - minPoint), minPoint, minY];
    }

    function calPointsBy(y: number): number {
        let index = 0;
        for (let i = 0; i < I_QAUGE_Y.length; i++) {
            if (y >= I_QAUGE_Y[i]) {
                index = Math.max(0, i - 1);
                break;
            }
        }
        const minPoint = I_POINTS_LIST[index], maxPoint = I_POINTS_LIST[index + 1],
            minY = I_QAUGE_Y[index], maxY = I_QAUGE_Y[index + 1];
        const points = minPoint + (maxPoint - minPoint) * (minY - y) / (minY - maxY);
        return points;
    }

    function calShowCoin(points: number, y: number) {
        let _point: number;
        if (current.descPoints < 5) {
            _point = Math.round(points * 2);
        } else if (current.descPoints < 8) {
            _point = Math.round(points * 1.5);
        } else if (current.descPoints < 14) {
            _point = Math.round(points);
        } else if (current.descPoints < 30) {
            _point = Math.round(points / 2);
        } else if (current.descPoints < 50) {
            _point = Math.round(points / 3);
        } else {
            _point = Math.round(points / 4);
        }
        if (_point != 0 && current.coins.points.indexOf(_point) == -1) {
            current.coins.points.push(_point);
            current.coins.ys.push(y);
            current.coins.updated = true;
            // setForceUpdate(!forceUpdate);
        }
    }

    const [isPointIncrease, IPointChangedTweemTime] = useMemo(() => {
        const isIncrease = points > current.lastPoints;
        let time = IPointUpTweemTime;
        if (!isIncrease) {
            if (current.lastPoints > 25) {
                time = 2000;
            } else if (current.lastPoints > 15) {
                time = 1600;
            } else {
                time = 1200;
            }
        }
        return [isIncrease, time]
    }, [points]);

    const [currentY, nextY, minPoints, minY] = useMemo(() => {
        let _currentY = 0, _nextY = 0, _minPoints = 0, _minY, _point = Math.min(points, atLast(I_POINTS_LIST));
        [_currentY] = calY(current.lastPoints);
        [_nextY, _minPoints, _minY] = calY(points);
        if (_point == 0) {
            current.descPoints = current.lastPoints;
        }
        current.lastPoints = _point;
        return [_currentY, _nextY, _minPoints, _minY]
    }, [points]);

    useEffect(() => {
        current.coins.points = [];
        current.coins.ys = [];
    }, [points]);

    useTick(() => {
        if (current.coins.updated) {
            current.coins.updated = false;
            setForceUpdate(!forceUpdate);
        }
    }, true)

    return (
        <Layer x={504.5} y={60} visible={isInShipBattle || isInBossBattle}>
            <SpriteAtlas x={2} y={3} name={`slider/milestonemeter_back.png`}></SpriteAtlas>

            <Tween dep={[points]} from={{ k: 0 }} to={{ k: 1 }} duration={IPointChangedTweemTime} playing={true}>
                {
                    ({ k }) => {
                        const y = currentY + (nextY - currentY) * k;
                        return (
                            <MaskLayer x={8} y={8}>
                                <SpriteAtlas res={R_Uncomponents} name={`milestonemeter_gauge.png`}></SpriteAtlas>
                                <Rectangle y={y} frame={[0, 0, 30, 555]}></Rectangle>
                            </MaskLayer>
                        )
                    }
                }
            </Tween>
            <SpriteAtlas name={`slider/milestonemeter_frame.png`}></SpriteAtlas>
            <SpriteAtlas x={6} y={565} name={`slider/milestonelabel.png`}></SpriteAtlas>
            <Layer>
                <Layer x={5} y={11}>
                    <BitmapText anchor={[1, 0]} text={amounts[8]} style={{ fontName: R_Font_Rb, fontSize: 70, letterSpacing: -19 }} />
                    <BitmapText x={-43} y={27} text={`WIN`} style={{ fontName: R_Font_Rb, fontSize: 50, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={88}>
                    <BitmapText anchor={[1, 0]} text={amounts[7]} style={{ fontName: R_Font_Gold, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-36} y={18} text={`WIN`} style={{ fontName: R_Font_Rb, fontSize: 50, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={186}>
                    <BitmapText anchor={[1, 0]} text={amounts[6]} style={{ fontName: R_Font_Gold, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-36} y={18} text={`WIN`} style={{ fontName: R_Font_Rb, fontSize: 50, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={285}>
                    <BitmapText anchor={[1, 0]} text={amounts[5]} style={{ fontName: R_Font_Gold, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-32} y={18} text={`WIN`} style={{ fontName: R_Font_Rb, fontSize: 45, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={376}>
                    <BitmapText anchor={[1, 0]} text={amounts[4]} style={{ fontName: R_Font_Gold, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-28} y={18} text={`WIN`} style={{ fontName: R_Font_Rb, fontSize: 40, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={442}>
                    <BitmapText anchor={[1, 0]} text={amounts[3]} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-26} y={17} text={`WIN`} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={482}>
                    <BitmapText anchor={[1, 0]} text={amounts[2]} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-25} y={17} text={`WIN`} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={515}>
                    <BitmapText anchor={[1, 0]} text={amounts[1]} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -6 }} />
                    <BitmapText x={-25} y={17} text={`WIN`} style={{ fontName: R_Font_Silver, fontSize: 70, letterSpacing: -10 }} />
                </Layer>
                <Layer x={-3} y={555}>
                    <BitmapText anchor={[1, 0]} text={amounts[0]} style={{ fontName: R_Font_Red, fontSize: 50, letterSpacing: 0 }} />
                </Layer>
            </Layer>
            <Tween dep={[points]} from={{ k: 0 }} to={{ k: 1 }} duration={isExistSpinModel ? IPointChangedTweemTime : 0} playing={isInShipBattle || isInBossBattle}>
                {
                    ({ k }) => {
                        const y = currentY + (nextY - currentY) * k;
                        let points = calPointsBy(y);
                        const playing = points > 0 && k > 0;
                        const points_show = Math.round(points);
                        const playingIncrease = playing && isPointIncrease;
                        const playingUnIncrease = playing && !isPointIncrease;
                        !isPointIncrease && isExistSpinModel && calShowCoin(points, y);
                        return (
                            <Layer x={-62.5} y={y}>
                                <SpriteAtlas name={`slider/milestone_pointer.png`}></SpriteAtlas>
                                <Label x={37} y={20} anchor={0.5} text={points_show >= atLast(I_POINTS_LIST) ? 'MAX' : `${points_show}pt`} style={{ align: 'center', fill: '#FFFFFF', fontSize: 16, dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }}></Label>
                                {/* <ParticleEmitter x={40} y={10} playing={playingUnIncrease} visible={playingUnIncrease} config={WIN_SHIP_NORMAL_WIN_PARTICLE}></ParticleEmitter> */}
                                <Sound sound={'point_bar_increase'} playing={playingIncrease && isExistSpinModel} allowStop={false}></Sound>
                                <Sound sound={`point_bar_sub`} playing={playingUnIncrease && isExistSpinModel}></Sound>
                            </Layer>
                        )
                    }
                }
            </Tween>
            <Tween dep={[minPoints]} from={{ k: 0 }} to={{ k: 1 }} duration={750} delay={IPointChangedTweemTime} playing={I_POINTS_LIST.indexOf(minPoints) > 0}>
                {
                    ({ k }) => {
                        const alpha = Math.sin(Math.PI * k) * 0.72;
                        return <SpriteAtlas x={-470} y={minY} alpha={alpha} pivot={[0, -6]} scale={2} anchor={[0, 1]} name={`slider/milestone_rainbow.png`}></SpriteAtlas>
                    }
                }
            </Tween>
            {
                current.coins.ys.map((startY, index) => {
                    return (
                        <Tween key={`coinT${index}`} from={{ k: 0 }} to={{ k: 1 }} duration={1000} playing={true} repeat={0}>
                            {
                                ({ k }) => {
                                    const x = -465 * k + 15;
                                    const y = startY + -10 - (startY + 50) * Easing.Quadratic.InOut(k) + 15;
                                    const scale = 0.6 + 0.9 * k;
                                    return <AnimatedSheet_Coins x={x} y={y} scale={scale} anchor={0.5} isPlaying={true} visible={k != 1}></AnimatedSheet_Coins>
                                }
                            }
                        </Tween>
                    )
                })
            }
        </Layer>
    )
}
