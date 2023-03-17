import { useTick } from "@pixi/react";
import { useContext, useEffect, useState, cloneElement, Children } from "react";
import { KAnimationReelsPropsOptions } from ".";
import { GameContext } from "../../../AppContext";
import { ACTION_SHOW_WINLINE } from "../../../model/actionTypes";
import { KSpinStatus } from "../../../model/spin";
import { isPresent } from "../../../util/lang";
import { getDefaultInitReels, getRandomSymbolIndex } from "../util";

export interface KSpinStatusOptions {
    children: (e: KAnimationReelsPropsOptions) => any,
    row?: number, 
    column?: number,
    maxSpeed?: number 
    maxSymbolIndex: number,
}

export interface KSpinAnimationOptions {
    status: KSpinStatus;
    k: number;
    stopK?: number;
    stoppingK?: number;
    time?: number;
    reel: number[],
    resultReel?: number[],
    next: number
}

function getSpinAnimationInitState(column: number, reels: number[][]): {[key: string]: KSpinAnimationOptions} {
    let initState = {};
    for (let i = 0; i < column; i++) {
        let next = i + 1;
        initState[i] = {
            status: 'idle',
            k: 0,
            reel: reels[i],
            next: next < column ? next : null
        } as KSpinAnimationOptions
    }
    return initState;
}

function getAnimationProps(animations: {[key: string]: KSpinAnimationOptions}, maxSpeed: number, symbolSize: [number, number], reelStop: boolean = false, reelStopColumn: number = 0): KAnimationReelsPropsOptions {
    let res: KAnimationReelsPropsOptions= {
        reelStop: reelStop,
        reelStopColumn: reelStopColumn,
        reelStates: []
    };
    for (let id in animations) {
        let animation = animations[id], reel = [];
        res.reelStates.push(reel);
        if (animation.status == 'idle') {
            for (let i = 0; i < animation.reel.length; i++) {
                reel.push({
                    id:  i,
                    y: i * symbolSize[1],
                    sIndex: animation.reel[i]
                });
            }
        } else {
            let reelRow = animation.reel.length, row = reelRow - 1;
            for (let i = 0; i < animation.reel.length; i++) {
                let offsetIndex = ((animation.k*maxSpeed+i)%reelRow);
                if (offsetIndex > row) offsetIndex = offsetIndex - reelRow;
                let y  = offsetIndex * symbolSize[1];
                offsetIndex = Math.ceil(offsetIndex);
                reel.push({
                    id:  i,
                    y: y,
                    sIndex: animation.reel[offsetIndex]
                });
            }
        }
    }
    return res as any;
}

function updateReelInSpining(reel: number[], row, maxSymbolIndex, defaultSymbol?) {
    if (reel.length == row + 1) {
        reel.pop();
    }
    reel.unshift(isPresent(defaultSymbol) ? defaultSymbol : getRandomSymbolIndex(maxSymbolIndex));
}

function spinEasing(k): number {
    if (k < 1) {
        return k * k * k;
    }
    return k;
}

function stoppingEasing(k): number {
    const s = 1.70158
	let t = k === 0 ? 0 : --k * k * ((s + 1) * k + s) + 1
    if (t > 1) {
        t = 1 + (t -1) * 0.2;
    }
    return t;
}

export function SpinStatus(props: KSpinStatusOptions) {
    const {children, row = 3, column = 5, maxSpeed = 24, maxSymbolIndex} = props;
    const {state, dispatch} = useContext(GameContext);
    const {status, responseModel} = state.spin;
    const { symbolSize } = state.game.table;

    const [reels, setReels] = useState(getDefaultInitReels(row, column, maxSymbolIndex));
    const [animations, setAnimations] = useState(getSpinAnimationInitState(column, reels));
    const [animationState, setAnimationState] = useState(getAnimationProps(animations, maxSpeed, symbolSize));
    
    useTick(() => {
        let reelStop = false, reelStopColumn = 0;
        for (let id in animations) {
            let animation = animations[id];
            let lastDistance, currentDistance, currentK;
            if (animation.status == 'spin') {
                currentK = spinEasing((new Date().getTime() - animation.time) / 1000);
                currentDistance = currentK * maxSpeed;
                lastDistance = animation.k * maxSpeed;
                if (currentDistance >= Math.floor(lastDistance) + 1) {
                    updateReelInSpining(animation.reel, row, maxSymbolIndex);
                } 
                animation.k = currentK;
            } else if (animation.status == 'stopping') {
                let k1 = Math.min(animation.stopK, (new Date().getTime() - animation.time) / 1000);
                let k2 = stoppingEasing((k1/animation.stopK)) * animation.stopK;
                currentK = animation.stoppingK + k2;
                currentDistance = currentK * maxSpeed;
                lastDistance = animation.k * maxSpeed;
                if (currentDistance >= Math.floor(lastDistance) + 1) {
                    let t = Math.ceil((animation.stopK - k2) * maxSpeed) - 1;
                    updateReelInSpining(animation.reel, row, maxSymbolIndex, animation.resultReel[t]);
                } 
                animation.k = currentK;
                if (k1 == animation.stopK) {
                    reelStop = true;
                    reelStopColumn = Number(id);
                    animation.status = 'idle';
                    animation.reel.shift();
                    if (animation.next) {    
                        let nextAnimation = animations[animation.next];
                        let k = nextAnimation.k;
                        let stopK = Math.round(maxSpeed * (k + 1.3)) / maxSpeed  - k; 
                        nextAnimation.time = new Date().getTime();
                        nextAnimation.status = 'stopping';
                        nextAnimation.stopK = stopK;
                        nextAnimation.stoppingK = k;
                    } else {
                        dispatch({type: ACTION_SHOW_WINLINE});
                    }
                }
            }
        }
        setAnimationState(getAnimationProps(animations, maxSpeed, symbolSize, reelStop, reelStopColumn));
        setAnimations(animations);
    }, status != 'idle');

    useEffect(() => {
        let now = new Date().getTime();
        if (status == 'showWinLine') {
            let animations = getSpinAnimationInitState(column, responseModel.reels)
            setAnimations(animations);
            setAnimationState(getAnimationProps(animations, maxSpeed, symbolSize));
            // for (let id in animations) {
            //     let animation = animations[id];
            //     animation.reel = responseModel.reels[id];
            // }
        } else if (status == 'spin') {
            for (let id in animations) {
                let animation = animations[id];
                animation.time = now;
                animation.status = 'spin';
                animation.k = 0;
                updateReelInSpining(animation.reel, row, maxSymbolIndex);
            }
            setAnimations(animations);
        } else if (status == 'stopping') {
            for (let id in animations) {
                let animation = animations[id];
                animation.resultReel = responseModel.reels[id];
            }
            
            let firstAnimation = animations[0];
            let k = firstAnimation.k;
            let stopK = Math.round(maxSpeed * (k + 1.3)) / maxSpeed  - k; 
            firstAnimation.time = now;
            firstAnimation.status = 'stopping';
            firstAnimation.stopK = stopK;
            firstAnimation.stoppingK = k;
            setAnimations(animations);
        } 
    }, [status]);
    return children(animationState);
}