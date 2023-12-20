import { useContext, useRef, useState } from 'react';
import { DivLang } from 'common/components2/widget/text';
import './tabbar.scss';
import { SlideLoop } from 'common/components2/slideloop';
import { GameContext } from 'common/AppContext';
import { SoundDiv } from 'common/components2/widget/button';
import { action_setBetAmount } from 'common/model/spin';
import { TweenAmountDiv } from 'common/components/tweenAnimations'
import { action_menuOpen } from 'common/model/setting';

const I_BET_NUMBERS = ['0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.08', '0.10', '0.20', '0.30', '0.40', '0.50', '0.60', '0.70', '0.80', '0.90', '1.00'];

interface KTabBarOptions {
    themeColor: string;
}

export function TabBar({ themeColor }: KTabBarOptions) {
    const { state, dispatch } = useContext(GameContext);
    const [ betAmount, setBetAmount ] = useState<number>(state.spin.betAmount.toNumber());
    const [showSelectAmount, setShowSelectAmount] = useState(false);
    const { orientation } = state.setting;
    const { balance, currency } = state.user;
    const { betLevel, autoSpinCount } = state.spin;
    const {scenes} = state.sceneManager;
    const isMainPage = scenes[scenes.length - 1] == 'main';
    const isAutoSpin = autoSpinCount != 0;

    function onShowSelectAmount(e) {
        e.stopPropagation();
        setShowSelectAmount(!showSelectAmount);
        if (!state.spin.betAmount.equals(betAmount)) {
            dispatch(action_setBetAmount(betAmount))
        }
    }

    function onMenu() {
        if (!isAutoSpin) dispatch(action_menuOpen(!state.setting.menuOn))
    }

    return (
        <div className={`${showSelectAmount ? 'page-mod' : ''} ${isMainPage ? 'db' : 'dn'}`} onClick={onShowSelectAmount}>
            <div className={`tab-bar-mod ${orientation}`} onClick={(event)=>event.stopPropagation()}>
                <div className='container-bg icon-mod db'></div>
                <div className={`menu-btn btn-mod icon-mod ${orientation}`} onClick={onMenu}></div>
                <div className='context'>
                    <div className={`list ${orientation}`}>
                        <div className='item icon-mod item-bg'>
                            <div className='box'>
                                <DivLang className='detail' tmp={['balance', '(', currency, ')']}></DivLang>
                                <TweenAmountDiv className='value' text={balance}></TweenAmountDiv>
                            </div>
                        </div>
                        <div className='item icon-mod item-bg'>
                            <div className='box'>
                                <DivLang className='detail' tmp={['totalbet', '(', currency, ')']}></DivLang>
                                <TweenAmountDiv className='value' text={betLevel?.mul(betAmount)}></TweenAmountDiv>
                            </div>
                        </div>
                        <div className='item'>
                            <div style={{padding: '0 4%'}}>
                                <div className={`select-amount-box-mod ${showSelectAmount ? 'open' : 'close'}`}>
                                    <div className='amount-bg'></div>
                                    <SlideLoop className='slide' direction='V' onSelectedChange={(i) => { setBetAmount(Number(I_BET_NUMBERS[i]))}}>
                                        {
                                            I_BET_NUMBERS.map((amount, i) => {
                                                return <div key={`amount${i}`}>{amount}</div>
                                            })
                                        }
                                    </SlideLoop>
                                </div>
                            </div>
                            <div className='bg icon-mod'/>
                            <SoundDiv className='box btn-mod' onClick={onShowSelectAmount.bind(null)}>
                                <div className='tip-line' style={{ backgroundColor: themeColor }}></div>
                                <DivLang className='detail' tmp={['betamount', '(', currency, ')']}></DivLang>
                                <TweenAmountDiv className='value' style={{ color: themeColor }} text={betAmount}></TweenAmountDiv>
                            </SoundDiv>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    )
}