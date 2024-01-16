import { useFrame } from "common/components/customhook";
import { Layer } from "common/components/layer";
import { MaskLayer } from "common/components/maskLayer";
import { Rectangle } from "common/components/rectangle";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { SlideLoop } from 'common/components/slideloop';
import { ComponentProps, useState } from "react";

const IXs = [0, 105, 210, 315, 420];
const IYs = [0, 100, 200];
const I_P1_SS = [[5, 3, 4], [5, 2, 0], [5, 0, 2], [5, 3, 1], [6, 7, 0]];
const I_P2_SS = [[3, 1, 4], [1, 4, 0], [9, 4, 0], [3, 6, 0], [2, 0, 8]];
const I_P3_SS = [[0, 1, 8], [1, 3, 5], [0, 5, 3], [3, 5, 10], [2, 0, 10]];
const I_P4_SS = [[3, 1, 4], [3, 2, 4], [3, 11, 0], [2, 6, 4], [4, 1, 5]];

const I_P1_SS_Active = ['0_0', '1_0', '2_0', '3_0'];
const I_P2_SS_Active = ['1_2', '2_2', '3_2', '4_1'];
const I_P3_SS_Active = ['3_2', '4_2'];
const I_P4_SS_Active = ['0_2', '1_2', '2_1', '3_2'];

export function Demo({ ...layerProps }: ComponentProps<typeof Layer>) {
    const [page, setPage] = useState(0);

    useFrame(5000, () => {
        setPage(1);
    }, page == 0);

    useFrame(5000, () => {
        setPage(2);
    }, page == 1);

    useFrame(5000, () => {
        setPage(3);
    }, page == 2);

    useFrame(5000, () => {
        setPage(0);
    }, page == 3);

    return (
        <Layer {...layerProps}>
            <SpriteAtlas name="ContentFrame.png"></SpriteAtlas>
            <MaskLayer>
                <SlideLoop selected={page} onSelectedChange={setPage} y={0} x={0} size={[400, 320]} hitFrame={[-660,-380,1100,1100]}>
                    <Layer>
                        <Layer scale={0.7} x={30} y={30}>
                            {
                                I_P1_SS.map((ss, inColumn) => {
                                    return (
                                        <Layer key={`p1${inColumn}`} x={IXs[inColumn]}>
                                            {
                                                ss.map((s, inRow) => {
                                                    const tint = I_P1_SS_Active.indexOf(`${inColumn}_${inRow}`) >= 0 ? 0xffffff : 0x888888;
                                                    return (
                                                        <SpriteAtlas key={`p1_${inRow}`} y={IYs[inRow]} name={`${s}.png`} tint={tint}></SpriteAtlas>
                                                    )
                                                })
                                            }
                                        </Layer>
                                    )
                                })
                            }
                            <SpriteAtlasLang x={285} y={380} anchor={0.5} name="text3.png"></SpriteAtlasLang>
                        </Layer>
                    </Layer>
                    <Layer>
                        <Layer scale={0.7} x={30} y={30}>
                            {
                                I_P2_SS.map((ss, inColumn) => {
                                    return (
                                        <Layer key={`p1${inColumn}`} x={IXs[inColumn]}>
                                            {
                                                ss.map((s, inRow) => {
                                                    const tint = I_P2_SS_Active.indexOf(`${inColumn}_${inRow}`) >= 0 ? 0xffffff : 0x888888;
                                                    return (
                                                        <SpriteAtlas key={`p1_${inRow}`} y={IYs[inRow]} name={`${s}.png`} tint={tint}></SpriteAtlas>
                                                    )
                                                })
                                            }
                                        </Layer>
                                    )
                                })
                            }
                            <SpriteAtlasLang x={285} y={380} anchor={0.5} name="text4.png"></SpriteAtlasLang>
                        </Layer>
                    </Layer>
                    <Layer>
                        <Layer scale={0.7} x={30} y={30}>
                            {
                                I_P3_SS.map((ss, inColumn) => {
                                    return (
                                        <Layer key={`p1${inColumn}`} x={IXs[inColumn]}>
                                            {
                                                ss.map((s, inRow) => {
                                                    const tint = I_P3_SS_Active.indexOf(`${inColumn}_${inRow}`) >= 0 ? 0xffffff : 0x888888;
                                                    return (
                                                        <SpriteAtlas key={`p1_${inRow}`} y={IYs[inRow]} name={`${s}.png`} tint={tint}></SpriteAtlas>
                                                    )
                                                })
                                            }
                                        </Layer>
                                    )
                                })
                            }
                            <SpriteAtlasLang x={285} y={380} anchor={0.5} name="text2.png"></SpriteAtlasLang>
                        </Layer>
                    </Layer>
                    <Layer>
                        <Layer scale={0.7} x={30} y={30}>
                            {
                                I_P4_SS.map((ss, inColumn) => {
                                    return (
                                        <Layer key={`p1${inColumn}`} x={IXs[inColumn]}>
                                            {
                                                ss.map((s, inRow) => {
                                                    const tint = I_P4_SS_Active.indexOf(`${inColumn}_${inRow}`) >= 0 ? 0xffffff : 0x888888;
                                                    return (
                                                        <SpriteAtlas key={`p1_${inRow}`} y={IYs[inRow]} name={`${s}.png`} tint={tint}></SpriteAtlas>
                                                    )
                                                })
                                            }
                                        </Layer>
                                    )
                                })
                            }
                            <SpriteAtlasLang x={285} y={380} anchor={0.5} name="text1.png"></SpriteAtlasLang>
                        </Layer>
                    </Layer>
                </SlideLoop>
                <Rectangle frame={[27, 25, 400, 320]}></Rectangle>
            </MaskLayer>
        </Layer>
    )
}