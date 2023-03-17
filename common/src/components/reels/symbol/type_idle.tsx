import { getSymbol } from "../../../other/register";
import { KComponentOptions, Layer } from "../../layer";

export interface kSymbolOptions extends KComponentOptions {
    sIndex?: number
}

export const Symbol = ({sIndex = 0, ...props}: kSymbolOptions) => {
    const SymbolIdle = getSymbol('symbol', sIndex);

    return <Layer {...props}>
        <SymbolIdle></SymbolIdle>
    </Layer>
}