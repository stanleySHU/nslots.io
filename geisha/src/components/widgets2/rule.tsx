import { SoundDiv } from 'common/components2/widget/button';
import './rule.scss';
import { GameContext } from "common/AppContext";
import { SlotContext } from 'common/model/context';
import { mapWith } from 'common/util/array';
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { action_paytableOpen } from 'common/model/setting';
import { useDebounce, useMenoConstant } from 'common/components/customhook';

export function Rule() {
    const scrollView = useRef<HTMLDivElement>(null);
    const payoutView = useRef<HTMLDivElement>(null);
    const featuresView = useRef<HTMLDivElement>(null);
    const scatterView = useRef<HTMLDivElement>(null);
    const gamePlayView = useRef<HTMLDivElement>(null);
    const { state, dispatch } = useContext(GameContext);
    const [selected, setSelected] = useState(0);
    const { payTableOn } = state.setting;
    const { orientation } = state.setting;

    function close(event) {
        dispatch(action_paytableOpen(false));
        event.stopPropagation();
    }

    const ssInfo = useMemo(() => {
        return [
            { s: 9, detail: [{ count: 5, odd: '5,000' }, { count: 4, odd: 500 }, { count: 3, odd: 100 }, { count: 2, odd: 10 }, { count: 1, odd: 2 }] },
            { s: 8, detail: [{ count: 5, odd: '2,500' }, { count: 4, odd: 250 }, { count: 3, odd: 50 }, { count: 2, odd: 5 }] },
            { s: 7, detail: [{ count: 5, odd: '1,000' }, { count: 4, odd: 100 }, { count: 3, odd: 20 }, { count: 2, odd: 3 }] },
            { s: 6, detail: [{ count: 5, odd: '1,000' }, { count: 4, odd: 100 }, { count: 3, odd: 20 }, { count: 2, odd: 3 }] },
            { s: 5, detail: [{ count: 5, odd: 500 }, { count: 4, odd: 30 }, { count: 3, odd: 10 }] },
            { s: 4, detail: [{ count: 5, odd: 300 }, { count: 4, odd: 25 }, { count: 3, odd: 5 }] },
            { s: 3, detail: [{ count: 5, odd: 200 }, { count: 4, odd: 20 }, { count: 3, odd: 5 }] },
            { s: 2, detail: [{ count: 5, odd: 200 }, { count: 4, odd: 20 }, { count: 3, odd: 5 }] },
            { s: 1, detail: [{ count: 5, odd: 100 }, { count: 4, odd: 15 }, { count: 3, odd: 5 }] },
            { s: 0, detail: [{ count: 5, odd: 100 }, { count: 4, odd: 15 }, { count: 3, odd: 5 }] }
        ]
    }, []);

    const paylineInfo = useMemo(() => {
        const arr = [];
        for (let key in SlotContext.Obj.tableOptions.paylineMap) {
            const item = SlotContext.Obj.tableOptions.paylineMap[key];

            const obj: { [key: string]: boolean } = {};
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 3; j++) {
                    obj[`${i}${j}`] = false;
                }
            }

            item.forEach((p, i) => {
                obj[`${p[0]}${p[1]}`] = true;
            })

            arr.push(obj);
        }
        return arr;
    }, [])

    const onScroll = useDebounce(() => {
        const scrollTop = scrollView.current?.scrollTop || 0;
        const featuresViewOffsetTop = featuresView.current?.offsetTop || 0;
        const scatterViewOffsetTop = scatterView.current?.offsetTop || 0;
        if (scrollTop > scatterViewOffsetTop) {
            setSelected(2);
        } else if (scrollTop > featuresViewOffsetTop - 100) {
            setSelected(1);
        } else {
            setSelected(0);
        }
    }, 300);

    function onSelected(e: number) {
        let y = 0;
        if (e == 1) {
            y = featuresView.current?.offsetTop || 0;
        } else if (e == 2) {
            y = gamePlayView.current?.offsetTop || 0;
        }
        scrollView.current?.scrollTo({
            top: y,
            behavior: "smooth"
        });
        setSelected(e);
    }
    const symbolFormat = useMenoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'png']));

    return (
        <div className={`page-mod ${payTableOn ? 'db' : 'dn'}`}>
            <div className='rule-bg-mod'>
                <div className={`blur-bg bg ${useMenoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'jpg']))}`}></div>
                <div className='cover blur-filter-mod'></div>
            </div>
            <div className={`rule-head-mod ${orientation}`}>
                <div className='list'>
                    <div className={`item btn-mod ${selected == 0 ? 'selected' : ''}`} onClick={onSelected.bind(null, 0)}>PAYOUT</div>
                    <div className={`item btn-mod ${selected == 1 ? 'selected' : ''}`} onClick={onSelected.bind(null, 1)}>FEATURES</div>
                    <div className={`item btn-mod ${selected == 2 ? 'selected' : ''}`} onClick={onSelected.bind(null, 2)}>GAME PLAY</div>
                </div>
            </div>
            <div ref={scrollView} className="rule-page-mod hidden-scroolbar" onScroll={onScroll}>
                <div ref={payoutView} id={'geisha-payout'} className='paytable-mod clearfix'>
                    <div className='title'>PAYTABLE</div>
                    {
                        ssInfo.map((item, index) => {
                            return (
                                <div className={`symbol-mod ${orientation}`} key={'symbol' + index}>
                                    <div className='left'>
                                        <div className={`icon-mod symbol symbol-${item.s} ${symbolFormat}`}></div>
                                    </div>
                                    <div className='right'>
                                        {
                                            item.detail.map((d, i) => {
                                                return (
                                                    <div className='item' key={i}>
                                                        <div className='count'>{d.count}x</div>
                                                        <div className='odd'>{d.odd}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div ref={featuresView} id={'geisha-features'} className='payline-mod'>
                    <div className='title'>PAYLINE</div>
                    <div className='clearfix'>
                        {
                            paylineInfo.map((item, index) => {
                                return (
                                    <div className={`item ${orientation}`} key={`line${index}`}>
                                        <div className='dib' style={{ verticalAlign: 'middle', padding: '1rem 1rem 1rem 0', color: '#ffffff' }}>{index}</div>
                                            <div className='payline-table' style={{ verticalAlign: 'middle' }}>
                                                {
                                                    mapWith(3, (i) => {
                                                        return (
                                                            <div className='s-row' key={`s-${i}`}>
                                                                {
                                                                    mapWith(5, (j) => {
                                                                        return <div key={`payline-i-${j}`} className={`s-item ${item[`${j}${i}`] ? 'selected' : ''}`} />
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        {/* </div> */}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={`description ${orientation}`}>
                        <div>9 LINES</div>
                        <div className='text'>PAYOUT IS AWARDED FOR WINNING COMBINATION FROM</div>
                        <div className='text'>LEFTMOST TO RIGHT AND RIGHTMOST TO LEFT ON THE ACTIVE PAYLINES.</div>
                        <div className='text'>PAYLINE WINNINGS IS LINE BET MULTIPLIED BY SYMBOL PAYOUT.</div>
                        <div className='text'>5 OF A KIND PRIZE PAYS ONCE ONLY.</div>
                        <div className='text'>MALFUNCTION VOIDS ALL PAYS AND PLAYS.</div>
                    </div>
                </div>
                <div ref={scatterView} className='wild-scatter-mod'>
                    <div className='title'>WILD & SCATTER</div>
                    <div style={{ textAlign: 'center' }}>
                        <div>
                            <div className={`icon-mod symbol symbol-11 ${symbolFormat}`} style={{ verticalAlign: 'middle', margin: '0' }}></div>
                        </div>
                        <div className={`description ${orientation}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>The <div className='dib text-coral'>WILD</div> will substute ALL symbols including <div className='symbol-s-mod'><div className={`icon symbol-11 ${symbolFormat}`} style={{ width: '3rem', height: '3rem' }}></div></div></div>
                            <div className='text'><div className='dib text-coral'>WILD</div> will appear on 2, 3, 4, reel only.</div>
                            <div className='text'>All winning combination with WILD are <div className='dib text-coral'>x 2 !</div></div>
                        </div>
                    </div>
                    <div className='clearfix' style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <div className='symbol-mod db' style={{ verticalAlign: 'middle', float: 'none', width: 'auto' }} >
                            <div className='left'>
                                <div className={`icon-mod symbol symbol-10 ${symbolFormat}`}></div>
                            </div>
                            <div className='right'>
                                <div className='item'>
                                    <div className='count'>5x</div>
                                    <div className='odd'>100</div>
                                </div>
                                <div className='item'>
                                    <div className='count'>4x</div>
                                    <div className='odd'>10</div>
                                </div>
                                <div className='item'>
                                    <div className='count'>3x</div>
                                    <div className='odd'>5</div>
                                </div>
                                <div className='item'>
                                    <div className='count'>2x</div>
                                    <div className='odd'>1</div>
                                </div>
                            </div>
                        </div>
                        <div className={`description ${orientation}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>2 or more <div className='dib text-coral'>SCATTER</div> appearing consecutively from left to right</div>
                            <div className='text'>or right to left awards payout.</div>
                            <div className='text'>The <div className='dib text-coral'>SCATTER</div> win is multiplied by TOTAL BET.</div>
                        </div>
                    </div>
                </div>
                <div ref={gamePlayView} id={'geisha-gameplay'} className='game-info-mod'>
                    <div className='title'>GAME PLAY</div>
                    <div className='detail-table'>
                        <div>
                            <div className='item'>
                                <div>Reel</div>
                                <div>3 x 5 Reels</div>
                            </div>
                            <div className='item'>
                                <div>Fixed Lines No. of</div>
                                <div>9 Lines</div>
                            </div>
                            <div className='item'>
                                <div>Default RTP</div>
                                <div>95.45%</div>
                            </div>
                        </div>
                    </div>
                    <div className={`description ${orientation}`} style={{ marginTop: '2rem' }}>
                        <div className='text text-coral'>Min and Max bet</div>
                        <div className='text' style={{ fontWeight: 'bold' }}>Reflected on the game interface based on player's currency.</div>

                        <div className='clearfix'>
                            <div className='text fl'><div style={{ fontWeight: 'bold' }}>Example:</div> </div>
                            <div className='fl'>
                                <div className='text'>Player's currency USD</div>
                                <div className='text'>Selecting Bet of USD 1.00 with 9 fixed lines</div>
                            </div>
                        </div>
                        <div className='text' style={{ marginTop: '1.3rem' }}>Total bet per spin USD 9.00</div>
                    </div>
                    <div className={`description ${orientation}`}>
                        <div className='text text-coral '>How to play:</div>
                        <div className='text'><div className='dib'>1.</div> Choose total bet per spin by selecting Bet value.</div>
                        <div className='text'><div className='dib'>2.</div> To start the game, click on the SPIN button.</div>
                        <div className='text'><div className='dib'>3.</div> Once the game reels stop, the combination of symbols displayed will determine the payout as could be seen on the paytable. Check the total win on the Win field.</div>
                    </div>
                </div>
            </div>
            <SoundDiv className='close-icon btn-mod' onClick={close} style={{ position: 'absolute', right: '1rem', top: '1.4rem', height: '2rem', width: '2rem' }}></SoundDiv>
        </div>
    )
}