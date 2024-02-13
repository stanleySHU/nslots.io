import { cloneElement, useMemo, useRef } from "react";
import { GameStatusModel, KCurrentGameStatus } from "./type";
import { isBaseOfCannon, isGoldCannon, isLongCannon, isShortCannon } from '../widgets/utils'
import { cannonDelayTime } from "../widgets/config";
import { useDelayFrameOnce } from "common/components/customhook";

export type KCSMapmodel = {[key: number]: {cannonId: number, isGold: boolean, isLong: boolean, delay: number, order: number, rows: number[]}};

export const CannonStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch, gameStatus, nextGameStatus } = dataSource?.base!;
    const { spinModel } = state.spin;
    const { current } = useRef<{
        showCannonId: number,
        csMap: KCSMapmodel
    }>({
        csMap: {},
        showCannonId: 0
    });
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;

    useMemo(() => {
        if (isShowCannon) {
            current.showCannonId++;
            const map: any = {};
            const ss = spinModel!.ss;
            let i = 0;
            for (let [inColumn, cannonId] of spinModel!.cs) {
                let rows = [];
                if (isShortCannon(cannonId)) {
                    if (isBaseOfCannon(ss[1][inColumn])) {
                        rows = [0, 1];
                    } else {
                        rows = [1, 2];
                    }
                } else {
                    rows = [0, 1 , 2];
                }
                const order = i++;
                const delay = cannonDelayTime(order)
                const isGold = isGoldCannon(cannonId);
                const isLong = isLongCannon(cannonId);
                map[inColumn] = {cannonId, rows, order: order, delay: delay, isGold, isLong}
            }  
            current.csMap = map;
        }
    }, [isShowCannon]);

    const _dataSource: GameStatusModel = {
        ...dataSource,
        cannon: {
            showCannonId: current.showCannonId,
            csMap: current.csMap
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}