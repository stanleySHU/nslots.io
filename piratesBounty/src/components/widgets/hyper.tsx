import { Layer } from "common/components/layer";
import { useMemo, useRef, useState } from "react";
import { ISpine_Hyper, Spine_Hyper } from "./base";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Sound } from "common/components/sound";
import { useDelayFrameOnce } from "common/components/customhook";

export function Hyper({dataSource}: { dataSource: GameStatusModel }) {
    const { gameStatus, nextGameStatus, state } = dataSource.base!;
    const { current } = useRef<{ lastFsCount: number, increaseFsCount: number}>({ lastFsCount: 0, increaseFsCount: 0});
    const [isShowGetFree, setIsShowGetFree] = useState(false);
    const { spinModel } = state.spin!;
    const isShowGetFreeSpin = gameStatus == KCurrentGameStatus.showGetFreeSpin;

    useMemo(() => {
        if (spinModel) {
            const fsCount = spinModel.fs;
            current.increaseFsCount = fsCount - current.lastFsCount;
            current.lastFsCount = fsCount;
        }
    }, [spinModel])

    const action = useMemo<[number, ISpine_Hyper, boolean]>(() => {
        return current.increaseFsCount > 4 ? [0, 'freegamehyper', false] : [0, 'freegame' ,false];
    }, [isShowGetFreeSpin]);

    useMemo(() => {
        if (!isShowGetFreeSpin) {
            setIsShowGetFree(false);
        }
    }, [gameStatus])

    useDelayFrameOnce(() => {
        setIsShowGetFree(true);
    }, 800, isShowGetFreeSpin)

    return (
        <Layer visible={isShowGetFree}> 
            <Spine_Hyper playing={isShowGetFree} x={270} y={540} action={action} scale={0.33} toFrameOneWhenStop={true} onComplete={nextGameStatus}></Spine_Hyper> 
            <Sound sound="welcome_fs" playing={isShowGetFree}></Sound>
        </Layer>
    )
}