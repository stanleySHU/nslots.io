import { cloneElement, useMemo, useRef, useState } from "react";
import { GameStatusModel, KCurrentGameStatus } from "./type";
import { IPointData } from "pixi.js";
import { SlotContext } from "common/model/context";
import { useTick } from "@pixi/react";
import { I_WIN_POINT_FROM_SHIP_DURATION } from "../widgets/config";

export type IWinPointTweenArr = { point: IPointData, pt: number, delay: number, currentTime: number }[];

export const PointsStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, gameStatus } = dataSource?.base!;
    const { fleet } = dataSource?.fleet!;
    const { spinModel } = state.spin!;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { current } = useRef<{
        accPoints: number,
        destoryShipsPoint: IWinPointTweenArr,
        activeWinShipPoint: IWinPointTweenArr
    }>({
        accPoints: 0,
        destoryShipsPoint: [],
        activeWinShipPoint: []
    }); 
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;
    const isShowWinAmount = gameStatus == KCurrentGameStatus.showWinAmount;

    useMemo(() => {
        if (spinModel) {
            current.accPoints = spinModel.accPoints;
        }
    }, []);

    useMemo(() => {
        if (isShowWinAmount) {
            current.accPoints = 0;
        }
    }, [isShowWinAmount])

    useMemo(() => {
        if (isShowCannon) {
            const currentTime = SlotContext.Obj.tweenTime;
            for (let ships of fleet) {
                for (let ship of ships) {
                    if (ship.isDestory) {
                        current.destoryShipsPoint.push({
                            point: {x: ship.inColumn, y: ship.inRow},
                            delay: ship.destoryDelay,
                            currentTime: currentTime,
                            pt: ship.pt
                        });
                    }
                }
            }
        }
    }, [isShowCannon]);

    useTick(() => {
        const currentTime = SlotContext.Obj.tweenTime;
        const oldDestoryShipsPoint = [];
        const newActiveWinShipPoint = []
        let existChange = false;
        for (let item of current.destoryShipsPoint) {
            if (currentTime >= item.currentTime + item.delay) {
                newActiveWinShipPoint.push(item);
                existChange = true;
            } else {
                oldDestoryShipsPoint.push(item);
            }
        }

        const oldActiveWinShipPoint = []
        for (let item of current.activeWinShipPoint) {
            if (currentTime >= item.currentTime + item.delay + I_WIN_POINT_FROM_SHIP_DURATION + 100) {
                current.accPoints += item.pt;
                existChange = true;
            } else {
                oldActiveWinShipPoint.push(item);
            }
        }

        current.destoryShipsPoint = oldDestoryShipsPoint;
        current.activeWinShipPoint = oldActiveWinShipPoint.concat(newActiveWinShipPoint);
        if (existChange) setForceUpdate(!forceUpdate);
    }, current.destoryShipsPoint.length > 0 || current.activeWinShipPoint.length > 0);

    const _dataSource = {
        ...dataSource,
        points: {
            accPoints: current.accPoints,
            activeWinShipPoint: current.activeWinShipPoint
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}