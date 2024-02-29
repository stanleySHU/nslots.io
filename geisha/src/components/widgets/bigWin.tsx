import { Layer, Orientation } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Spine_All } from "./base";
import { useEffect, useRef, useState } from "react";
import { Spine } from "pixi-spine";
import { Container } from "@pixi/react";
import { BitmapText as PixiBitmapText } from 'pixi.js';
import { R_Gold_Font } from "@/assets";
import { toCommaAndFixed } from "common/util/amount";
import { BitmapLabel } from "common/components/bitmapText";
import { useDelayFrameOnce, useMemoConstant } from "common/components/customhook";
import { SlotContext } from "common/model/context";
import { Rectangle } from "common/components/rectangle";
import { ParticleEmitter } from "common/components/particleemitter";
import { get_BIG_WIN_COINS_PARTICLE, get_BIG_WIN_SAKURE_PARTICLE } from "./particel";

const BIG_WIN_COINS_PARTICLE = get_BIG_WIN_COINS_PARTICLE(6);
const BIG_WIN_SAKURE_PARTICLE = get_BIG_WIN_SAKURE_PARTICLE(6);

export function BigWin({ dataSource }: { dataSource: GameStatusModel }) {
    const spine = useRef<Spine>(null);
    const text = useRef<PixiBitmapText>(null);
    const { gameStatus, nextGameStatus, response, state } = dataSource.base!;
    const isShowBigWinAmount = gameStatus == KCurrentGameStatus.showBigWinAmount;

    useEffect(() => {
        if (spine.current && text.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('NUMBERS')];
            slot.addChild(text.current);
            text.current.position.set(0, 20);            
        }
    }, [spine, text]);

    function _onComplete(e: any) {
        if (e.animation.name == 'BIGWIN_ENTER') {
            nextGameStatus!();
        }
    }

    const amount = toCommaAndFixed(response?.payout.toNumber() || 0);
    return (<Orientation>
        <Layer visible={isShowBigWinAmount}>
            <Rectangle frame={[0,0,1170,1170]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
            <Container>
                <ParticleEmitter x={470} y={505} scale={1} playing={isShowBigWinAmount}  config={BIG_WIN_COINS_PARTICLE}></ParticleEmitter>
                <ParticleEmitter x={700} y={505} scale={[-1,1]} playing={isShowBigWinAmount} config={BIG_WIN_COINS_PARTICLE}></ParticleEmitter>
                <ParticleEmitter x={470} y={505} scale={1} playing={isShowBigWinAmount} config={BIG_WIN_SAKURE_PARTICLE}></ParticleEmitter>
                <ParticleEmitter x={700} y={505} scale={[-1,1]} playing={isShowBigWinAmount} config={BIG_WIN_SAKURE_PARTICLE}></ParticleEmitter>
            </Container>
            <Spine_All ref={spine} x={585} y={585} playing={isShowBigWinAmount} l-scale={0.33} p-scale={0.25} onComplete={_onComplete} actions={useMemoConstant([[0, 'BIGWIN_OUT', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_ENTER', false]])} timeScale={1}></Spine_All>
            <BitmapLabel ref={text} scale={[1, -1]} anchor={0.5} text={`${amount}`} maxScaleLength={1700} style={{ fontName: R_Gold_Font, fontSize: 150, align: 'center', letterSpacing: 0 }} />
        </Layer>
    </Orientation>
    )
}