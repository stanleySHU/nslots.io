import { Layer, KComponentOptions } from "../layer";
import { Button } from '../button';
import { Sprite } from '@pixi/react';
import { R_SpinPanel } from '../../assets';
import { getAtlas } from '../../util/assetsLoad';
import { useContext, useEffect } from "react";
import { GameContext } from "../../AppContext";
import { Tween } from '../tween';
import { ACTION_SPIN, ACTION_SHOW_WINLINE, ACTION_SPIN_STOP, ACTION_BET_PANEL_OPEN, ACTION_AUTO_PANEL_OPEN } from "../../model/actionTypes";

interface KSpinPanelOptons extends KComponentOptions {

}

export function SpinPanel(props) {
    const {state, dispatch} = useContext(GameContext);
    const { status } = state.spin;
    const { betPanelOn, autoSpinPanelOn } = state.setting;

    useEffect(() => {
        
    }, []);

    function onAuto() {
        dispatch({type: ACTION_AUTO_PANEL_OPEN, value: !autoSpinPanelOn});
    }

    function onBet() {
        dispatch({type: ACTION_BET_PANEL_OPEN, value: !betPanelOn});
    }

    function onSpin() {
        if (status == 'idle') {
            dispatch({type: ACTION_SPIN})
        } else if (status == 'stopping') {
            dispatch({type: ACTION_SHOW_WINLINE})
        } else if (status == 'showWinLine') {
            dispatch({type: ACTION_SPIN_STOP})
        } 
    }

    return (
        <Layer x={790} y={86} {...props}>
            <Sprite texture={getAtlas(R_SpinPanel, 'betpanel-bg.png')}></Sprite>
            <Button pointerup={onAuto}>
                <Sprite x={58} y={60} texture={getAtlas(R_SpinPanel, 'icon-autospin.png')}></Sprite>
            </Button>
            <Button x={23} y={142} scale={0.88} pointerup={onSpin} interactive={status != 'spin'}>
                <Layer visible={status == 'toBonus'}>
                    <Sprite texture={getAtlas(R_SpinPanel, 'play.png')}></Sprite>
                    <Sprite texture={getAtlas(R_SpinPanel, 'spinhint.png')}></Sprite>
                </Layer>
                <Sprite visible={status == 'showWinLine'} texture={getAtlas(R_SpinPanel, 'skip.png')}></Sprite>
                <Layer visible={status == 'idle' || status == 'spin'} >
                    <Sprite texture={getAtlas(R_SpinPanel, 'spin.png')}></Sprite>
                    <Tween from={{rotation: 0}} to={{rotation: Math.PI * 2}} duration={status == 'idle' ?  20000 : 500} repeat={Number.MAX_VALUE} playing={true}>
                        <Sprite x={62} y={62} anchor={[0.5, 0.5]} texture={getAtlas(R_SpinPanel, 'spinhint.png')}></Sprite>
                    </Tween>
                </Layer>
                <Sprite visible={status == 'stopping'} texture={getAtlas(R_SpinPanel, 'stop.png')}></Sprite>
            </Button>
            <Button pointerup={onBet}>
                <Sprite x={58} y={280} texture={getAtlas(R_SpinPanel, 'icon-bet.png')}></Sprite>
            </Button>
        </Layer>
    )
}