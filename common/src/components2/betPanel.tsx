import { useContext } from 'react';
import { GameContext } from '../AppContext';
import { ACTION_BET_PANEL_OPEN } from '../model/actionTypes';
import './betPanel.scss'

export function BetPael() {
    const { state, dispatch } = useContext(GameContext);
    const { betPanelOn } = state.setting;

    function close() {
        dispatch({type: ACTION_BET_PANEL_OPEN, value: false});
    }

    function onMaxBet(event) {
        event.stopPropagation();
    }

    function onConfirm() {

    }

    return (
        <div className={`page-mod ${betPanelOn ? 'visible' : 'hidden'}`} onClick={close}>
            <div className={`bet-panel-mod ${betPanelOn ? 'open' : 'close'}`}>
                <div className='title'>{'bet setting'}</div>
                <div className='bet-section'>
                    <div className='cell clearfix'>
                        <div className='item0'>{'lines'}</div>
                        <div className='item1'>{'8'}</div>
                        <div className='item3'>
                            2
                        </div>
                        <div className='item2'>{`Liine Bet(USD)`}</div>
                    </div>
                </div>
                <div className='line'></div>
                <div className='bottom clearfix'>
                    <div className='left'>
                        <div className='detail'>{`Total Bet(USD)`}</div>
                        <div className='value'>{`0.16`}</div>
                    </div> 
                    <div className='item1 btn-mod' onClick={onConfirm}>{'confirm'}</div>
                    <div className='item0 btn-mod' onClick={onMaxBet}>{'max bet'}</div>
                </div>
            </div>
        </div>
    )
}