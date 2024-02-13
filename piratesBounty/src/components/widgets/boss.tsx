import { Layer } from "common/components/layer";
import { GameStatusModel, KBossCannonStatus, KCurrentGameStatus, KGameStep } from "../status/type";
import { AnimatedSheet_CannonFire, AnimatedSheet_FireIdle, ISpine_BossShip, SpineCount_BossShip, SpineCount_ShipCannon, Spine_BossFightText } from "./base";
import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import { Spine } from "pixi-spine";
import { AnimatedSprite, BLEND_MODES } from "pixi.js";
import { BOSS_HP, GOLD_BULLET_PNG_NAME, IRON_BULLET_PNG_NAME, I_BOSS_CANNON_HIT_PLAYER_DURATION, I_PLAYER_CANNON_HIT_BOSS_DURATION, PLAYER_HP } from "./config";
import { getCannonBulletPoint } from "./cannon";
import { Easing } from "@tweenjs/tween.js";
import { Tween } from "common/components/tween";
import { SpriteAtlas } from "common/components/sprite";
import { Sound } from "common/components/sound";
import { SheetExplosion } from "./fleet";
import { randomInArrWith } from "common/util/array";
import { SlotContext } from "common/model/context";
import { I_Screen_Shake } from "./tweenAnimations";
import { BitmapText } from "@pixi/react";
import { useMemoConstant } from "common/components/customhook";
import { R_Font_Gold } from "@/assets";
import { I_Boss_HP_Changed, I_Player_HP_Changed } from "./hp";

export const HIT_BOSS_POINTS = [[140, 350], [205, 300], [270, 350], [335, 300], [400, 350]];

