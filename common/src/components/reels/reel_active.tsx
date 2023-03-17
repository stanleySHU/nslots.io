
import { useContext } from "react";
import { GameContext } from "../../AppContext";
import { getComponent } from "../../other/register";
import { KComponentOptions, Layer } from "../layer";

export interface KReelOptions extends KComponentOptions {
    row: number,
    symbol: number
}
export const ReelActive = ({children, row, symbol, ...props}: KReelOptions) => {
    const Symbol = getComponent('symbolActive');
    const symbolFrame = useContext(GameContext).state.game.table.symbolFrame;
    return (
        <Layer {...props}>
            <Symbol sIndex={symbol} y={row * symbolFrame[1]}></Symbol>
        </Layer>
    )
}

