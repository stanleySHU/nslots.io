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
import { NORMAL_WIN_PARTICLE } from 'common/components/particle/normalWinV1';

export function WinAmountLabel({ dataSource, ...props }: { dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const spine = useRef<Spine>(null);
    const text = useRef<PIXIBitmapText>(null);
    const { gameStatus, response, state, nextGameStatus } = dataSource.base!;
    const isShowWinAmount1 = gameStatus == KCurrentGameStatus.showWinAmount;
    const isShowWinAmount2 = gameStatus == KCurrentGameStatus.showWinAmount2;
    const isShowWinAmount = isShowWinAmount1 || isShowWinAmount2;

    useEffect(() => {
        if (spine.current && text.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('number')];
            slot.addChild(text.current);
        }
    }, [spine, text])

    const duration = useMemo(() => {
        const type = state.spin.spinModel?.winType;
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

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 1000, isShowWinAmount1)

    const amount = response?.payout.toNumber() || 0;

    return (
        <Layer {...props} visible={isShowWinAmount}>
            <Spine_Number ref={spine} playing={isShowWinAmount} x={345} y={340} scale={0.5} action={useMemoConstant([0, 'WinInfo', false])} toFrameOneWhenStop={true}></Spine_Number>
            <TweenAmountBitmapText ref={text} anchor={0.5} scale={[1, -1]} tweenOptions={{ duration: duration, playing: isShowWinAmount }} text={isShowWinAmount ? amount : 0} style={{ fontName: R_Gold_Font, fontSize: 60, align: 'center', letterSpacing: 0 }} />
            <ParticleEmitter x={345} y={300} playing={isShowWinAmount} visible={isShowWinAmount} config={NORMAL_WIN_PARTICLE}></ParticleEmitter>
        </Layer>
    )
}