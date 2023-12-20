import { SlideLoop } from 'common/components2/slideloop';
import './betAmount.scss';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from 'common/AppContext';
import { SlotContext } from 'common/model/context';
import { action_setBetAmount } from 'common/model/spin';

const I_BET_NUMBERS = ['0.01', '0.02', '0.03', '0.04', '0.05', '0.06', '0.08', '0.10', '0.20', '0.30', '0.40', '0.50', '0.60', '0.70', '0.80', '0.90', '1.00'];
const I_BET_AMOUNT_SELECTED_ON = 'betAmountSelectedOn';

export function BetAmount() {
    const { state, dispatch } = useContext(GameContext);
    const [betAmount, setBetAmount] = useState<number>(state.spin.betAmount.toNumber());
    const [showSelectAmount, setShowSelectAmount] = useState(false);

    useEffect(() => {
        const slotContext = SlotContext.Obj;
        const func = () => {
            setShowSelectAmount(true);
        };
        slotContext.notice.on(I_BET_AMOUNT_SELECTED_ON, func);
        return () => {
            slotContext.notice.on(I_BET_AMOUNT_SELECTED_ON, func);
        }
    }, []);

    function onClose(e) {
        setShowSelectAmount(false);
        if (!state.spin.betAmount.equals(betAmount)) {
            dispatch(action_setBetAmount(betAmount))
        }
        e.stopPropagation();
    }

    return (
        <div className={`page-mod ${showSelectAmount ? 'visible' : 'hidden'}`} onClick={onClose}>
            <div className={`select-amount-box-mod open ${showSelectAmount ? 'visible' : 'hidden'}`}>
                <div className='amount-bg'></div>
                <div className='title'>Bet Amount</div>
                <div className='arrow-up'></div>
                <div className='selecter'>
                    <SlideLoop className='slide' direction='V' onSelectedChange={(i) => { setBetAmount(Number(I_BET_NUMBERS[i])) }}>
                        {
                            I_BET_NUMBERS.map((amount, i) => {
                                return <div key={`amount${i}`}>{amount}</div>
                            })
                        }
                    </SlideLoop>
                </div>
                <div className='arrow-down'></div>
            </div>
        </div>
    )
}