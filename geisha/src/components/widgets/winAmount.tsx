import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { ComponentProps, useEffect, useMemo, useRef } from "react";
import { Spine_Number } from "./base";
import { useMenoConstant } from "common/components/customhook";
import { BitmapText } from "@pixi/react";
import { toCommaAndFixed } from "common/util/amount";
import { R_Gold_Font } from "@/assets";
import { Spine } from "pixi-spine";
import { BitmapText as PIXIBitmapText } from "pixi.js";
import { TweenAmountBitmapText } from "common/components/tweenAnimations";
import { ParticleEmitter } from "common/components/particleemitter";
import { COINS_ANIMATION } from "@/animation/coins";

export function WinAmountLabel({ dataSource, ...props }: { dataSource: GameStatusModel } & ComponentProps<typeof Layer>) {
    const spine = useRef<Spine>(null);
    const text = useRef<PIXIBitmapText>(null);
    const { gameStatus, response, state } = dataSource.base!;
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount;

    useEffect(() => {
        if (spine.current && text.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('number')];
            slot.addChild(text.current);
        }
    }, [spine, text])

    const duration = useMemo(() => {
        const type = state.spin.spinModel?.winType;
        if (isShowWinAmount) {
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
        return ['', 0];
    }, [isShowWinAmount]);

    const amount = response?.payout.toNumber() || 0;

    return (
        <Layer {...props} visible={isShowWinAmount}>
            <Spine_Number ref={spine} playing={isShowWinAmount} x={345} y={340} scale={0.5} action={useMenoConstant([0, 'WinInfo', false])} toFrameOneWhenStop={true}></Spine_Number>
            <TweenAmountBitmapText ref={text} anchor={0.5} scale={[1, -1]} tweenOptions={{ duration: duration }} text={isShowWinAmount ? amount : 0} style={{ fontName: R_Gold_Font, fontSize: 60, align: 'center', letterSpacing: 0 }} />
            <ParticleEmitter x={345} y={330} playing={isShowWinAmount} visible={isShowWinAmount} config={COINS_ANIMATION}></ParticleEmitter>
        </Layer>
    )
}