import { ComponentProps, useMemo, useRef } from "react";
import { Layer } from "common/components/layer";
import { SpriteAtlas } from "common/components/sprite";
import { I_Spine_All, Spine_All } from "./base";


export const Symbol = ({ inSpin, inBlur, selected, active, ...layerProps }: { inSpin: boolean, inBlur: boolean, selected: number, active: boolean } & ComponentProps<typeof Layer>) => {
    const { current } = useRef<{ action: any }>({ action: null });
    const showPng = (inSpin || selected <= 8) && !active;
    const showSpine = !inSpin && selected > 8 && !active;

    const action = useMemo(() => {
        if (showSpine) {
            const action = [
                [0, 'HP_Geisha_IDLE', true],
                [0, 'SCATTER_IDLE', true],
                [0, 'WILD_IDLE', true]
            ][selected - 9];
            current.action = action;
            return action;
        }
        return current.action;
    }, [selected, inSpin])

    return (
        <Layer {...layerProps}>
            <SpriteAtlas visible={showPng} name={`${selected}${inBlur ? 'b' : ''}.png`} anchor={0.5}></SpriteAtlas>
            <Spine_All visible={showSpine} playing={showSpine} scale={0.5} action={action} timeScale={1} toFrameOneWhenStop={true}></Spine_All>
        </Layer>
    )
};

export const SymbolActive = ({  selected, onComplete,  ...layerProps }: { selected: number, onComplete?: (symbol: number) => void } & ComponentProps<typeof Layer>) => {
    
    function onLoop(count: number) {
        if (count % 1 == 0) {
            onComplete && onComplete(selected);
        }
    }

    const action = useMemo<[number, I_Spine_All, boolean]>(() => {
        const actions: [number, I_Spine_All, boolean][] = [
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
        const action = actions[selected];
        return action;
    }, [selected])

    return (
        <Layer {...layerProps}>
            <Spine_All playing={true} scale={0.5} action={action} timeScale={1} toFrameOneWhenStop={true} onLoop={onLoop.bind(null, selected)}></Spine_All>
        </Layer>
    )
}

// export const Symbol = ({ inSpin, inBlur, fast, selected, active, onComplete, cover = false, ...layerProps }: { inSpin: boolean, inBlur: boolean, fast: boolean, selected: number, active: boolean, cover: boolean, onComplete?: (symbol: number) => void } & ComponentProps<typeof Layer>) => {
//     const _selected = selected + (active ? 12 : 0);

//     function onLoop(count: number) {
//         if (count % 1 == 0) {
//             onComplete && onComplete(selected);
//         }
//     }

//     const [actions, playing] = useMemo<[[number, I_Spine_All, boolean], boolean]>(() => {
//         const _actions = [
//             [0, 'LP_10_WIN', false],
//             [0, 'LP_J_WIN', false],
//             [0, 'LP_Q_WIN', false],
//             [0, 'LP_K_WIN', false],
//             [0, 'LP_A_WIN', false],
//             [0, 'HP_Slipper_WIN', false],
//             [0, 'HP_FAN_WIN', false],
//             [0, 'HP_Umbrella_WIN', false],
//             [0, 'HP_Mask_WIN', false],
//             [0, 'HP_Geisha_IDLE', true],
//             [0, 'SCATTER_IDLE', true],
//             [0, 'WILD_IDLE', true],

//             [0, 'LP_10_WIN', true],
//             [0, 'LP_J_WIN', true],
//             [0, 'LP_Q_WIN', true],
//             [0, 'LP_K_WIN', true],
//             [0, 'LP_A_WIN', true],
//             [0, 'HP_Slipper_WIN', true],
//             [0, 'HP_FAN_WIN', true],
//             [0, 'HP_Umbrella_WIN', true],
//             [0, 'HP_Mask_WIN', true],
//             [0, 'HP_Geisha_WIN', true],
//             [0, 'SCATTER_WIN', true],
//             [0, 'WILD_WIN', true]
//         ];

//         return [_actions[_selected], _selected > 8]
//     }, [_selected]);

//     return <Layer {...layerProps}>
//         <SpriteAtlas visible={inBlur} name={`${selected}b.png`} anchor={0.5}></SpriteAtlas>
//         <Spine_All visible={!inBlur} playing={playing && !inSpin && !inBlur} scale={0.5} action={actions} timeScale={1} toFrameOneWhenStop={true} repeat={1} onLoop={onLoop.bind(null, _selected)}></Spine_All>
//     </Layer>
// }