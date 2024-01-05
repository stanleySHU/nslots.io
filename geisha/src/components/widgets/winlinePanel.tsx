import { Layer } from "common/components/layer";
import { Container } from "pixi.js";
import { GeishaPayline } from "./payline";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { SlotContext } from "common/model/context";
import { useTick } from "@pixi/react";
import { isArray, isPresent } from "common/util/lang";
import { atLast } from "common/util/array";

export function WinlinePanel({isShowWinAmount, lineId, isScatter, onComplete}: {isShowWinAmount: boolean, lineId: number | number[], isScatter: boolean, onComplete?: () => void} & ComponentProps<typeof Layer>) {
    const layer = useRef<Container>(null);
    const { current } = useRef<{ lines: {[key: string]: GeishaPayline} }>({ lines: {} })
    const [ playing, setPlaying ] = useState(false);
    const { paylinePathMap } = SlotContext.Obj.tableOptions;

    useEffect(() => {
        if (layer.current) {
            for (let key in paylinePathMap) {
                const items = paylinePathMap[key];

                const lines = new GeishaPayline(1700);
                layer.current.addChild(lines);

                const paths = [];
                for (let item of items) {
                    paths.push({ x: item[0] * 105, y: item[1] * 105 });
                }
                paths[0].x -= 50;
                atLast(paths).x += 50;
                lines.setPoints(paths);
                current.lines[key] = lines;
            }
            for (let key in paylinePathMap) {
                const items = paylinePathMap[key];

                const lines = new GeishaPayline(1700);
                layer.current.addChild(lines);

                const paths = [];
                for (let item of [...items].reverse()) {
                    paths.push({ x: item[0] * 105 - 15, y: item[1] * 105 });
                }
                paths[0].x += 50;
                atLast(paths).x -= 50;
                lines.setPoints(paths);
                current.lines[Number(key) + 9] = lines;
            }
            return () => {
                for (let key in current.lines) {
                    current.lines[key].destroy();
                }
            }
        }
    }, [layer.current])

    useEffect(() => {
        for (let key in current.lines) {
            current.lines[key].onComplete = () => {
                if (isShowWinAmount) {
                    for (let key in current.lines) {
                        current.lines[key].play(false);
                    }
                    if (isPresent(lineId)) {
                        const ids: number[] = isArray(lineId) ? lineId : [lineId];
                        for (let id of ids) {
                            isPresent(id) && current.lines[id].play(true);
                        }
                    }
                } else {
                    onComplete && onComplete();
                    setPlaying(false);
                }
            };
        }
    }, [lineId])

    useEffect(() => {
        for (let key in current.lines) {
            current.lines[key].play(false);
        }
        if (isPresent(lineId) && !isScatter) {
            const ids: number[] = isArray(lineId) ? lineId : [lineId];
            for (let id of ids) {
                isPresent(id) && current.lines[id].play(true);
            }
            setPlaying(true);
        } else {
            setPlaying(false);
        }
    }, [lineId])

    useTick((delta, ticker) => {
        for (let key in current.lines) {
            current.lines[key].onUpdate(delta, ticker.elapsedMS);
        }
    }, playing);

    return (
        <Layer ref={layer} x={-44} y={-58} />
    )
}