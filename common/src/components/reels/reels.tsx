import { Reel } from './reel';
// import { ReelsSpinAnimation } from './reelsSpinAnimation';
import { KComponentOptions, Layer } from "../layer";
import { useRef } from 'react';
import { getComponent } from '../../other/register';

export interface KReelsOptions extends KComponentOptions {
}

const Viewport = getComponent('viewport');
export const Reels = ({children, ...props}: KReelsOptions) => {
    return <Viewport {...props}>
        {children}
    </Viewport>
}