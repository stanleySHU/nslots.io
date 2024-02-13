import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { SpineCount_VictoryScreen } from "./base";
import { useDelayFrameOnce, useMemoConstant } from "common/components/customhook";
import { Button } from "common/components/button";
import { SpriteAtlas } from "common/components/sprite";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container, BitmapText as PixiBitmapText } from '@pixi/react';
import { Spine } from "pixi-spine";
import { AnimatedSprite, BitmapText, ParticleContainer } from "pixi.js";
import { R_Font_Win } from "@/assets";
import { toCommaAndFixed } from "common/util/amount";
import { ParticleEmitter } from 'common/components/particleEmitter'
// import { BIG_WIN_PARTICLE } from "../animation/winBoss";
import { BIG_WIN_PARTICLE } from "../animation/winBoss2";
import { Sound } from "common/components/sound";
import { Rectangle } from "common/components/rectangle";

export function Ann({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, state, gameStep } = dataSource.base!;
    const { onGoToInit } = dataSource.actions!;
    const spine = useRef<Spine>(null);
    const text = useRef<BitmapText>(null);
    const emitter = useRef<ParticleContainer>(null);
    const { spinModel } = state.spin;

    const [showGem, setShowGem] = useState(false);
    const [ showContinue, setShowContinue ] = useState(false);

    const isWin = gameStatus == KCurrentGameStatus.win;

    useEffect(() => {
        if (!isWin) {
            setShowGem(false);
            setShowContinue(false);
        }
    }, [isWin])

    useEffect(() => {
        if (spine.current && text.current) {
            const slot1 = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('null')];
            slot1.addChild(text.current);
            text.current.position.set(0, -30);
        }
    }, [spine, text]);

    const win = useMemo(() => {
        if (isWin) {
            return spinModel!.credit.mul(spinModel!.jackpot).toNumber();
        }
        return 0;
    }, [isWin]);

    useDelayFrameOnce(() => {
        setShowContinue(true)
    }, 3000, isWin);

    const gemPLaying = showGem && isWin;

    return (
        <Layer visible={isWin}>
            <Rectangle frame={[0,0,540,960]} alpha={0} interactive={true}></Rectangle>
            <SpineCount_VictoryScreen ref={spine} x={270} y={640} scale={0.33} repeat={1} playing={isWin} event={setShowGem.bind(null, true)} action={useMemoConstant([0, 'Victory_Map_Knife', false])} toFrameOneWhenStop={true} timeScale={0.66}></SpineCount_VictoryScreen>
            <Button x={270} y={700} visible={showContinue} click={onGoToInit}>
                <SpriteAtlas anchor={0.5} name={`tips/continue_button.png`}></SpriteAtlas>
            </Button>
            <PixiBitmapText ref={text} scale={[1, -1]} anchor={0.5} text={`${toCommaAndFixed(win)}`} style={{ fontName: R_Font_Win, fontSize: 200, letterSpacing: -13 }} />
            {
                gemPLaying ? <Container ref={emitter}>
                <ParticleEmitter x={230} y={430} scale={[1, 1]} playing={gemPLaying} visible={gemPLaying} config={BIG_WIN_PARTICLE}></ParticleEmitter>
            </Container> : <></>
            }
        </Layer>
    )
}