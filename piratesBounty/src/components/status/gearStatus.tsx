import { cloneElement, useMemo, useRef } from "react";
import { GameStatusModel, KCurrentGameStatus } from "./type";
import { IPointData } from "pixi.js";
import { useDelayFrameOnce } from "common/components/customhook";


export const GearStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch, gameStatus, nextGameStatus } = dataSource?.base!;
    const { spinModel } = state.spin;
    const { current } = useRef<{activeReels: number[], respinReels: number[]}>({activeReels: [], respinReels: []});
    const isShowActiveGear = gameStatus == KCurrentGameStatus.showActiveGear;
    const isPlaying = gameStatus == 'spin' || gameStatus == 'stopping';

    useMemo(() => {
        if (isShowActiveGear) {
            current.activeReels = spinModel!.respinReels;
        }
    }, [isShowActiveGear]);

    useMemo(() => {
        if (isPlaying) {
            current.respinReels = spinModel?.respinReels || [];
            if (current.respinReels.length == 0) {
                current.respinReels = [0, 1, 2];
            }
            current.activeReels = [];
        } else {
            current.respinReels = [];
        }
    }, [isPlaying]);

    useDelayFrameOnce(() => {
        nextGameStatus();
    }, 800, isShowActiveGear)

    const _dataSource = {
        ...dataSource,
        gear: {
            activeReels: current.activeReels,
            respinReels: current.respinReels
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}