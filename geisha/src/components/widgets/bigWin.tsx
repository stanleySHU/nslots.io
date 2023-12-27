import { Layer, Orientation } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Spine_CannonCount } from "./base";
import { useEffect, useRef } from "react";
import { Spine } from "pixi-spine";
import { BitmapText, Container } from "@pixi/react";
import { ParticleContainer, BitmapText as PixiBitmapText } from 'pixi.js';
import { R_Gold_Font, R_Yellow_Font } from "@/assets";
import { toCommaAndFixed } from "common/util/amount";
import { BitmapLabel } from "common/components/bitmapText";
import { useMenoConstant } from "common/components/customhook";
import { SlotContext } from "common/model/context";
import { Languages } from "common/model/context/baseContext";
import { Rectangle } from "common/components/rectangle";
import { BIG_WIN_COINS_ANIMATION } from "@/animation/bigWinCoins";
import { ParticleEmitter } from "common/components/particleemitter";

export function BigWin({ dataSource }: { dataSource: GameStatusModel }) {
    const spine = useRef<Spine>(null);
    const text = useRef<PixiBitmapText>(null);
    const emitter = useRef<ParticleContainer>(null);
    const { gameStatus, nextGameStatus, response, state } = dataSource.base!;
    const isShowBigWinAmount = gameStatus == KCurrentGameStatus.showBigWinAmount;
    const {urlOptions} = SlotContext.Obj;

    useEffect(() => {
        if (spine.current && text.current && emitter.current) {
            const slot = spine.current.slotContainers[spine.current.skeleton.findSlotIndex('NUMBERS')];
            slot.addChild(text.current);
            text.current.position.set(0, 20);            
        }
    }, [spine, text, emitter]);

    function _onComplete(e: any) {
        if (e.animation.name == 'BIGWIN_ENTER') {
            nextGameStatus!();
        }
    }

    const amount = toCommaAndFixed(response?.payout.toNumber() || 0);
    return (<Orientation>
        <Layer visible={isShowBigWinAmount}>
            <Rectangle frame={[0,0,1170,1170]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
            <Container ref={emitter}>
                <ParticleEmitter x={585} y={585} scale={1} playing={isShowBigWinAmount} visible={isShowBigWinAmount} config={BIG_WIN_COINS_ANIMATION}></ParticleEmitter>
            </Container>
            <Spine_CannonCount ref={spine} x={585} y={585} playing={isShowBigWinAmount} skin={urlOptions.lang == Languages.Chinese ? 'CH' : 'EN'} l-scale={0.33} p-scale={0.25} onComplete={_onComplete} actions={useMenoConstant([[0, 'BIGWIN_OUT', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_IDLE', false], [0, 'BIGWIN_ENTER', false]])} timeScale={1}></Spine_CannonCount>
            <BitmapLabel ref={text} scale={[1, -1]} anchor={0.5} text={`${amount}`} maxScaleLength={1700} style={{ fontName: R_Gold_Font, fontSize: 150, align: 'center', letterSpacing: 0 }} />
        </Layer>
    </Orientation>
    )
}

