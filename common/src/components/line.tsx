import { Graphics } from "@pixi/react"
import { Graphics as pixiGraphics } from "pixi.js";
import { forwardRef, useCallback } from "react";

export interface KLineOptions {
    path?: [number, number][],
    width: number,
    color: number,
    border?: number,
    borderColor?: number
}

const _ = ({path, width, color, border, borderColor, ...props}: KLineOptions, ref) => {
    function drawBy(g: pixiGraphics) {
        g.moveTo(...path[0]);
        for (let i = 1;  i < path.length; i++) {
            g.lineTo(...path[i]);
        }
    }

    const draw = useCallback((g: pixiGraphics) => {
        g.clear();
        if (border) {
            g.lineStyle(border * 2 + width, borderColor, 1);
            drawBy(g);
        }
        g.lineStyle(width, color, 1)
        drawBy(g);
        g.endFill();
    }, [path, width, color, border, borderColor]);
    return <Graphics ref={ref} draw={draw} {...props}/>;
}

export const Line = forwardRef(_);