export function Boss({ dataSource }: { dataSource: GameStatusModel }) {
    const boss = useRef<Spine>(null);
    const cannon0 = useRef<Spine>(null);
    const cannon1 = useRef<Spine>(null);
    const cannon2 = useRef<Spine>(null);
    const fire1 = useRef<AnimatedSprite>(null);
    const fire2 = useRef<AnimatedSprite>(null);
    const fire3 = useRef<AnimatedSprite>(null);
    const fire4 = useRef<AnimatedSprite>(null);
    const fire5 = useRef<AnimatedSprite>(null);
    const [forceUpdate, setForceUpdate] = useState(false);
    const cannons = [cannon0, cannon1, cannon2];
    const { current } = useRef<{
        cannonStatus: KBossCannonStatus, fireCannons: number[], bosshit: number[], bossHP: number, playerHP: number 
    }>({
        cannonStatus: 'Idle', fireCannons: [], bosshit: [], bossHP: BOSS_HP, playerHP: PLAYER_HP
    });
    const { gameStatus, gameStep, nextGameStatus, state } = dataSource.base!;
    const { bulletHitBossMap } = dataSource.bullet!;
    const { showCannonId } = dataSource.cannon!;
    const { spinModel } = state.spin;

    const isInBossBattle = gameStep == KGameStep.InBossBattle;
    const isDestory = gameStatus == KCurrentGameStatus.bossDestory;

    function cannonLoop(cannonId: number) {
        if (current.cannonStatus == 'Reload') {
            if (cannonId == 0) {
                cannon1.current!.state.addAnimation(0, 'Reaload', false, 0);
            } else if (cannonId == 1) {
                cannon0.current!.state.addAnimation(0, 'Reaload', false, 0);
                cannon2.current!.state.addAnimation(0, 'Reaload', false, 0);
            }
        }
    }

    function onCannonComplete(id: number, e: any) {
        if (e.animation.name == 'Ready' && !e.loop) {
            current.bosshit.push(id);
            setForceUpdate(!forceUpdate);
        }
    }

    function onBossComplete(e: any) {
        if (e.animation.name == 'destroyed') {
            nextGameStatus();
        } else if (e.animation.name == 'Enter') {
            nextGameStatus();
        }
    }

    function onBossShake(hp: number) {
        current.cannonStatus = 'Idle';
        boss.current!.state.setAnimation(0, 'Hit2', false);
        boss.current!.state.addAnimation(0, 'Ilde', true, 0);
        current.bossHP = Math.max(0, current.bossHP - hp);
        SlotContext.Obj.notice.emit(I_Boss_HP_Changed, current.bossHP);
        setForceUpdate(!forceUpdate);
    }

    function onPlayerShake() {
        current.cannonStatus = 'Reload';
        SlotContext.Obj.notice.emit(I_Screen_Shake);
        current.playerHP--;
        SlotContext.Obj.notice.emit(I_Player_HP_Changed, current.playerHP);
        setForceUpdate(!forceUpdate);
    }

    function onHitedPlayer(e: number) {
        let index = current.bosshit.indexOf(e);
        if (index >= 0) {
            current.bosshit.splice(index, 1);
            if (current.bosshit.length == 0) {
                nextGameStatus();
            }
        }
    }

    useEffect(() => {
        if (isInBossBattle) {
            current.bossHP = spinModel!.bossHP;
            current.playerHP = spinModel!.playerHP;

            const notice = SlotContext.Obj.notice;
            notice.emit(I_Player_HP_Changed, current.playerHP);
            notice.emit(I_Boss_HP_Changed, current.bossHP);
        }
    }, [isInBossBattle]);

    useMemo(() => {
        if (gameStatus == 'spin') {
            current.bosshit = [];
            current.fireCannons = [];
        }
    }, [gameStatus])

    useMemo(() => {
        if (gameStatus == 'spin' && !spinModel?.isExistRespin) {
            current.cannonStatus = current.cannonStatus == 'Reload' ? 'readyFire' : 'Reload'
        } else if (gameStatus == KCurrentGameStatus.bossHit) {
            if (state.spin.spinModel?.playerHit && state.spin.spinModel?.playerHit > 0) {
                current.cannonStatus = 'Fire';
                current.fireCannons = randomInArrWith([0, 1, 2], state.spin.spinModel!.playerHit).sort((a, b) => a - b);
            }
        }
    }, [gameStatus]);

    useEffect(() => {
        if (boss.current && cannon0.current && cannon1.current && cannon2.current && fire1.current && fire1.current && fire2.current && fire3.current && fire5.current && fire4.current) {
            const slot1 = boss.current.slotContainers[boss.current.skeleton.findSlotIndex('CannonParent1')];
            const slot2 = boss.current.slotContainers[boss.current.skeleton.findSlotIndex('CannonParent2')];
            const slot3 = boss.current.slotContainers[boss.current.skeleton.findSlotIndex('CannonParent3')];
            slot1.addChild(cannon0.current);
            slot2.addChild(cannon1.current);
            slot3.addChild(cannon2.current);

            cannon0.current.scale.y = cannon1.current.scale.y = cannon2.current.scale.y = -1;

            cannon0.current.position.set(-200, -80);
            cannon1.current.position.set(0, -80);
            cannon2.current.position.set(200, -80);

            const slotFire1 = boss.current.slotContainers[boss.current.skeleton.findSlotIndex('fire1')];
            slotFire1.addChild(fire1.current);
            slotFire1.addChild(fire2.current);
            slotFire1.addChild(fire3.current);
            slotFire1.addChild(fire4.current);
            slotFire1.addChild(fire5.current);

            fire1.current.position.set(-50, 100);
            fire2.current.position.set(390, -10);
            fire3.current.position.set(20, -50);
            fire4.current.position.set(350, 220);
            fire5.current.position.set(50, 300);
        }
    }, [boss, cannon0, cannon1, cannon2, fire1, fire2, fire3, fire4, fire5]);

    const bossActions = useMemo<([number, ISpine_BossShip, boolean][])[]>(() => {
        return [
            [[0, 'Enter', false], [0, 'Ilde', true]],
            [[0, 'destroyed', false]],
            [[0, 'Ilde', true]]
        ]
    }, []);

    const actions = useMemo<[number, ISpine_BossShip, boolean][]>(() => {
        if (gameStatus == KCurrentGameStatus.showBossIn) {
            return bossActions[0]
        } else if (gameStatus == KCurrentGameStatus.bossDestory || gameStep == KGameStep.bossDestroyed) {
            return bossActions[1]
        } else {
            return bossActions[2]
        }
    }, [gameStatus]);

    useMemo(() => {
        if (isInBossBattle && cannon0.current && cannon1.current && cannon2.current) {
            if (current.cannonStatus == 'Idle') {
                cannon0.current.state.setAnimation(0, 'Ilde', true);
                cannon1.current.state.setAnimation(0, 'Ilde', true);
                cannon2.current.state.setAnimation(0, 'Ilde', true);
            } else if (current.cannonStatus == 'Reload') {
                cannon0.current.state.update(0);
                cannon0.current.state.setAnimation(0, 'Reaload', false);
                cannon2.current.state.update(0);
                cannon2.current.state.setAnimation(0, 'Reaload', false);
            } else if (current.cannonStatus == 'readyFire') {
                cannon0.current.state.addAnimation(0, 'Idle to Ready', false, 0);
                cannon0.current.state.addAnimation(0, 'Ready', true, 0);
                cannon1.current.state.addAnimation(0, 'Idle to Ready', false, 0);
                cannon1.current.state.addAnimation(0, 'Ready', true, 0);
                cannon2.current.state.addAnimation(0, 'Idle to Ready', false, 0);
                cannon2.current.state.addAnimation(0, 'Ready', true, 0);
            } else if (current.cannonStatus == 'Fire') {
                for (let cannonId of [0, 1, 2,]) {
                    const cannon = cannons[cannonId];
                    if (current.fireCannons.indexOf(cannonId) >= 0) {
                        cannon.current!.state.setAnimation(0, 'Ready', false);
                        cannon.current!.state.addAnimation(0, 'Fire', false, 0);
                        cannon.current!.state.addAnimation(0, 'Ilde', true, 0);
                    } else {
                        cannon.current!.state.setAnimation(0, 'Ready to Idle', false);
                        cannon.current!.state.addAnimation(0, 'Ilde', true, 0);
                    }
                }
            }
        }
    }, [current.cannonStatus]);

    const [showFire1, showFire2, showFire3, showFire4, showFire5] = useMemo(() => {
        const showFire1 = current.bossHP < BOSS_HP * 0.7;
        const showFire2 = current.bossHP < BOSS_HP * 0.55;
        const showFire3 = current.bossHP < BOSS_HP * 0.4;
        const showFire4 = current.bossHP < BOSS_HP * 0.25;
        const showFire5 = current.bossHP < BOSS_HP * 0.1;
        return [showFire1, showFire2, showFire3, showFire4, showFire5];
    }, [current.bossHP]);

    const [cannon0Hit, cannon1Hit, cannon2Hit] = useMemo(() => {
        const cannon0Hit = current.bosshit.indexOf(0) >= 0;
        const cannon1Hit = current.bosshit.indexOf(1) >= 0;
        const cannon2Hit = current.bosshit.indexOf(2) >= 0;
        return [cannon0Hit, cannon1Hit, cannon2Hit];
    }, [current.bosshit.length])

    return (
        <Layer visible={isInBossBattle}>
            <SpineCount_BossShip ref={boss} x={270} y={300} scale={0.5} playing={isInBossBattle} actions={actions} repeat={0} onComplete={onBossComplete}></SpineCount_BossShip>
            <SpineCount_ShipCannon ref={cannon0} playing={isInBossBattle} repeat={1} onLoop={cannonLoop.bind(null, 0)} onComplete={onCannonComplete.bind(null, 0)} timeScale={1.52}></SpineCount_ShipCannon>
            <SpineCount_ShipCannon ref={cannon1} playing={isInBossBattle} repeat={1} onLoop={cannonLoop.bind(null, 1)} onComplete={onCannonComplete.bind(null, 1)} timeScale={1.52}></SpineCount_ShipCannon>
            <SpineCount_ShipCannon ref={cannon2} playing={isInBossBattle} repeat={1} onLoop={cannonLoop.bind(null, 2)} onComplete={onCannonComplete.bind(null, 2)} timeScale={1.52}></SpineCount_ShipCannon>

            <BulletHitPlayer playing={cannon0Hit} column={0} onShake={onPlayerShake} onHited={onHitedPlayer.bind(null, 0)}></BulletHitPlayer>
            <BulletHitPlayer playing={cannon1Hit} column={1} onShake={onPlayerShake} onHited={onHitedPlayer.bind(null, 1)}></BulletHitPlayer>
            <BulletHitPlayer playing={cannon2Hit} column={2} onShake={onPlayerShake} onHited={onHitedPlayer.bind(null, 2)}></BulletHitPlayer>

            <AnimatedSheet_FireIdle blendMode={BLEND_MODES.SCREEN} scale={[1, -1]} ref={fire1} isPlaying={showFire1} visible={showFire1}></AnimatedSheet_FireIdle>
            <AnimatedSheet_FireIdle blendMode={BLEND_MODES.SCREEN} scale={[1, -1]} ref={fire2} isPlaying={showFire2} visible={showFire2}></AnimatedSheet_FireIdle>
            <AnimatedSheet_FireIdle blendMode={BLEND_MODES.SCREEN} scale={[1, -1]} ref={fire3} isPlaying={showFire3} visible={showFire3}></AnimatedSheet_FireIdle>
            <AnimatedSheet_FireIdle blendMode={BLEND_MODES.SCREEN} scale={[1, -1]} ref={fire4} isPlaying={showFire4} visible={showFire4}></AnimatedSheet_FireIdle>
            <AnimatedSheet_FireIdle blendMode={BLEND_MODES.SCREEN} scale={[1, -1]} ref={fire5} isPlaying={showFire5} visible={showFire5}></AnimatedSheet_FireIdle>

            <Layer>
                {
                    Object.keys(bulletHitBossMap).map((inColumn, index) => {
                        const column = Number(inColumn);
                        const item = bulletHitBossMap[column];
                        const { delay, isGold, gunInRow, hp } = item;
                        return <BulletHitBoss key={`hitBoss${showCannonId}${index}`} hp={hp} delay={delay} inColumn={column} gunInRow={gunInRow} isGold={isGold} onShake={onBossShake.bind(null, hp)}></BulletHitBoss>
                    })
                }
            </Layer>
            <Sound sound='Wrecking Ship Sound' playing={isDestory} allowStop={false}></Sound>
        </Layer>
    )
}

