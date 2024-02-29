import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { ComponentProps, useEffect, useMemo, useRef } from "react";
import { Spine_Number } from "./base";
import { useDelayFrameOnce, useMemoConstant } from "common/components/customhook";
import { R_Gold_Font } from "@/assets";
import { Spine } from "pixi-spine";
import { BitmapText as PIXIBitmapText } from "pixi.js";
import { TweenAmountBitmapText } from "common/components/tweenAnimations";
import { ParticleEmitter } from "common/components/particleemitter";
import { get_WIN_COINS_PARTICLE, get_WIN_SAKURE_PARTICLE } from "./particel";

const WIN_COINS_PARTICLE_lv0 = get_WIN_COINS_PARTICLE(1.5);
const WIN_COINS_PARTICLE_lv1 = get_WIN_COINS_PARTICLE(4);
const WIN_COINS_PARTICLE_lv2 = get_WIN_COINS_PARTICLE(8);
const WIN_COINS_PARTICLE_lv3 = get_WIN_COINS_PARTICLE(21);

const WIN_SAKURE_PARTICLE_lv0 = get_WIN_SAKURE_PARTICLE(1.5);
const WIN_SAKURE_PARTICLE_lv1 = get_WIN_SAKURE_PARTICLE(4);
const WIN_SAKURE_PARTICLE_lv2 = get_WIN_SAKURE_PARTICLE(8);
const WIN_SAKURE_PARTICLE_lv3 = get_WIN_SAKURE_PARTICLE(21);


export function WinAmountLabel({ dataSource, ...props }: { dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const spine = useRef<Spine>(null);
    const text = useRef<PIXIBitmapText>(null);
    const { gameStatus, response, state, nextGameStatus } = dataSource.base!;
    const isShowWinAmount1 = gameStatus == KCurrentGameStatus.showWinAmount;
    const isShowWinAmount2 = gameStatus == KCurrentGameStatus.showWinAmount2;
    const isShowWinAmount = isShowWinAmount1 || isShowWinAmount2;
    const type = state.spin.spinModel?.winType;

    useEffect(() => {
        if (spine.current && text.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('number')];
            slot.addChild(text.current);
        }
    }, [spine, text])

    const duration = useMemo(() => {
        if (isShowWinAmount1) {
            if (type == 'big') {
                return 1000;
            } else if (type == 'high') {
                return 4500;
            } else if (type == 'medium') {
                return 3500;
            } else if (type == 'normal') {
                return 2500
            } else {
                return 1500;
            }
        }
        return 0;
    }, [isShowWinAmount1]);

    const [showLv0, showLv1, showLv2, showLv3] = useMemo(() => {
        if (isShowWinAmount) {
            return [type == 'small', type == 'normal', type == 'medium', type == 'high'];
        } else {
            return [false, false, false, false];
        }
    }, [isShowWinAmount]);

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 1000, isShowWinAmount1)

    const amount = response?.payout.toNumber() || 0;
    return (
        <Layer {...props} visible={isShowWinAmount}>
            <Spine_Number ref={spine} playing={isShowWinAmount} x={345} y={340} scale={0.5} action={useMemoConstant([0, 'WinInfo', false])} toFrameOneWhenStop={true}></Spine_Number>
            <TweenAmountBitmapText ref={text} anchor={0.5} scale={[1, -1]} tweenOptions={{ duration: duration, playing: isShowWinAmount }} text={isShowWinAmount ? amount : 0} style={{ fontName: R_Gold_Font, fontSize: 60, align: 'center', letterSpacing: 0 }} />
            <ParticleEmitter x={345} y={300} playing={showLv0} config={WIN_COINS_PARTICLE_lv0}></ParticleEmitter>
            <ParticleEmitter x={345} y={300} playing={showLv0} config={WIN_SAKURE_PARTICLE_lv0}></ParticleEmitter>

            <ParticleEmitter x={345} y={300} playing={showLv1} config={WIN_COINS_PARTICLE_lv1}></ParticleEmitter>
            <ParticleEmitter x={345} y={300} playing={showLv1} config={WIN_SAKURE_PARTICLE_lv1}></ParticleEmitter>

            <ParticleEmitter x={345} y={300} playing={showLv2} config={WIN_COINS_PARTICLE_lv2}></ParticleEmitter>
            <ParticleEmitter x={345} y={300} playing={showLv2} config={WIN_SAKURE_PARTICLE_lv2}></ParticleEmitter>

            <ParticleEmitter x={345} y={300} playing={showLv3} config={WIN_COINS_PARTICLE_lv3}></ParticleEmitter>
            <ParticleEmitter x={345} y={300} playing={showLv3} config={WIN_SAKURE_PARTICLE_lv3}></ParticleEmitter>
        </Layer>
    )
}