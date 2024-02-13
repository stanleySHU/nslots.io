import { Layer } from "common/components/layer";
import { AnimatedSheet_Cheer, AnimatedSheet_Idle, AnimatedSheet_Jump, AnimatedSheet_Shocked, AnimatedSheet_Sword, AnimatedSheet_Telescope, Spine_Speech } from "./base";
import { GameStatusModel, KBossStatus } from "../status/type";
import { SlideTips } from "common/components/slide";
import { useEffect, useMemo, useRef } from "react";
import { Spine } from "pixi-spine";
import { Label } from "common/components/text";
import { Text } from "pixi.js";
import { R_Font_Silver } from "@/assets";
import { useMemoConstant } from "common/components/customhook";

export function Mascot({ dataSource }: { dataSource: GameStatusModel }) {
    const poly1 = useRef<Spine>(null);
    const text = useRef<Text>(null);
    const { state, gameStatus, gameStep } = dataSource.base!;


    // const isCheer = isNotInBossBattle && gameStarted || bossStatus == KBossStatus.BossDestory;
    // const isSword = isInBossBattle;
    // const isShocked = bossStatus == KBossStatus.BossInto || bossStatus == KBossStatus.CaptainLeave; 
    
    // useEffect(() => {
    //     if (poly1.current && text.current) {
    //         const slot = poly1.current.slotContainers[poly1.current.skeleton.findSlotIndex('text')];
    //         slot.addChild(text.current);
    //     }
    // }, [poly1, text])

    // const speak = useMemo(() => {
    //     const shipCount = state.spin.spinModel?.shipCount || 0;
    //     if (bossStatus == KBossStatus.NotInBattle && shipCount > 0) {
    //         return  `There are ${shipCount} ship ahead` //`还剩下${shipCount}只船`
    //     } else if (bossStatus == KBossStatus.InBossBattle) {
    //         return `Attack the Boss!`
    //     } else {
    //         return '';
    //     }
    // }, [bossStatus, state.spin.spinModel]);

    // const showBubbleShips = gameStatus == 'idle' && speak != '';
    return (
        <Layer x={490} y={780} >
            {/* <SlideTips selected={0} duration={5000}> */}
                {/* <AnimatedSheet_Jump anchor={0.5} visible={isJump} isPlaying={isJump}></AnimatedSheet_Jump> */}
                {/* 惊叹 */}
                <AnimatedSheet_Shocked anchor={0.5} visible={isShocked} isPlaying={isShocked}></AnimatedSheet_Shocked> 
                {/* 刀 */}
                <AnimatedSheet_Sword anchor={0.5} visible={isSword} isPlaying={isSword}></AnimatedSheet_Sword>
                {/* <AnimatedSheet_Idle x={0} y={0} anchor={0.5} isPlaying={gameStarted}></AnimatedSheet_Idle> */}
                <AnimatedSheet_Cheer anchor={0.5} visible={isCheer} isPlaying={isCheer}></AnimatedSheet_Cheer>
                {/* 望远镜 */}
                <AnimatedSheet_Telescope anchor={0.5} visible={!gameStarted} isPlaying={!gameStarted} blendMode={0}></AnimatedSheet_Telescope>
            {/* </SlideTips> */}


            <Layer>
                <Spine_Speech ref={poly1} x={-70} y={140} scale={0.33} playing={showBubbleShips} action={useMemoConstant([0, 'Poly 1', false])} toFrameOneWhenStop={true}></Spine_Speech>
                <Label ref={text} x={0} y={0} anchor={0.5} scale={[1, -1]} text={`${speak}`}
                style={{ align: 'center', fill: '#000000', fontSize: 45, wordWrap: true, wordWrapWidth: 300, breakWords: false, 
                letterSpacing: 5, dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2 }}></Label>
            </Layer>
        </Layer>
    )
}