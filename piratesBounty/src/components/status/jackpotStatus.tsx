import { cloneElement, useMemo, useRef, useState } from "react";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "./type";
import { IPointData } from "pixi.js";
import { useTick } from "@pixi/react";
import { SlotContext } from "common/model/context";
import { IWinJackpotDuration } from "../widgets/winJackpot";

export type IWinJackpotArr = { keyId: number,  point: IPointData, jpValue: number, currentTime: number, increaseJp: number, delay: number }[];

export const JackpotStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch, gameStatus, gameStep } = dataSource?.base!;
    const { fleet } = dataSource?.fleet!;
    const { showCannonId } = dataSource?.cannon!;
    const [forceUpdate, setForceUpdate] = useState(false);
    const { spinModel } = state.spin;
    const { current } = useRef<{
        jpValue: number,
        lastJpValue: number,
        getJpInfoTween: IWinJackpotArr
    }>({
        jpValue: 0,
        lastJpValue: 0,
        getJpInfoTween: [],
    });
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;

    useMemo(() => {
        if (spinModel) {
            current.jpValue = spinModel.jackpot;
            current.lastJpValue = spinModel.jackpot;
        }
    }, []);

    useMemo(() => {
        if (isInShipBattle) {
            current.jpValue = spinModel!.jackpot;
            current.lastJpValue = spinModel!.jackpot;
        }
    }, [isInShipBattle]);

    useMemo(() => {
        if (isShowCannon) {
            const currentTime = SlotContext.Obj.tweenTime;
            const jpValue = spinModel!.jackpot;
            const increasePoint = jpValue - current.lastJpValue;

            if (jpValue > current.lastJpValue) {
                const destoryShips = [];
                for (let ships of fleet) {
                    for (let ship of ships) {
                        if (ship.isDestory) {
                            destoryShips.push(ship);
                        }
                    }
                }
                const ship = destoryShips[Math.floor(Math.random() * destoryShips.length)];

                current.getJpInfoTween.push({
                    keyId: showCannonId,
                    delay: ship.destoryDelay,
                    point: {x: ship.inColumn,y: ship.inRow},
                    increaseJp: increasePoint,
                    jpValue: jpValue,
                    currentTime: currentTime
                })
            }
            current.lastJpValue = jpValue;
        }
    }, [isShowCannon]);

    useTick(() => {
        const currentTime = SlotContext.Obj.tweenTime;
        let getJpArr: IWinJackpotArr = [];
        let existChange = false;

        for (let item of current.getJpInfoTween) {
            if (item.currentTime + item.delay + IWinJackpotDuration <= currentTime) {
                if (item.jpValue > current.jpValue) current.jpValue = item.jpValue;
                existChange = true;
            } else {
                getJpArr.push(item);
            }
        }

        current.getJpInfoTween = getJpArr;
        if (existChange) setForceUpdate(!forceUpdate);
    }, current.getJpInfoTween.length > 0);

    const _dataSource = {
        ...dataSource,
        jackpot: {
            jpValue: current.jpValue,
            getJpInfoTween: current.getJpInfoTween
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}