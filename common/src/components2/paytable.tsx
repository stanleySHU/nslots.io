
import { Tween } from '@tweenjs/tween.js';
import { useContext, useRef, useState } from 'react';
import { GameContext } from '../AppContext';
import { ACTION_PAYTABLE_OPEN, ACTION_SCENE_POP } from '../model/actionTypes';
import { KPoint } from '../util/math';
import './paytable.scss';

interface KInfoPageSceneOptions {
    count: number;
}

export function Paytable({count}: KInfoPageSceneOptions) {
    const {state, dispatch} = useContext(GameContext);
    const el = useRef<HTMLDivElement>();
    const {payTableOn} = state.setting
    let [point, setPoint] = useState<KPoint>();
    let [offset, setOffset] = useState<number>(0);

    function onDragStart(event) {
        point = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onDragEnd() {
        if (point) {
            setPoint(null);
            let roundOffset = Math.round(offset)
            if (roundOffset != offset) {
                let nextOffset;
                if (roundOffset < offset) {
                    nextOffset = Math.round(roundOffset + Math.min(1, (offset - roundOffset) * 2));
                } else {
                    nextOffset = Math.round(roundOffset + Math.max(-1, (offset - roundOffset) * 2));
                }


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
            let currentPoint = {
                x: event.clientX,
                y: event.clientY
            };
            offset += (currentPoint.x - point.x) / 960;
            offset %= count;
            point = currentPoint;
            setOffset(offset);
            setPoint(point);
        }
    }

    function close() {
        dispatch({type: ACTION_PAYTABLE_OPEN, value: false});
    }

    let k, page, width = el.current ? el.current.clientWidth : 0;
    if (offset >= 0) {
        k = offset % 1;
        page = Math.ceil(count - offset) % count;
    } else {
        k = offset % 1 + 1;
        if (k == 1) k = 0;
        page = Math.abs(Math.floor(offset)) % 3;
    }
    return (
        <div ref={el} className={`page-mod ${payTableOn ? 'visible' : 'hidden'}`} onPointerDown ={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd}>
            <div className='paytable-mod'>
                <div className={`item icon-mod info${(page - 1 + count) % count}`} key={`infopage_${0}`} style={{left: `${width * (k-1)}px`}}></div>
                <div className={`item icon-mod info${page}`} key={`infopage_${1}`} style={{left: `${width * k}px`}}></div>
            </div>
            <div className='close-icon btn-mod' onClick={close} style={{float: 'right', marginTop: '0.5rem', marginRight: '1rem'}}></div>
        </div>
    )
}