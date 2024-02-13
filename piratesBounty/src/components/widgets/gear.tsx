import { useTick } from "@pixi/react";
import { Speed } from "common/util/math";
import { Children, ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { randomInArr } from "common/util/array";
import { Layer } from "common/components/layer";
import { SpriteAtlas } from "common/components/sprite";
import { Tween } from "common/components/tween";
import { R_Gear } from "@/assets";
import { Barrel } from "./barrel";
import { pad } from "common/util/string";
import { useDelayFrameOnce, useFrame } from "common/components/customhook";
import { action_spinStop } from "common/model/spin";
import { BlurFilter } from 'common/components/filters/blurFilter'
import { MotionBlurFilter } from 'common/components/filters/motionBlurFilter'
import { I_SYMBOL_FREE, I_SYMBOL_SUPER_FREE } from "./config";
import { Sound } from "common/components/sound";
import { AnimatedSheet_GearFire } from "./base";

const Reel0Arr = [0, 0, 6, 0, 6, 0, 6, 6, 6, 0]; //Gun; Gun; Blank; Gun; Blank; GGun; Blank; Blank; Blank; Gun 
const Reel1Arr = [2, 1, 6, 2, 6, 0, 4, 5, 6, 1, 2];    //Base; Barrel; Blank;Base;Blank;Gun;GBarrel;GBase;Blank;Barrel;Base
const Reel2Arr = [2, 6, 6, 6, 5, 6, 6, 6, 6, 2];    //Base;Blank;Blank;Blank;GBase;Blank;Blank;Blank;Blank;Base
const ReelArrs = [Reel0Arr, Reel1Arr, Reel2Arr];

// 20, 175, 10, 10
// const startSpeed = 20;
// const endSpeed = 175;
// const speedUpTime = 10;
// const speedDownTime = 10;
// const frame = 12;


// const startSpeed = 40;
// const endSpeed = 300;
// const speedUpTime = 10;
// const speedDownTime = 10;
// const frame = 12;

// const SpeedUp = (time: number) => Speed.up(startSpeed, endSpeed, speedUpTime, time);
// const ISpeedUp = SpeedUp(speedUpTime);
// const SpeedDown = (time: number) => Speed.down(endSpeed, startSpeed, speedDownTime, time);
// const ISpeedDown = SpeedDown(speedDownTime);

export function SubGearController({
    leftDirector, onUpdate, playing, stopping, result, reel, onEnd, fast, existFreeSpin
}: { fast: boolean, existFreeSpin: boolean, onUpdate: (frame: number, ss: number[]) => void, leftDirector: boolean, playing: boolean, stopping: boolean, result: number[], reel: number, onEnd: () => void }) {
    const { current } = useRef<{
        lastK: number, speedStoppingTime: number, spinTime: number, updateTime: number, ss: number[], endK: number
    }>({ lastK: 0, speedStoppingTime: 0, spinTime: 0, updateTime: 0, ss: [6, ...result, 6], endK: 0 });
    const [step, setStep] = useState<'idle' | 'spin' | 'stopping'>('idle');

    const [startSpeed, endSpeed, speedUpTime, speedDownTime, frame] = [0, 155, 50, 50, 12];

    const [SpeedUp, ISpeedUp, SpeedDown, ISpeedDown] = useMemo<[(e: number) => number, number, (e: number) => number, number]>(() => {
        const _SpeedUp = (time: number) => Speed.up(startSpeed, endSpeed, speedUpTime, time),
            _SpeedDown = (time: number) => Speed.down(endSpeed, startSpeed, speedDownTime, time);

        return [
            (time: number) => Speed.up(startSpeed, endSpeed, speedUpTime, time),
            _SpeedUp(speedUpTime),
            (time: number) => Speed.down(endSpeed, startSpeed, speedDownTime, time),
            _SpeedDown(speedDownTime)
        ];
    }, [fast, existFreeSpin])

    function updateForLeft(frame: number, k: number, updateS: boolean) {
        const t = current.endK - k - 1
        if (updateS) {
            let s;
            if (t < 5 && t >= 0) {
                s = result[4 - t];
            } else {
                s = randomInArr(ReelArrs[reel]);
            }
            current.ss.shift();
            current.ss.push(s);
        }

        onUpdate(Math.round(frame), current.ss);
    }

    function updateForRight(frame: number, k: number, updateS: boolean) {
        const t = current.endK - k - 2
        if (updateS) {
            let s;
            if (t < 5 && t >= 0) {
                s = result[t];
            } else {
                s = randomInArr(Reel1Arr);
            }
            current.ss.pop();
            current.ss.unshift(s);
        }

        onUpdate(Math.round(frame), current.ss);
    }

    function cal() {
        let k = 0;
        const spinTime = current.spinTime;
        if (spinTime < speedUpTime) {
            k = SpeedUp(spinTime);
        } else if (stopping && speedUpTime > current.speedStoppingTime) {
            k = ISpeedUp + endSpeed * (current.speedStoppingTime - speedUpTime) / 1000 + SpeedDown(Math.min(speedDownTime, spinTime - current.speedStoppingTime));
        } else if (playing) {
            k = ISpeedUp + endSpeed * (spinTime - speedUpTime) / 1000;
        }

        let end = false;
        if (step == 'stopping' && Math.floor(k) >= current.endK) {
            k = current.endK;
            end = true;
        }

        const frameK = k;
        const lastFramne = Math.floor(current.lastK) % frame, currentFrame = Math.floor(frameK) % frame;
        current.lastK = frameK;

        if (leftDirector) {
            const lastLeftFrame = lastFramne, currentLeftFrame = currentFrame;
            updateForLeft(currentLeftFrame, Math.floor(k), currentLeftFrame < lastLeftFrame);
        } else {
            const lastRightFrame = lastFramne == 0 ? 0 : frame - lastFramne, currentRightFrame = currentFrame == 0 ? 0 : frame - currentFrame;
            updateForRight(currentRightFrame, Math.floor(k), currentRightFrame > lastRightFrame);
        }

        if (end) {
            current.ss.splice(1, 5, ...result);
            onUpdate(0, current.ss);

            setStep('idle');
            onEnd();
        }
    }

    function checkStopping() {
        if (stopping && step != 'stopping' && current.spinTime >= speedUpTime) {
            setStep('stopping');
        }
    }

    useMemo(() => {
        onUpdate(0, current.ss);
    }, []);

    useMemo(() => {
        if (stopping) {
            const currentK = SpeedUp(current.spinTime);
            let t = Math.max(0, 60 - Math.max(0, ISpeedUp - currentK) - ISpeedDown) * 1000 / endSpeed;
            if (current.spinTime - speedUpTime >= t) t = 0;
            current.speedStoppingTime = Math.max(current.spinTime, speedUpTime) + t + (existFreeSpin ? 2000 : 0);
            current.endK = Math.floor((ISpeedUp + endSpeed * (current.speedStoppingTime - speedUpTime) / 1000 + ISpeedDown));
        }
    }, [stopping]);

    useMemo(() => {
        if (playing) {
            current.spinTime = 0;
            setStep('spin');
        }
    }, [playing]);

    useTick((delta, ticker) => {
        current.spinTime += ticker.elapsedMS;
        checkStopping();
        cal();
    }, step == 'spin' || step == 'stopping');
    return <></>
}

export function Gear({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, nextGameStatus, state, dispatch } = dataSource.base!;
    const { inFS } = dataSource.fs!;
    const { respinReels, activeReels } = dataSource.gear!;
    const { spinModel } = state.spin!;
    const { current } = useRef<{
        reelMap: { [key: number]: { frame: number, ss: number[] } },
        endReels: number[],
        inFreeSpin: boolean,
    }>(
        {
            reelMap: {
                0: { frame: 0, ss: [] }, 1: { frame: 0, ss: [] }, 2: { frame: 0, ss: [] },
            },
            endReels: [],
            inFreeSpin: false
        });
    const [forceUpdate, setForceUpdate] = useState(false);
    const [endFreeSpin, setEndFreeSpin] = useState(false);
    const isSpin = gameStatus == 'spin',
        isStopping = gameStatus == 'stopping',
        isPlaying = isSpin || isStopping;

    const ss = spinModel?.ss || [[], [], []];

    function onUpdate(reel: number, frame: number, ss: number[]) {
        current.reelMap[reel] = {
            frame: frame,
            ss: [...ss]
        }
    }

    //active gear
    const activeReel0 = activeReels.indexOf(0) >= 0, activeReel1 = activeReels.indexOf(1) >= 0, activeReel2 = activeReels.indexOf(2) >= 0;
    const spinReels0 = respinReels.indexOf(0) >= 0, spinReels1 = respinReels.indexOf(1) >= 0, spinReels2 = respinReels.indexOf(2) >= 0;

    function onEnd(reel: number) {
        current.endReels.push(reel);
        if (current.endReels.length == respinReels.length || (respinReels.length == 0 && current.endReels.length == 3)) {
            dispatch(action_spinStop());
        }
    }

    useFrame(33, () => {
        setForceUpdate(!forceUpdate);
    }, isPlaying);

    useDelayFrameOnce(() => {
        current.inFreeSpin = true;
        setForceUpdate(!forceUpdate);
    }, 800, !current.inFreeSpin && gameStatus == KCurrentGameStatus.showGateOpen)

    useMemo(() => {
        if (!inFS && current.inFreeSpin) {
            setEndFreeSpin(true);
        }
    }, [inFS])

    useDelayFrameOnce(() => {
        current.inFreeSpin = false;
        setEndFreeSpin(false);
    }, 600, endFreeSpin && current.inFreeSpin)

    let { frame: frame0, ss: ss0 } = current.reelMap[0];
    let { frame: frame1, ss: ss1 } = current.reelMap[1];
    let { frame: frame2, ss: ss2 } = current.reelMap[2];
    const _frame0 = pad(frame0 + 1, 2);
    const _frame1 = pad(frame1 + 1, 2);
    const _frame2 = pad(frame2 + 1, 2);

    useMemo(() => {
        current.endReels = [];
    }, [isSpin])

    useMemo(() => {
        if (inFS) {
            current.inFreeSpin = true;
        }
    }, [])

    const [existFreeSpinInReel0, existFreeSpinInReel1, existFreeSpinInReel2] = useMemo<[boolean, boolean, boolean]>(() => {
        if (isStopping) {
            return [
                ss[0].indexOf(I_SYMBOL_FREE) >= 0 || ss[0].indexOf(I_SYMBOL_SUPER_FREE) >= 0,
                ss[1].indexOf(I_SYMBOL_FREE) >= 0 || ss[1].indexOf(I_SYMBOL_SUPER_FREE) >= 0,
                ss[2].indexOf(I_SYMBOL_FREE) >= 0 || ss[2].indexOf(I_SYMBOL_SUPER_FREE) >= 0,
            ];
        }
        return [false, false, false];
    }, [isStopping]);

    const gearType = current.inFreeSpin ? 'Gold' : 'Bronze';

    const reel0End = current.endReels.indexOf(0) >= 0;
    const reel1End = current.endReels.indexOf(1) >= 0;
    const reel2End = current.endReels.indexOf(2) >= 0;

    return (
        <Layer>
            <>
                <SubGearController existFreeSpin={existFreeSpinInReel0} fast={inFS!} reel={0} result={ss[0]} leftDirector={true} onUpdate={onUpdate.bind(null, 0)} onEnd={onEnd.bind(null, 0)} playing={spinReels0} stopping={spinReels0 && isStopping}></SubGearController>
                <SubGearController existFreeSpin={existFreeSpinInReel1} fast={inFS!} reel={1} result={ss[1]} leftDirector={false} onUpdate={onUpdate.bind(null, 1)} onEnd={onEnd.bind(null, 1)} playing={spinReels1} stopping={spinReels1 && isStopping}></SubGearController>
                <SubGearController existFreeSpin={existFreeSpinInReel2} fast={inFS!} reel={2} result={ss[2]} leftDirector={true} onUpdate={onUpdate.bind(null, 2)} onEnd={onEnd.bind(null, 2)} playing={spinReels2} stopping={spinReels2 && isStopping}></SubGearController>
            </>
            <Sound sound="reel_stop" playing={reel0End && !existFreeSpinInReel0!} allowStop={false}></Sound>
            <Sound sound="reel_stop" playing={reel1End && !existFreeSpinInReel1!} allowStop={false}></Sound>
            <Sound sound="reel_stop" playing={reel2End && !existFreeSpinInReel2!} allowStop={false}></Sound>
            <Sound sound="freegame_occ" playing={(reel0End && existFreeSpinInReel0!) || (reel1End && existFreeSpinInReel1!) || (reel2End && existFreeSpinInReel2!)} allowStop={false}></Sound>
            <Sound sound="spinFire_bgm" playing={isPlaying && (existFreeSpinInReel0! || existFreeSpinInReel1! || existFreeSpinInReel2!)} allowStop={true}></Sound>
            <Layer x={256} y={590}>
                <Layer y={60}>
                    <Layer>
                        <GearFire isPlaying={existFreeSpinInReel0} slow={false} x={-160} y={-140}></GearFire>
                        <SpriteAtlas x={15} anchor={0.5} res={R_Gear} name={`${gearType}_Gears_${_frame0}.png`}></SpriteAtlas>
                        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={activeReel0}>
                            {
                                ({ k }) => {
                                    return (
                                        <Layer>
                                            <SpriteAtlas x={15} anchor={0.5} res={R_Gear} name={`${gearType}_Arrow_${_frame0}.png`}></SpriteAtlas>
                                            <SpriteAtlas alpha={k} x={15} anchor={0.5} res={R_Gear} name={`${gearType}_ArrowGlow_${_frame0}.png`}></SpriteAtlas>
                                        </Layer>
                                    )
                                }
                            }
                        </Tween>
                        <Layer y={0}>
                            {
                                Children.map(ss0, (s, inRow) => {
                                    return <Barrel key={`symbol${inRow}`} inSpin={spinReels0} x={XS[frame0][inRow]} y={YS[frame0][inRow]} selected={s} />
                                })
                            }
                        </Layer>
                        <GearFire isPlaying={existFreeSpinInReel0} slow={true} x={-160} y={-80}></GearFire>
                    </Layer>
                    <Layer>
                        <GearFire isPlaying={existFreeSpinInReel1} slow={false} x={180} y={-80} scale={[-1, 1]}></GearFire>
                        <SpriteAtlas x={15} anchor={0.5} y={58} res={R_Gear} name={`${gearType}_Gears_${_frame1}.png`}></SpriteAtlas>
                        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={activeReel1}>
                            {
                                ({ k }) => {
                                    return (
                                        <Layer>
                                            <SpriteAtlas x={15} y={60} anchor={0.5} res={R_Gear} name={`${gearType}_ArrowR_${_frame1}.png`}></SpriteAtlas>
                                            <SpriteAtlas alpha={k} x={15} y={60} anchor={0.5} res={R_Gear} name={`${gearType}_ArrowGlowR_${_frame1}.png`}></SpriteAtlas>
                                        </Layer>
                                    )
                                }
                            }
                        </Tween>
                        <Layer y={55}>
                            {
                                Children.map(ss1, (s, inRow) => {
                                    return <Barrel key={`symbol${inRow}`} inSpin={spinReels1} x={XS[frame1][inRow]} y={YS[frame1][inRow]} selected={s} />
                                })
                            }
                        </Layer>
                        <GearFire isPlaying={existFreeSpinInReel1} slow={true} x={180} y={-20} scale={[-1, 1]}></GearFire>
                    </Layer>
                    <Layer>
                        <GearFire isPlaying={existFreeSpinInReel2} slow={false} x={-160} y={-20}></GearFire>
                        <SpriteAtlas x={15} anchor={0.5} y={116} res={R_Gear} name={`${gearType}_Gears_${_frame2}.png`}></SpriteAtlas>
                        <Tween from={{ k: 0 }} to={{ k: 1 }} duration={500} playing={activeReel2}>
                            {
                                ({ k }) => {
                                    return (
                                        <Layer>
                                            <SpriteAtlas x={15} y={120} anchor={0.5} res={R_Gear} name={`${gearType}_Arrow_${_frame2}.png`}></SpriteAtlas>
                                            <SpriteAtlas alpha={k} x={15} y={120} anchor={0.5} res={R_Gear} name={`${gearType}_ArrowGlow_${_frame2}.png`}></SpriteAtlas>
                                        </Layer>
                                    )
                                }
                            }
                        </Tween>
                        <Layer y={115}>
                            {
                                Children.map(ss2, (s, inRow) => {
                                    return <Barrel key={`symbol${inRow}`} inSpin={spinReels2} x={XS[frame2][inRow]} y={YS[frame2][inRow]} selected={s} />
                                })
                            }
                        </Layer>
                        <GearFire isPlaying={existFreeSpinInReel2} slow={true} x={-160} y={30}></GearFire>
                    </Layer>
                </Layer>
            </Layer>
        </Layer>
    )
}

export function GearFire({ slow, isPlaying, ...layerProps }: ComponentProps<typeof AnimatedSheet_GearFire> & { slow: boolean }) {
    const [playing, setPlaying] = useState(false);

    useDelayFrameOnce(() => {
        setPlaying(true);
    }, 300, isPlaying && slow && !playing);  // => 1000 * (12 / (60 * 0.33)) * (6/12 ) = 300

    useEffect(() => {
        if (!isPlaying) {
            setPlaying(false);
        } else if (!slow) {
            setPlaying(true);
        }
    }, [isPlaying]);

    return <AnimatedSheet_GearFire isPlaying={playing} visible={playing} startFrame={0} {...layerProps}></AnimatedSheet_GearFire>
}

export const XS = [
    [-250, -169, -78, 16, 109, 199, 284],
    [-258, -175, -85, 7, 101, 191, 276],
    [-264, -182, -94, -1, 93, 184, 268],
    [-270, -190, -100, -8, 86, 177, 260],
    [-277, -197, -109, -16, 78, 170, 254],
    [-283, -204, -116, -24, 70, 162, 246],
    [-290, -210, -124, -32, 62, 155, 240],
    [-299, -218, -131, -39, 55, 147, 233],
    [-304, -224, -139, -47, 47, 140, 227],
    [-310, -230, -146, -55, 39, 132, 219],
    [-321, -239, -153, -63, 31, 124, 212],
    [-1000, -245, -160, -70, 23, 115, 205]
];

export const YS = [
    [38, 18, 5, 0, 5, 18, 38],
    [40, 19, 6, 0, 4, 17, 36],
    [42, 21, 7, 0, 3, 15, 34],
    [45, 23, 9, 1, 2, 14, 32],
    [46, 24, 9, 1, 2, 13, 30],
    [48, 26, 10, 1, 1, 12, 29],
    [49, 27, 11, 1, 1, 11, 27],
    [42, 29, 12, 2, 2, 10, 26],
    [44, 31, 13, 2, 2, 9, 24],
    [46, 33, 14, 3, 2, 8, 23],
    [47, 35, 15, 3, 1, 7, 21],
    [49, 36, 16, 3, 0, 6, 20]
];