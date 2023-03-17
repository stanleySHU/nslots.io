import { Graphics } from "@pixi/react"
import { ComponentProps, forwardRef, useCallback } from "react";

interface KRectangleOptions extends ComponentProps<typeof Graphics> {
  frame?: [number, number, number, number],
  color?: number
}

const _ = ({frame = [0, 0, 100, 100], color, ...props}: KRectangleOptions, ref) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(color);
    g.drawRect(...frame);
    g.endFill();
  }, [...frame, color]);
  return <Graphics ref={ref} draw={draw} {...props}/>;
}

export const Rectangle = forwardRef(_);