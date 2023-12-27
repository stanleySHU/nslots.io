import { useMenoConstant } from "common/components/customhook";
import { GameStatusModel, KCurrentGameStatus } from "../status/type";
import { Spine_CannonCount } from "./base";
import { Layer, Orientation } from "common/components/layer";
import { SlotContext } from "common/model/context";
import { Languages } from "common/model/context/baseContext";
import { Rectangle } from "common/components/rectangle";

export function FiveOfAKind({ dataSource }: { dataSource: GameStatusModel }) {
    const { gameStatus, nextGameStatus, state } = dataSource.base!;
    const isShow5OAK = gameStatus == KCurrentGameStatus.show5oak;
    const {urlOptions} = SlotContext.Obj;

    function _onComplete(e: any) {
        if (e.animation.name == '5ofakind_ENTER') {
            nextGameStatus!();
        }
    }

    return (<Orientation>
        <Layer visible={isShow5OAK}>
            <Rectangle frame={[0,0,1170,1170]} alpha={0.5} color={0x000000} interactive={true}></Rectangle>
            <Spine_CannonCount playing={isShow5OAK} onComplete={_onComplete} x={585} y={585} l-scale={0.33} p-scale={0.25} skin={urlOptions.lang == Languages.Chinese ? 'CH' : 'EN'} actions={useMenoConstant([[0, '5ofakind_OUT', false], [0, '5ofakind_IDLE', false], [0, '5ofakind_ENTER', false]])} timeScale={0.8}></Spine_CannonCount>
        </Layer>
    </Orientation>
    )
}
