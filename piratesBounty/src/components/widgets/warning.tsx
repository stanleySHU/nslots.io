import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { Rectangle } from "common/components/rectangle";
import { Tween } from "common/components/tween";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { Label } from "common/components/text";
import { Button, SButton } from "common/components/button";
import { toCommaAndFixed } from "common/util/amount";
import { Easing } from "@tweenjs/tween.js";
import { Sound } from "common/components/sound";
import { Spine_PopUp } from "./base";
import { useMemoConstant } from "common/components/customhook";
import { SpineAnimations } from "common/components/spineAnimations";

export function Warning({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, gameStatus, gameStep } = dataSource.base!;
    const { showGameStartTip, showGiveUpTip } = dataSource.tips!;
    const { onGameStart, onGameGiveUp, onContinue } = dataSource.actions!;
    const gameNotStart = gameStep == KGameStep.notStart;
    const isIdle = gameStatus == 'idle';
    const isLoseInShip = gameStatus == KCurrentGameStatus.loseInShip;
    const isLoseInBoss = gameStatus == KCurrentGameStatus.loseInBossBattle;

    return (
        <Layer>
            <Layer x={270} y={700} visible={gameNotStart && isIdle}>
                <Tween from={{ k: 0 }} to={{ k: 1 }} duration={5000} repeat={10000000} playing={gameNotStart && isIdle}>
                    {
                        ({ k }) => {
                            let alpha = 0;
                            if (k < 0.05) alpha = Easing.Quadratic.InOut(k * 20);
                            else if (k < 0.7) alpha = 1;
                            else if (k < 0.8) alpha = Easing.Quadratic.InOut(1 - (k - 0.7) * 10);
                            else alpha = 0;
                            return (
                                <SpriteAtlas alpha={alpha} anchor={0.5} scale={1.65} name={`tips/betstart.png`}></SpriteAtlas>
                            )
                        }
                    }
                </Tween>
            </Layer>
            <Layer visible={showGameStartTip}>
                <Rectangle frame={[0, 0, 540, 960]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
                <SpineAnimations slotName="center">
                    <Spine_PopUp x={280} y={600} action={useMemoConstant([0, 'Intro', false])} playing={showGameStartTip} toFrameOneWhenStop={true}></Spine_PopUp>
                    <Layer x={0} y={0} pivot={[203, 135]} scale={[1, -1]}>
                        <SpriteAtlas name={`tips/continue_textbox_frame.png`}></SpriteAtlas>
                        <SpriteAtlasLang x={190} y={24} anchor={0.5} scale={1} name={`TIPS.png`}></SpriteAtlasLang>
                        <Layer>
                            <Label x={200} y={90} anchor={[0.5, 0]} text={`Your current bet amount is ${toCommaAndFixed(state.spin.betAmount, 2)}, start to play?`} style={{ align: 'center', fill: '#ffffff', fontSize: 20, wordWrap: true, wordWrapWidth: 300, breakWords: false }}></Label>
                        </Layer>
                        <Layer y={170}>
                            <SButton x={30} click={onGameStart.bind(null, false)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_no.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`NO.png`}></SpriteAtlasLang>
                            </SButton>
                            <SButton x={200} click={onGameStart.bind(null, true)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_yes.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`LET’S GO.png`}></SpriteAtlasLang>
                            </SButton>
                        </Layer>
                    </Layer>
                </SpineAnimations>
            </Layer>
            <Layer visible={isLoseInBoss}>
                <Rectangle frame={[0, 0, 540, 960]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
                <SpineAnimations slotName="center">
                    <Spine_PopUp x={280} y={600} action={useMemoConstant([0, 'Intro', false])} playing={isLoseInBoss} toFrameOneWhenStop={true}></Spine_PopUp>
                    <Layer pivot={[203, 135]} scale={[1, -1]}>
                        <SpriteAtlas name={`tips/continue_textbox_frame.png`}></SpriteAtlas>
                        <SpriteAtlasLang x={190} y={24} anchor={0.5} scale={1} name={`TIPS.png`}></SpriteAtlasLang>
                        <Layer>
                            <Label x={190} y={90} anchor={[0.5, 0]} text={`You were defeated.`} style={{ align: 'center', fill: '#ffffff', fontSize: 20, wordWrap: true, wordWrapWidth: 300, breakWords: false }}></Label>
                        </Layer>
                        <Layer y={170}>
                            <SButton x={115} click={onGameGiveUp.bind(null, true)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_yes.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`CONTINUE.png`}></SpriteAtlasLang>
                            </SButton>
                        </Layer>
                    </Layer>
                </SpineAnimations>
            </Layer>
            <Layer visible={showGiveUpTip}>
                <Rectangle frame={[0, 0, 540, 960]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
                <SpineAnimations slotName="center">
                    <Spine_PopUp x={280} y={600} action={useMemoConstant([0, 'Intro', false])} playing={showGiveUpTip} toFrameOneWhenStop={true}></Spine_PopUp>
                    <Layer pivot={[203, 135]} scale={[1, -1]}>
                        <SpriteAtlas name={`tips/continue_textbox_frame.png`}></SpriteAtlas>
                        <SpriteAtlasLang x={190} y={24} anchor={0.5} scale={1} name={`TIPS.png`}></SpriteAtlasLang>
                        <Layer>
                            <Label x={200} y={90} anchor={[0.5, 0]} text={`Want to give up? all will reset.?`} style={{ align: 'center', fill: '#ffffff', fontSize: 20, wordWrap: true, wordWrapWidth: 300, breakWords: false }}></Label>
                        </Layer>
                        <Layer y={170}>
                            <SButton x={30} click={onGameGiveUp.bind(null, false)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_no.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`NO.png`}></SpriteAtlasLang>
                            </SButton>
                            <SButton x={200} click={onGameGiveUp.bind(null, true)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_yes.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`LET’S GO.png`}></SpriteAtlasLang>
                            </SButton>
                        </Layer>
                    </Layer>
                </SpineAnimations>
            </Layer>
            <Layer visible={isLoseInShip}>
                <Rectangle frame={[0, 0, 540, 960]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
                <SpineAnimations slotName="center" >
                    <Spine_PopUp x={280} y={600} action={useMemoConstant([0, 'Intro', false])} playing={isLoseInShip} toFrameOneWhenStop={true}></Spine_PopUp>
                    <Layer pivot={[203, 135]} scale={[1, -1]}>
                        <SpriteAtlas name={`tips/continue_textbox_frame.png`}></SpriteAtlas>
                        <SpriteAtlasLang x={190} y={24} anchor={0.5} scale={1} name={`TIPS.png`}></SpriteAtlasLang>
                        <Layer>
                            <Label x={200} y={90} anchor={[0.5, 0]} text={`No more rolls, Continue game with retained jackpot?`} style={{ align: 'center', fill: '#ffffff', fontSize: 20, wordWrap: true, wordWrapWidth: 300, breakWords: false }}></Label>
                        </Layer>
                        <Layer y={170}>
                            <SButton x={30} click={onGameGiveUp.bind(null, true)} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_no.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`NO.png`}></SpriteAtlasLang>
                            </SButton>
                            <SButton x={200} click={onContinue} scale={1.3}>
                                <SpriteAtlas name={`tips/continue_textbox_yes.png`}></SpriteAtlas>
                                <SpriteAtlasLang x={55} y={22} anchor={0.5} scale={1} name={`LET’S GO.png`}></SpriteAtlasLang>
                            </SButton>
                        </Layer>
                    </Layer>
                </SpineAnimations>
            </Layer>
        </Layer>
    )
}