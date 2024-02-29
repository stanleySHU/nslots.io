import { Layer } from "common/components/layer";
import { Rectangle } from "common/components/rectangle";
import { Polygon } from "common/components/polygon";
import { Label, LabelLang } from "common/components/text";
import { Selecter as _Selecter } from "common/components/selecter";
import { Button, SButton } from "common/components/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { Tween } from "common/components/tween";
import { Easing } from "@tweenjs/tween.js";
import { SlotContext } from "common/model/context";
import { I_RESIZE } from "common/services/layoutService";
import { MaskLayer } from "common/components/maskLayer";
import { SpriteAtlas } from "common/components/sprite";
import { I_LOCAL_BET_AMOUNT } from "common/services/localStorage";

export function Selecter({betAmount, on, onClose, onSelectedChange, lineBets }: { betAmount: number, on: boolean, onClose: () => void, onSelectedChange?: (e: number) => void, lineBets: number[] | string[] }) {
    const [top, setTop] = useState(0);
    const { current } = useRef<{inScroll: boolean}>({inScroll: false});
    const slotContext = SlotContext.Obj;

    useEffect(() => {
        const func = () => {
            const [left, top, width, height] = slotContext.viewport;
            const { displayArea: [displaLeft, displayTop, displayWidth, displayHeight], safeArea } = slotContext.layoutOptions;
            setTop(-top + height + displayTop);
        }
        func();
        slotContext.notice.on(I_RESIZE, func);
        return () => {
            slotContext.notice.off(I_RESIZE, func);
        }
    }, []);

    const selected = useMemo(() => {
        return lineBets.map(e => Number(e)).indexOf(betAmount); 
    }, [betAmount]);

    function onScrollStart() {
        current.inScroll = true;
    }

    function onScrollEnd() {
        current.inScroll = false;
    }

    function _onClose() {
        !current.inScroll && onClose && onClose();
    }

    return (
        <Layer>
            <SButton click={_onClose} hitFrame={[0, 0, 1170, 1170]} visible={on}></SButton>
            <Tween dep={[on]} from={{ k: 0 }} to={{ k: 1 }} playing={true} duration={300} easing={Easing.Cubic.In}>
                {
                    ({ k }) => {
                        const y = (on ? -380 * k : 1000) + top;
                        return (
                            <Layer y={y}>
                                <Rectangle frame={[0, 0, 1170, 380]} color={0x1d2037} alpha={0.9} interactive={true}></Rectangle>
                                <Layer>
                                    <LabelLang x={585} y={20} anchor={0.5} text={'betamount'} style={{ fill: '#ffffff', fontFamily: 'Verdana', fontWeight: 'bold', fontSize: 23 }}></LabelLang>
                                </Layer>
                                <Layer y={173}>
                                    <Rectangle frame={[0, 0, 1170, 60]} alpha={0.72}></Rectangle>
                                    <Rectangle frame={[0, 0, 1170, 1]} color={0xfeb208}></Rectangle>
                                    <Rectangle frame={[0, 0, 1170, 1]} color={0xfeb208} y={57}></Rectangle>
                                    <Polygon x={775} y={15} path={[[0, 0], [0, 30], [-15, 15]]} color={0xfeb208} ></Polygon>
                                    <Polygon x={400} y={15} path={[[0, 0], [0, 30], [15, 15]]} color={0xfeb208} ></Polygon>
                                </Layer>
                                <MaskLayer>
                                    <_Selecter hitFrame={[0, -270, 1170, 500]} selected={selected} cellHeight={60} y={203} onSelectedChange={onSelectedChange} onScrollStart={onScrollStart} onScrollEnd={onScrollEnd}>
                                        {
                                            lineBets.map((item, index) => {
                                                return <Label key={`selecterItem${index}`} x={585} y={25} anchor={0.5} text={`${item}`} style={{ fill: '#ffffff', fontWeight: '500', fontSize: 50 }}></Label>
                                            })
                                        }
                                    </_Selecter>
                                    <SpriteAtlas name="selecter_mask.png" scale={[234, 2]} y={35} ></SpriteAtlas>
                                </MaskLayer>
                            </Layer>
                        )
                    }
                }
            </Tween>
        </Layer>
    )
}