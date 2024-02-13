import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { AnimatedSheet_Heal, ISpine_BossShipRear, SpineCount_Explosion, Spine_BossShipRear } from "./base";
import { useMemo, useRef, useState } from "react";
import { useMemoConstant } from "common/components/customhook";
import { Tween } from "common/components/tween";
import { IGameOverStatus } from "common/util/parser/spin/piratesBounty";
import { Spine } from "pixi-spine";
import { Sound } from "common/components/sound";
import { SpriteAtlas } from "common/components/sprite";
import { R_Uncomponents } from "common/assets";
import { BOSS_HP } from "./config";
import { MaskLayer } from "common/components/maskLayer";
import { Rectangle } from "common/components/rectangle";
import { BLEND_MODES } from "pixi.js";
import { SheetExplosion } from "./fleet";
import { KCaptialHpReduce } from "../status/captialStatus";

export const ICaptainYScale: [number, number][] = [[380, 1.8], [340, 1.6], [310, 1.4], [280, 1.2], [250, 1]];
export function Capital({ dataSource }: { dataSource: GameStatusModel }) {
    const spine = useRef<Spine>(null);
    const { gameStatus, gameStep, nextGameStatus } = dataSource.base!;
    const { distance, hp, hpReduceId, hpReduceMap, hpIncreaseId } = dataSource.captial!;

    const isShowShipBattleOut = gameStatus == KCurrentGameStatus.showShipBattleOut;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;

    function onOut() {
        if (isShowShipBattleOut) {
            nextGameStatus();
        }
    }

    const action = useMemo<[number, ISpine_BossShipRear, boolean]>(() => {
        if (isShowShipBattleOut) {
            return [0, 'out', false]
        } else {
            return [0, 'Idle', true]
        }
    }, [isShowShipBattleOut])

    useMemo(() => {
        if (hpReduceId > 0) {
            spine.current!.state.setAnimation(0, 'Idle Hit', false);
            spine.current!.state.addAnimation(0, 'Idle', true, 0);
        }
    }, [hpReduceId])

    const [startY, startScale] = ICaptainYScale[4];
    const [targetY, targetScale] = ICaptainYScale[4];

    return (
        <Tween dep={[distance]} from={{ y: startY, scale: startScale }} to={{ y: targetY, scale: targetScale }} playing={true}>
            {
                (model) => {
                    return (
                        <Layer visible={isInShipBattle} x={270} {...model}>
                            <Spine_BossShipRear ref={spine} scale={0.055} playing={isInShipBattle} action={action} onComplete={onOut}></Spine_BossShipRear>
                            <HealAnimtion hpIncreaseId={hpIncreaseId}></HealAnimtion>
                            {
                                [[-80, -140], [-80, -160], [-70, -150], [-60, -140], [-60, -160]].map(([x, y], index) => {
                                    const isPlaying = !!hpReduceMap[index];
                                    return <Layer key={`cex${index}`}>
                                        <SheetExplosion x={x} y={y} repeat={1} isPlaying={isPlaying}></SheetExplosion>
                                        <Sound sound='kill_ship' playing={isPlaying} allowStop={false} volum={0.5}></Sound>
                                    </Layer>
                                })
                            }
                            <HpAnimation hpReduceId={hpReduceId} hpReduceMap={hpReduceMap}></HpAnimation>
                        </Layer>
                    )
                }
            }
        </Tween>
    )
}

export function HealAnimtion({ hpIncreaseId }: { hpIncreaseId: number }) {
    const [playing, setPlaying] = useState(false);

    useMemo(() => {
        if (hpIncreaseId > 0) {
            setPlaying(true);
        }
    }, [hpIncreaseId])
    return <AnimatedSheet_Heal x={-75} y={-180} isPlaying={playing} visible={playing} animationSpeed={0.25} repeat={1} onLoop={setPlaying.bind(null, false)} startFrame={0} blendMode={BLEND_MODES.SCREEN}></AnimatedSheet_Heal>
}

export function HpAnimation({ hpReduceId, hpReduceMap }: { hpReduceId: number, hpReduceMap: {[key: number]: KCaptialHpReduce} }) {
    const [playing, setPlaying] = useState(false);

    const [lastX, currentX] = useMemo(() => {
        let item: KCaptialHpReduce | null = null;
        for (let key in hpReduceMap) {
            item = hpReduceMap[key]
            break;
        }
        if (item) {
            const { lastHp, hp } = item;
            const currentX = 108 * (hp / BOSS_HP) - 108,
                lastX = 108 * (lastHp / BOSS_HP) - 108;
            return [lastX, currentX];
        }
        return [108, 108];
    }, [hpReduceId]);

    useMemo(() => {
        if (hpReduceId > 0) {
            setPlaying(true);
        }
    }, [hpReduceId])

    return (
        <Layer x={-72} y={-180} visible={playing}>
            <Tween from={{ k: 0 }} to={{ k: 1 }} playing={playing} duration={2000} onComplete={setPlaying.bind(null, false)}>
                {
                    ({ k }) => {
                        const x = lastX - (lastX - currentX) * k;
                        return (
                            <MaskLayer>
                                <Layer>
                                    <SpriteAtlas x={17} y={27} res={R_Uncomponents} name={`jackpot_bosshp.png`}></SpriteAtlas>
                                    <Rectangle color={0xDC143C} x={currentX + 108} frame={[18, 18, 108, 22]}></Rectangle>
                                </Layer>
                                <Rectangle x={x} frame={[18, 28, 108, 12]}></Rectangle>
                            </MaskLayer>
                        )
                    }
                }
            </Tween>
            <SpriteAtlas x={14} y={16} name={`jackpot/jackpot_bosshp_frame.png`}></SpriteAtlas>
        </Layer>
    )
}