import { R_Symbol } from "common/assets";
import { ComponentProps, useMemo } from "react";
import { Layer, KLayerOptions } from "common/components/layer";
import { SpriteAtlas, SpriteAtlasLang } from "common/components/sprite";
import { Options, KSlideOptions } from 'common/components/slide';
import { SlotContext } from "common/model/context";
import { R_Symbol_Active } from "@/assets";
import { AnimatedSheet_Scatter, AnimatedSheet_Wild, I_Spine_All, Spine_CannonCount } from "./base";
import { Rectangle } from "common/components/rectangle";

// 
export const Symbol = ({inSpin, inBlur, fast, selected, active, onComplete, cover = false, ...layerProps}: {inSpin: boolean, inBlur: boolean, fast: boolean, selected: number, active: boolean, cover: boolean, onComplete?: (symbol: number) => void} & ComponentProps<typeof Layer>) => {
    const _selected = selected + (active ? 12 : 0);

    function onLoop(count: number) {
        if (count % 1 == 0) {
            onComplete && onComplete(selected);
        }
    }

    const [actions, playing] = useMemo<[[number, I_Spine_All, boolean], boolean]>(() => {
        const _actions = [
            [0, 'LP_10_WIN', false],
            [0, 'LP_J_WIN', false],
            [0, 'LP_Q_WIN', false],
            [0, 'LP_K_WIN', false],
            [0, 'LP_A_WIN', false],
            [0, 'HP_Slipper_WIN', false], 
            [0, 'HP_FAN_WIN', false],
            [0, 'HP_Umbrella_WIN', false],
            [0, 'HP_Mask_WIN', false],
            [0, 'HP_Geisha_IDLE', true],
            [0, 'SCATTER_IDLE', true],
            [0, 'WILD_IDLE', true],

            [0, 'LP_10_WIN', true],
            [0, 'LP_J_WIN', true],
            [0, 'LP_Q_WIN', true],
            [0, 'LP_K_WIN', true],
            [0, 'LP_A_WIN', true],
            [0, 'HP_Slipper_WIN', true], 
            [0, 'HP_FAN_WIN', true],
            [0, 'HP_Umbrella_WIN', true],
            [0, 'HP_Mask_WIN', true],
            [0, 'HP_Geisha_WIN', true],
            [0, 'SCATTER_WIN', true],
            [0, 'WILD_WIN', true]
        ];

        return [_actions[_selected], _selected > 8]
    }, [_selected]);

    const showScatter = _selected === 10 || _selected === 22;
    const showWild = _selected === 11 || _selected === 23;

    const showScatterPlaying = _selected === 22;
    const showWildPlaying = _selected === 23;


    return <Layer {...layerProps}>
        {
            inBlur ? <SpriteAtlas name={`${selected}b.png`} anchor={0.5}></SpriteAtlas> : <Spine_CannonCount playing={playing && !inSpin} scale={0.5} action={actions} timeScale={1} toFrameOneWhenStop={true} repeat={1} onLoop={onLoop.bind(null, _selected)}></Spine_CannonCount>

        }
        {/* <SpriteAtlas name={`${selected}.png`} anchor={0.5}></SpriteAtlas>
        <Spine_CannonCount playing={playing && visible} scale={0.5} action={actions} timeScale={1} toFrameOneWhenStop={true} repeat={1} onLoop={onLoop.bind(null, _selected)}></Spine_CannonCount> */}
        <Layer visible={showScatter && !inBlur}>
            <SpriteAtlasLang x={0} y={40} name="Scatter.png" anchor={0.5}></SpriteAtlasLang>
            <AnimatedSheet_Scatter x={3} y={40} isPlaying={showScatterPlaying} anchor={0.5} animationSpeed={1}></AnimatedSheet_Scatter>
        </Layer>
        <Layer visible={showWild && !inBlur}>
            <SpriteAtlasLang x={0} y={37} name="Wild.png" anchor={0.5}></SpriteAtlasLang>
            <AnimatedSheet_Wild x={3} y={37} isPlaying={showWildPlaying} anchor={0.5} animationSpeed={1}></AnimatedSheet_Wild>
        </Layer>
        <Rectangle visible={cover} frame={[-50,-50,98,101]} alpha={0.6}></Rectangle>
    </Layer>
}