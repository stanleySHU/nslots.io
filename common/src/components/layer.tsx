import { Container } from "@pixi/react";
import { Rectangle } from "pixi.js";
import { ComponentProps, useEffect, useState } from "react";

export interface KComponentOptions extends ComponentProps<typeof Container> {
    hitFrame?: [number, number, number, number]
    children?: any
}

export const Layer = ({hitFrame, children, ...props}: KComponentOptions) => {
    const [hitArea, setHitArea] = useState(null);

    useEffect(() => {
        if (hitFrame) {
            setHitArea(new Rectangle(...hitFrame));
        }
    }, []);

    return <Container hitArea={hitArea} {...props}>
        {children}
    </Container>
};