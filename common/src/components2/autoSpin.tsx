import { useContext, useRef, useState } from 'react';
import { GameContext } from '../AppContext';
import { ACTION_AUTO_PANEL_OPEN } from '../model/actionTypes';
import './autoSpin.scss'

const I_NUMBER_OF_AUTO_SPINS = [10,25,50,75,100,'∞'];
const I_TOTAL_BET_LIST = ['5x', '10x', '20x', '50x', 'NO LIMIT'];
export function AutoSpin() {
    const { state, dispatch } = useContext(GameContext);
    const { autoSpinPanelOn } = state.setting;
    const [expand, setExpand] = useState(false);
    const [autoSelected, setAutoSelected] = useState(0);
    const [lossSelected, setLossSelected] = useState(4);

    const customInput = useRef();
    const exceedInput = useRef();
    const increaseInput = useRef();

    function onClose() {
        dispatch({ type: ACTION_AUTO_PANEL_OPEN, value: !autoSpinPanelOn })
    }

    function onEexpand() {
        setExpand(!expand);
    }

    function onStart() {
        onClose();
    }

    return (
        <div className={`page-mod page-mod-auto-spin ${autoSpinPanelOn ? 'visible' : 'hidden'}`} onClick={onClose}>
            <div className={`auto-spin-mod ${autoSpinPanelOn ? expand ? 'expand ' : 'open' : 'close'}`} onClick={e => e.stopPropagation()}>
                <div className={`arrow-icon btn-mod arrow-btn ${expand ? 'down' : 'up'}`} onClick={onEexpand}></div>
                <div>
                    <div className='title'>{`AUTO SPINS`}</div>
                    <div>
                        <div>
                            <div className='left'>
                                <div className='sub-title' style={{ marginTop: '1rem' }}>{`NUMBER OF`}</div>
                            </div>
                            <div className='right'>
                                <div className='list'>
                                    {
                                        I_NUMBER_OF_AUTO_SPINS.map((item, i) => {
                                            return <div key={`auto-spin-selected${i}`} className={`btn-item btn-mod ${autoSelected == i ? 'selected' : ''}`} onClick={e => setAutoSelected(i)}>{item}</div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={`${expand ? 'dn' : 'db'}`}>
                            <div className='btn-item start'>start</div>
                        </div>
                    </div>
                </div>
                <div className='line' />
                <div>
                    <div className='left'>
                        <div className='sub-title'>{'STOP LOSS TIMIT'}</div>
                    </div>
                    <div>
                        <div className='left'>
                            <div className='detail' style={{ marginTop: '1rem' }}>{'Total Bet'}</div>
                        </div>
                        <div className='right'>
                            <div className='list'>
                                {
                                    I_TOTAL_BET_LIST.map((item, i) => {
                                        return <div key={`loss-total-bet${i}`} className={`btn-item btn-mod ${lossSelected == i ? 'selected' : ''} ${I_TOTAL_BET_LIST.length-1 == i ? 'no-limit' : ''}`} onClick={e => setLossSelected(i)}>{item}</div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='left'>
                            <div className='detail' style={{ marginTop: '1.5rem' }}>{'Custom'}</div>
                        </div>
                        <div className='right'>
                            <input ref={customInput} className='input-item custom' type='number' />
                        </div>
                    </div>
                </div>
                <div className='line' />
                <div>
                    <div className='left'>
                        <div className='sub-title'>{'STOP AUTO SPIN'}</div>
                    </div>
                    <div>
                        <div className='left'>
                            <div className='detail' style={{ marginTop: '1rem' }}>{'If single win exceeds'}</div>
                        </div>
                        <div className='right'>
                            <input ref={exceedInput} className='input-item' type='number' />
                        </div>
                    </div>
                    <div>
                        <div className='left'>
                            <div className='detail' style={{ marginTop: '1.5rem' }}>{'If balance increases by'}</div>
                        </div>
                        <div className='right'>
                            <input ref={increaseInput} className='input-item' type='number' />
                            <div className='btn-item start-expand btn-mod selected'>start</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}