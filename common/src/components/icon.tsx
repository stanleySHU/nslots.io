import { KComponentOptions, Layer } from "./layer";
import { Line } from "./line";

interface KIconCloseOptions extends KComponentOptions {
    width?: number,
    color?: number,
    size?: number
}

export function IconClose({width = 2, color = 0xffffff, size = 50, ...props}: KIconCloseOptions) {
    return (
        <Layer {...props}>
            <Line width={2} color={0xffffff} path={[[0,0],[size, size]]}></Line>
            <Line width={2} color={0xffffff} path={[[0, size], [size, 0]]}></Line>
        </Layer>
    )
}