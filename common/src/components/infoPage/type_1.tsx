import { getInfoPageId } from '../../assets';
import { getImg } from '../../util/assetsLoad';
import { Sprite, useApp } from "@pixi/react";
import { Scene, KSceneOptions } from "../scene";
import { Rectangle as pixiRectangle } from 'pixi.js';
import { Rectangle } from '../rectangle';
import { Button } from '../button';
import { useContext, useState } from "react";
import { Tween } from "@tweenjs/tween.js";
import { IconClose } from '../icon';
import { GameContext } from '../../AppContext';
import { ACTION_SCENE_POP } from '../../model/actionTypes';

interface KInfoPageSceneOptions extends KSceneOptions {
    count: number;
}

export function InfoPageScene({count, ...props}: KInfoPageSceneOptions) {
    let app = useApp();
    const {dispatch} = useContext(GameContext);
    let [point, setPoint] = useState<{x: number, y: number}>();
    let [offset, setOffset] = useState<number>(0);


    function onDragStart(event) {
        point = event.data.getLocalPosition(app.stage, null, event.data.global);
    }

    function onDragEnd() {
        if (point) {
            setPoint(null);
            if (offset % 1 != 0) {
                let roundOffset = Math.round(offset), nextOffset = roundOffset;
                new Tween({offset: offset})
                    .to({offset: nextOffset}, 100)
                    .onUpdate(k => {
                        setOffset(k.offset);
                    }).start();
            }
        }
    }

    function onDragMove(event) {
        if (point) {
            let currentPoint = event.data.getLocalPosition(app.stage, null, event.data.global);
            offset += (currentPoint.x - point.x) / 960;
            offset %= count;
            point = currentPoint;
            setOffset(offset);
            setPoint(point);
        }
    }

    function close() {
        dispatch({type: ACTION_SCENE_POP});
    }
   
    let k, page;
    if (offset >= 0) {
        k = offset % 1;
        page = Math.ceil(count - offset) % count;
    } else {
        k = offset % 1 + 1;
        if (k == 1) k = 0;
        page = Math.abs(Math.floor(offset)) % 3;
    }
    return (
        <Scene interactive={true} hitFrame={[0,0,960,540]} pointerdown={onDragStart} pointermove={onDragMove} pointerup={onDragEnd} pointerout={onDragEnd} {...props}>
            <Rectangle frame={[0,0,960,540]} color={0x30303C}></Rectangle>
            <Sprite key={`infopage_${0}`} texture={getImg(getInfoPageId((page - 1 + count) % count))} x={960 * (k-1)}></Sprite>
            <Sprite key={`infopage_${1}`} texture={getImg(getInfoPageId(page))} x={960 * k}></Sprite>
            <Button hitFrame={[0, 0, 50, 50]} pointerup={close} x={880} y={20}>
                <IconClose></IconClose>
            </Button>
        </Scene>
    )
}
