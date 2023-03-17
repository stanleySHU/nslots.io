import { getSymbol } from "../../../other/register";
import { KComponentOptions, Layer } from "../../layer";

export interface kSymbolOptions extends KComponentOptions {
    sIndex?: number,
}

export const Symbol = ({sIndex = 0, ...props}: kSymbolOptions) => {
    const Symbol = getSymbol('symbolActive', sIndex);

    return <Layer {...props}>
        <Symbol></Symbol>
    </Layer>
}