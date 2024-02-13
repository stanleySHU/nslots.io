import { useContext } from 'react';
import { mapWith } from 'common/util/array';
import { SoundDiv } from 'common/components2/widget/button'
import './detail.scss'
import { GameContext } from 'common/AppContext';
import { action_history_detail_open } from 'common/model/setting';
import { getBetDescription } from './list';
import { toCommaAndFixed } from 'common/util/amount';
import { SlotContext } from 'common/model/context';
import { useMemoConstant } from 'common/components/customhook';

export function HistoryDetail() {
    const { state, dispatch } = useContext(GameContext);
    const { on, data } = state.setting.historyDetail;
    const {tableOptions: table, configOptions: config} = SlotContext.Obj;

    function onClose() {
        dispatch(action_history_detail_open(false));
    }

    const symbolFormat = useMemoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'png']));

    let ss = [];
    if (data) {
        const _ss = data.result.slot.ss || [];
        ss = _ss.map(s => s.length == 3 ? [6, ...s, 6] : s);
    }
    return (
        data ? <div className={`page-mod ${on ? 'visible' : 'hidden'}`} style={{ backgroundColor: "#181b1e" }}>
            <div className={`history-detail-mod`}>
                <div className="head-mod">gametitle</div>
                <div className='content-mod'>
                    <div className='content-top'>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Rolls</th>
                                    <th>Time</th>
                                    <th>Bet<br></br>(USD)</th>
                                    <th>Points</th>
                                    <th>Earn<br></br>Points</th>
                                    <th>Payout<br></br>(USD)</th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th>{30 - data.result.battle.r}</th>
                                    <th>{data.createdOnFormat}</th>
                                    <th>{getBetDescription(data)}</th>
                                    <th>{data.result.battle.pts}</th>
                                    <th>{data.result.accPoints || 0}</th>
                                    <th>{toCommaAndFixed(Number(data.payout))}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='content-bottom'>
                        <div className='content-left'>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Player HP</th>
                                        <th>{data.result.battle.ph}</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th>Boss HP</th>
                                        <th>{data.result.battle.bh}</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <th>Jackpot</th>
                                        <th>{data.result.battle.jackpot}</th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='content-right'>
                            <table>
                                {
                                    ss.map((s: any, i: number) => {
                                        return (
                                            <tbody key={`history-reel${i}`}>
                                                <tr>
                                                    {
                                                        s.map((index: any, j: number) => {
                                                            return (
                                                                <th key={`history-s-${j}`}><div className={`icon-mod symbol ${index == 6 ? '' : ('symbol-' + index)} ${symbolFormat}`}></div></th>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                }
                            </table>
                        </div>
                    </div>
                </div>
                <SoundDiv className='close-icon btn-mod' onClick={onClose} style={{ position: 'absolute', right: '1rem', top: '0.5rem', height: '2rem', width: '2rem' }}></SoundDiv>
            </div>
        </div> : <></>
    )
}