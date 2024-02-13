import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { ISpine_Grates, ISpine_ShieldFinal, Spine_Grates, Spine_ShieldFinal } from "./base";
import { SpriteAtlas } from "common/components/sprite";
import { BitmapText as PixiBitmapText } from '@pixi/react';
import { R_Font_Rb } from "@/assets";
import { useEffect, useMemo, useRef } from "react";
import { Spine } from "pixi-spine";
import { BitmapText, Sprite } from "pixi.js";

export function Player({ dataSource }: { dataSource: GameStatusModel }) {
    const boat = useRef<Spine>(null);
    const curtain = useRef<Sprite>(null);
    const text = useRef<BitmapText>(null);
    const { inFS, fsCount } = dataSource.fs!;

    const actionBoay = useMemo<[number, ISpine_ShieldFinal, boolean]>(() => {
        return [0, inFS ? 'Level 5_Empty_Curtain_Torch' : 'Level 5_Empty', true];
    }, [inFS]);

    const actionSplash = useMemo<[number, ISpine_ShieldFinal, boolean]>(() => {
        return [0, 'Splash_Big', true];
    }, []);

    useEffect(() => {
        if (boat.current && curtain.current && text.current) {
            const slot = boat.current.slotContainers[boat.current.skeleton.findSlotIndex('null')];
            slot.addChild(curtain.current);
            slot.addChild(text.current);
            curtain.current.position.set(-535, 500);
            text.current.position.set(30, 295);
        }
    }, [boat])

    return (
        <Layer x={263} y={680}>
            <Spine_ShieldFinal scale={0.33} playing={inFS} visible={inFS} action={actionSplash}></Spine_ShieldFinal>
            <Spine_ShieldFinal ref={boat} scale={0.33} playing={true} action={actionBoay}></Spine_ShieldFinal>
            <PixiBitmapText ref={text} scale={[1, -1]} anchor={0.5} text={`${fsCount}`} visible={inFS} style={{ fontName: R_Font_Rb, fontSize: 210, letterSpacing: -19 }} />
            <SpriteAtlas ref={curtain} scale={[3, -3]} name={'Deck_Curtain.png'} visible={inFS}></SpriteAtlas>
        </Layer>
    )
}

export function Grates({ dataSource }: { dataSource: GameStatusModel }) {
    const spine = useRef<Spine>(null);
    const { gameStatus, nextGameStatus } = dataSource.base!;
    const { inFS } = dataSource.fs!;

    const isShowGateOpen = gameStatus == KCurrentGameStatus.showGateOpen;
    const isShowGateClose = gameStatus == KCurrentGameStatus.showGateClose;
    const playing = isShowGateOpen || isShowGateClose;

    const action = useMemo<[number, ISpine_Grates, boolean]>(() => {
        if (isShowGateOpen) {
            return [0, 'Grates_Gold_3_to_5', false]
        } else if (isShowGateClose) {
            return [0, 'Grates_Gold_5_to_3', false]
        } else if (inFS) {
            return [0, 'Grates_Gold_Idle 5slot', true]
        } else {
            return [0, 'Grates_Gold_ Ilde 3slot', true]
        }
    }, [gameStatus, inFS])

    useMemo(() => {
        if (spine.current && !inFS && action[1] == 'Grates_Gold_Idle 5slot') {
            spine.current.state.setAnimation(0, 'Grates_Gold_5_to_3', false);
            spine.current.state.addAnimation(0, 'Grates_Gold_ Ilde 3slot', false, 0);
        }
    }, [inFS])

    return (
        <Layer x={272} y={715}>
            <Spine_Grates ref={spine} scale={0.33} playing={playing} action={action} onComplete={nextGameStatus}></Spine_Grates>
        </Layer>
    )
}