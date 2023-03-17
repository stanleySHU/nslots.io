import { useEffect, useState, cloneElement } from "react";
import { Tween as TWEEN } from "@tweenjs/tween.js";

interface KTweenOptions {
    playing: boolean,
    from: {[key: string]: number},
    to: {[key: string]: number},
    duration: number,
    repeat?: number,
    yoyo?: number,
    children
}

export function Tween({children, ...props}: KTweenOptions) {
    const {from, to, playing, duration, repeat} = props;
    const [res, setRes] = useState<{[key: string]: number}>({}); 
    const [tween, setTween] = useState<TWEEN<any>>(null);

    useEffect(() => {
        let tween = new TWEEN(from)
            .to(to, duration)
            .repeat(repeat)
            .onUpdate(k => {
                setRes({...k});
            });
        setTween(tween);
    }, [...Object.values(props)])

    useEffect(() => {
        if (tween) {
            if (playing) {
                tween.start();
            } else {
                tween.end().stop();
            }
        }
    }, [playing, tween]);

    return cloneElement(children, res)
}