import { getComponent } from "../../other/register";
import { KComponentOptions, Layer } from "../layer";
import { KAnimationSymbolPropsOptions } from './animation';

export interface KReelOptions extends KComponentOptions {
    symbolStates?: KAnimationSymbolPropsOptions[]
}
export const Reel = ({children, symbolStates, ...props}: KReelOptions) => {
    const Symbol = getComponent('symbol');

    return <Layer {...props}>
        {
            symbolStates.map(({id, ...symbolProps}, i) => {
                return <Symbol key={`symbol_${i}`} {...symbolProps}></Symbol>
            })
        }
    </Layer>
}