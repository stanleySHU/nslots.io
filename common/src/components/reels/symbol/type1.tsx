import { getSymbol } from "../../../other/register";
import { KComponentOptions, Layer } from "../../layer";

export type KSymbolStatus = 'idle' | 'active';

export interface kSymbolOptions extends KComponentOptions {
    status?: KSymbolStatus;
    sIndex?: number
}

export const Symbol = ({sIndex = 0, status = 'idle', ...props}: kSymbolOptions) => {
    const SymbolIdle = getSymbol('symbol', sIndex);

    return <Layer {...props}>
        <Layer visible={status == 'idle'}>
            <SymbolIdle></SymbolIdle>
        </Layer>
        <Layer visible={status == 'active'}>
        </Layer>
    </Layer>
}