export function BulletHitBoss({ hp, delay, inColumn, gunInRow, isGold, onShake, ...layerProps }: ComponentProps<typeof Layer> & { hp: number, delay: number, inColumn: number, gunInRow: number, isGold: boolean, onShake?: () => void }) {
    const [step, setStep] = useState<'showWin' | 'explode' | 'shoot' | 'idle'>('shoot');
    const [isIdle, isShoot, isExplode, isShowWin] = useMemo(() => {
        const isIdle = step == 'idle';
        const isShoot = step == 'shoot';
        const isExplode = step == 'explode';
        const isShowWin = step == 'showWin';
        return [isIdle, isShoot, isExplode, isShowWin];
    }, [step])

    const [[startX, startY], [endX, endY], [offsetX, offsetY]] = useMemo(() => {
        const [startX, startY] = getCannonBulletPoint(inColumn, gunInRow, false);
        const [endX, endY] = HIT_BOSS_POINTS[inColumn];
        return [
            [startX, startY],
            [endX, endY],
            [startX - endX, startY - endY]
        ];
    }, [inColumn]);

    const png = useMemo(() => {
        return isGold ? GOLD_BULLET_PNG_NAME : IRON_BULLET_PNG_NAME;
    }, [isGold])

    function onTween1Complete() {
        setStep('explode');
        onShake && onShake();
    }
    return (
        <Layer>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={133} easing={Easing.Cubic.Out} playing={isExplode}>
                {
                    ({ k }) => {
                        const alpha = 1 - k;
                        const _scale = 1 + 0.7 * k;
                        return <Tween from={{ k: 0 }} to={{ k: 1 }} duration={I_PLAYER_CANNON_HIT_BOSS_DURATION} playing={isShoot} repeat={0} delay={delay} onComplete={onTween1Complete}>
                            {
                                ({ k }) => {
                                    const scale = (1 - (k < 0.5 ? (Easing.Quartic.Out(k * 2) * 0.2 * 1) : (0.2 + 0.3 * 1 * (k - 0.5) * 2))) * 1;
                                    const x = startX - (k < 0.5 ? (Easing.Quartic.Out(k * 2) * 1.1 * offsetX) : (1.1 * offsetX - 0.1 * offsetX * (k - 0.5) * 2));
                                    const y = startY - (k < 0.5 ? (Easing.Quartic.Out(k * 2) * 1.7 * offsetY) : (1.7 * offsetY - 0.7 * offsetY * (k - 0.5) * 2));
                                    return (
                                        <Layer {...layerProps} x={x} y={y} scale={scale * _scale} alpha={alpha} visible={isShoot}>
                                            <SpriteAtlas scale={0.2} name={png} anchor={0.5}></SpriteAtlas>
                                            <Sound sound='shoot' playing={k > 0} allowStop={false}></Sound>
                                        </Layer>
                                    )
                                }
                            }
                        </Tween>
                    }
                }
            </Tween>
            <Sound sound={`explosion_boss`} playing={isExplode} allowStop={false}></Sound>
            <SheetExplosion x={endX} y={endY} scale={1} repeat={1} anchor={0.5} isPlaying={isExplode} startFrame={0} onRepeatComplete={setStep.bind(null, 'showWin')}></SheetExplosion>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={2000} playing={isShowWin} onComplete={setStep.bind(null, 'idle')}>
                {
                    ({ k }, playing) => {
                        let _k: number = 0;
                        if (k < 0.3) {
                            _k = Easing.Cubic.Out(k / 0.3);
                        } else {
                            _k = 1;
                        }
                        const y = _k * -40;
                        const scale = _k;
                        const alpha = k < 0.8 ? 1 : 1 - (k - 0.8) / 0.2;
                        return <Layer x={endX + 10} y={endY + y} alpha={alpha}>
                            <Spine_BossFightText x={0} y={0} scale={0.15} actions={useMemoConstant([[0, 'chase_enter', false], [0, 'chase_idle', false]])} playing={playing}></Spine_BossFightText>
                            <BitmapText anchor={[0.5, 0.3]} scale={scale} text={`${hp}HP`} style={{ fontName: R_Font_Gold, fontSize: 100, letterSpacing: -6 }} />
                        </Layer>
                    }
                }
            </Tween>
        </Layer> 
    )
}

