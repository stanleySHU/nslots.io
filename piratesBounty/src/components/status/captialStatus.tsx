import { cloneElement, useMemo, useRef, useState } from "react";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "./type";
import { useTick } from "@pixi/react";
import { I_Explosion_Duration, I_PLAYER_CANNON_HIT_CAPTION_DURATION } from "../widgets/config";
import { SlotContext } from "common/model/context";


export type KCaptialHpReduce = {fromColumn: number, delay: number, lastHp: number, hp: number, currentTime: number};
export const CaptialStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, gameStatus, gameStep } = dataSource?.base!;
    const { bulletHitCaptialMap } = dataSource?.bullet!;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { spinModel } = state.spin;
    const { current } = useRef<{
        lstDistance: number,
        hp: number,
        hpReduceId: number,
        hpReduces: KCaptialHpReduce[],
        hpReduceMap: {[key: number]: KCaptialHpReduce},
        hpIncreaseId: number
    }>({
        lstDistance: 0,
        hp: 0,
        hpReduceId: 0,
        hpReduces: [],
        hpReduceMap: {},
        hpIncreaseId: 0,
    });
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;
    const isInShipBattle = gameStep == KGameStep.inShipBattle
    const isStopping = gameStatus == 'stopping';

    useMemo(() => {
        if (spinModel) {
            current.hp = spinModel.bossHP;
            current.lstDistance = spinModel.distance;
        }
    }, []);

    useMemo(() => {
        if (isInShipBattle) {
            current.hp = spinModel!.bossHP;
            current.lstDistance = spinModel!.distance;
        }
    }, [isInShipBattle])

    useMemo(() => {
        if (isShowCannon) {
            for (let inColumn in bulletHitCaptialMap) {
                const column = Number(inColumn);
                const currentTime = SlotContext.Obj.tweenTime;
                const item = bulletHitCaptialMap[column];
                current.hpReduces.push({
                    fromColumn: column,
                    currentTime: currentTime,
                    delay: item.delay + I_PLAYER_CANNON_HIT_CAPTION_DURATION,
                    lastHp: current.hp,
                    hp: spinModel!.bossHP
                })
            }

            const distance = spinModel!.distance;
            if (current.lstDistance > distance) {
                current.lstDistance = distance;
                
            }
        }
    }, [isShowCannon]);

    useMemo(() => {
        if (isStopping) {
            const bossHP = spinModel!.bossHP;
            if (bossHP > current.hp) {
                current.hpIncreaseId++;
            }
            current.hp = bossHP;
        }
    }, [isStopping]);

    useTick(() => {
        const newHpReduces = [];
        let existChange = false;
        const currentTime = SlotContext.Obj.tweenTime;
        for (let item of current.hpReduces) {
            if (currentTime >= item.currentTime + item.delay) {
                existChange = true;
                current.hpReduceId++;
                current.hpReduceMap[item.fromColumn] = item;
            } else {
                newHpReduces.push(item);
            }
        }

        for (let inColumn in current.hpReduceMap) {
            const column = Number(inColumn);
            const item = current.hpReduceMap[column];
            if (currentTime >= item.currentTime + item.delay + I_Explosion_Duration) {
                existChange = true;
                delete current.hpReduceMap[column];
            }
        }
        current.hpReduces = newHpReduces;
        if (existChange) setForceUpdate(!forceUpdate);
    }, current.hpReduces.length > 0)

    const _dataSource = {
        ...dataSource,
        captial: {
            hp: current.hp,
            distance: 4,
            hpReduceId: current.hpReduceId,
            hpReduceMap: current.hpReduceMap,
            hpIncreaseId: current.hpIncreaseId
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}