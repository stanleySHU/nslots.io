import { Layer } from "common/components/layer";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "../status/type";
import { Spine_Banner1, Spine_Banner2, Spine_Banner3, Spine_Banner4, Spine_Banner5 } from "./base";
import { useMemo } from "react";
import { useMemoConstant } from "common/components/customhook";
import { Sound } from "common/components/sound";

export function Banner({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, gameStep } = dataSource.base!;

    const showBanner2 = gameStatus == KCurrentGameStatus.showBossIn;
    const showBanner3 = gameStatus == KCurrentGameStatus.bossHit;
    const showBanner5 = gameStatus == KCurrentGameStatus.showCannon && gameStep == KGameStep.InBossBattle;

    return (
        <Layer>
            {/* <Spine_Banner1 x={270} y={1100} scale={0.35} playing={true} action={[0, 'Banner1',false ]}></Spine_Banner1> */}
            <Spine_Banner2 x={270} y={1100} scale={0.35} playing={showBanner2} visible={showBanner2} action={useMemoConstant([0, 'Banner 2',false ])} timeScale={0.5} toFrameOneWhenStop={true}></Spine_Banner2>  
            <Spine_Banner3 x={270} y={1100} scale={0.35} playing={showBanner3} visible={showBanner3} action={useMemoConstant([0, 'Banner 3',false ])} toFrameOneWhenStop={true}></Spine_Banner3>
            {/* <Spine_Banner4 x={270} y={1100} scale={0.35} playing={true} action={[0, 'Banner 4',false ]}></Spine_Banner4> */}
            <Spine_Banner5 x={270} y={1100} scale={0.35} playing={showBanner5} visible={showBanner5} action={useMemoConstant([0, 'Banner 5',false ])} toFrameOneWhenStop={true}></Spine_Banner5>
            <Sound sound='Appearance sound' playing={showBanner3 || showBanner5} allowStop={true}></Sound>
        </Layer>
    )
}