export function BulletHitPlayer({ playing, column, onShake, onHited }: { playing: boolean, column: number, onShake?: () => void, onHited?: () => void }) {
    const [step, setStep] = useState<'explode' | 'shoot' | 'idle'>('idle');

    const [isIdle, isShoot, isExplode] = useMemo(() => {
        const isIdle = step == 'idle';
        const isShoot = step == 'shoot';
        const isExplode = step == 'explode';
        return [isIdle, isShoot, isExplode];
    }, [step])

    const [
        [startX, startY],
        [endX, endY],
        [offsetX, offsetY],
        [explosionX, explosionY]
    ] = useMemo(() => {
        const [startX, startY] = [[195, 278], [295, 278], [395, 278]][column];
        const [endX, endY] = [[195, 608], [295, 588], [395, 608]][column];
        return [
            [startX, startY],
            [endX, endY],
            [startX - endX, startY - endY],
            [[3, 400], [108, 380], [213, 400]][column]
        ]
    }, [column])

    useMemo(() => {
        if (playing) {
            setStep('shoot');
        } else {
            setStep('idle');
        }
    }, [playing])

    function onTween1Complete() {
        setStep('explode');
        onShake && onShake();
    }

    function onTween2Complete() {
        setStep('idle');
        onHited && onHited();
    }

    return (
        <Layer visible={!isIdle}>
            <Tween from={{ k: 0 }} to={{ k: 1 }} duration={I_BOSS_CANNON_HIT_PLAYER_DURATION} playing={isShoot} repeat={0} onComplete={onTween1Complete}>
                {
                    ({ k }) => {
                        const scale = (0.11 + (k < 0.5 ? Easing.Cubic.Out((k) * 2) * 0.1 : (0.1 + Easing.Cubic.In((k - 0.5) * 2) * 0.2)));
                        const x = startX - offsetX * k;
                        const y = startY + (k < 0.5 ? (Math.sin(k * Math.PI) * -70) : (-70 + Easing.Cubic.In((k - 0.5) * 2) * -offsetY));
                        return (
                            <Layer x={x} y={y} scale={scale} visible={isShoot}>
                                <SpriteAtlas scale={1} name={GOLD_BULLET_PNG_NAME} anchor={0.5}></SpriteAtlas>
                                <AnimatedSheet_CannonFire isPlaying={true} scale={3.3} anchor={[0.5, 0.55]} blendMode={BLEND_MODES.SCREEN}></AnimatedSheet_CannonFire>
                                <Sound sound={`fire_bosscannon`} playing={isShoot} allowStop={false}></Sound>
                            </Layer>
                        )
                    }
                }
            </Tween>
            <SheetExplosion x={explosionX} y={explosionY} scale={3} repeat={1} isPlaying={isExplode} onRepeatComplete={onTween2Complete}></SheetExplosion>
            <Sound sound={`explosion_player`} playing={isExplode} allowStop={false}></Sound>
        </Layer>
    )
}