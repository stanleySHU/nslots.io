import { cloneElement, useMemo, useRef } from "react";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "./type";
import { IPointData } from "pixi.js";
import { CANNOM_HIT_BOSS_HP_MAP, bulletDelayTime, bulletHitOtherShipDelay } from "../widgets/config";

export type IBulletInfo = {[key: number]: {cannonId: number, isGold: boolean, isFromLong: boolean, delay: number, targetPoints?: IPointData, gunInRow: 0 | 1}};
export type IBulletHitBossInfo = {[key: number]: {cannonId: number, isGold: boolean, delay: number, gunInRow: 0 | 1, hp: number}};

export const ButtleStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch, gameStatus, gameStep } = dataSource?.base!;
    const { csMap } = dataSource!.cannon!;
    const { destoryShipsMap } = dataSource!.fleet!;
    const { spinModel } = state.spin;
    const { current } = useRef<{
        bulletHitShipMap: IBulletInfo,
        bulletHitCaptialMap: IBulletInfo,
        bulletHitOtherShipMap: IBulletInfo,
        bulletHitBossMap: IBulletHitBossInfo,
    }>({
        bulletHitShipMap: {},
        bulletHitCaptialMap: {},
        bulletHitOtherShipMap: {},
        bulletHitBossMap: {}
    });
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;

    useMemo(() => {
        if (isShowCannon) {
            const bulletHitShipMap: any = {};
            const bulletHitCaptialMap: any = {};
            const bulletHitOtherShipMap: any = {};
            const bulletHitBossMap: any = {};
            if (isInShipBattle) {
                for (let inColumn in csMap) {
                    const column = Number(inColumn);
                    const { ship, subShips } = destoryShipsMap[column];
                    const targetPoints = ship.point;
                    const { cannonId, order, isGold, isLong, rows } = csMap[column];
                    const gunInRow = rows[0];
                    let delay = bulletDelayTime(order, cannonId);
                    const obj = { cannonId, targetPoints, isGold, isFromLong: isLong, delay, gunInRow };
                    if (targetPoints) {
                        bulletHitShipMap[column] = { ...obj };
                    } else {
                        bulletHitCaptialMap[column] = { ...obj };
                    }
                    if (subShips.length > 0) {
                        delay = bulletHitOtherShipDelay(order, cannonId);
                        bulletHitOtherShipMap[column] = { targetPoints, delay };
                    }
                }
            } else {
                for (let inColumn in csMap) {
                    const column = Number(inColumn);
                    const { cannonId, order, isGold, isLong, rows } = csMap[column];
                    let delay = bulletDelayTime(order, cannonId);
                    bulletHitBossMap[column] = {
                        cannonId: cannonId,
                        delay: delay,
                        gunInRow: rows[0],
                        isGold: isGold,
                        hp: CANNOM_HIT_BOSS_HP_MAP[cannonId]
                    }
                }
            }

            current.bulletHitShipMap = bulletHitShipMap;
            current.bulletHitCaptialMap = bulletHitCaptialMap;
            current.bulletHitOtherShipMap = bulletHitOtherShipMap;
            current.bulletHitBossMap = bulletHitBossMap;
        }
    }, [isShowCannon]);

    const _dataSource = {
        ...dataSource,
        bullet: {
            bulletHitShipMap: current.bulletHitShipMap,
            bulletHitCaptialMap: current.bulletHitCaptialMap,
            bulletHitOtherShipMap: current.bulletHitOtherShipMap,
            bulletHitBossMap: current.bulletHitBossMap
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}