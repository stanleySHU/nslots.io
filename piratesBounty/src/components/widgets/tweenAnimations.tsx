import { Tween } from "common/components/tween";
import { cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { GameStatusModel } from "../status/type";
import { Layer } from "common/components/layer";
import { SlotContext } from "common/model/context";

export const I_Screen_Shake = 'I_Screen_Shake';

export function ScreenShake({dataSource, children}: {dataSource: GameStatusModel, children: any}) {
    const [playing, setPlaying] = useState(false);

    const ranges = [0, 5, -4.5, 4, -3.5, 2.5, -1.5, 0.5];
    const length = ranges.length - 1;

    useEffect(() => {
        const slotContext = SlotContext.Obj;
        function onScreenShake() {
            setPlaying(true);
        }
        slotContext.notice.on(I_Screen_Shake, onScreenShake);
        return () => {
            slotContext.notice.off(I_Screen_Shake, onScreenShake);
        }
    }, []);

    return (
        <Tween playing={playing} repeat={0} from={{k: 0}} to={{k: 1}} duration={800} onComplete={setPlaying.bind(null, false)}>
            {
                ({k}) => {
                    const _k = k * length;
                    const lastK = Math.floor(_k), lastRange = ranges[lastK];
                    const nextK = Math.ceil(_k), nextRange = ranges[nextK];
                    const rK = _k - lastK;
                    const offset = lastRange + (nextRange - lastRange) * rK;
                    const x = -1 * offset;
                    const y = 3 * offset;

                    return <Layer x={x} y={y}>
                        {children}
                    </Layer>;
                }
            }
        </Tween>
    )
}