import { R_Symbol } from "common/assets";
import { Layer } from "common/components/layer";
import { Slide } from "common/components/slide";
import { SpriteAtlas } from "common/components/sprite";
import { ComponentProps, useMemo } from "react";
import { I_SYMBOL_FREE, I_SYMBOL_SUPER_FREE } from "./config";
import { ISpine_Hyper, Spine_Hyper } from "./base";

export function Barrel({ selected, inSpin, ...layerProps }: { inSpin: boolean, selected: number } & ComponentProps<typeof Layer>) {

    const actions = useMemo<[number, ISpine_Hyper, boolean][]>(() => {
        return {
            '7': [[0, 'freegame_smallUI2', false], [0, 'hyper_normal', false], [0, 'freegame_smallUI2', true]],
            '8': [[0, 'hyper_rainbow_smallUI', false], [0, 'hyper_normal', false], [0, 'hyper_rainbow_smallUI', true]]
        }[selected]
    }, [selected]);

    const anchor = 0.5, scale = 0.65;
    const showPng = selected <= 6 || inSpin;
    const showSpine = !showPng
    
    return (
        <Layer {...layerProps}>
            <SpriteAtlas name={`${selected}.png`} res={R_Symbol} visible={showPng} anchor={anchor} scale={scale}></SpriteAtlas>
            <Spine_Hyper visible={showSpine} playing={showSpine} x={0} y={27} scale={0.5} actions={actions}></Spine_Hyper> 
        </Layer>
    )
}