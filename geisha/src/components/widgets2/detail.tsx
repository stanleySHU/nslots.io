import { useContext, useMemo } from 'react';
import { mapWith } from 'common/util/array';
import { SoundDiv } from 'common/components2/widget/button'
import './detail.scss'
import { GameContext } from 'common/AppContext';
import { action_history_detail_open } from 'common/model/setting';
import { SpinModel } from 'common/util/parser/spin/queenBee';
import { toCommaAndFixed } from 'common/util/amount';
import { SlotContext } from 'common/model/context';
import { useMenoConstant } from 'common/components/customhook';
import { DivLang } from 'common/components2/widget/text';

export function HistoryDetail() {
    const { state, dispatch } = useContext(GameContext);
    const { on, data } = state.setting.historyDetail;
    const { currency } = state.user;
    const {tableOptions: table, configOptions: config} = SlotContext.Obj;
    function onClose() {
        dispatch(action_history_detail_open(false));
    }
    const model = useMemo(() => {
        if (data) {
            return new SpinModel(data);
        }
    }, [data])
    const ss = model?.data.result.ss || [];

    const symbolFormat = useMenoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'png']));

    return (
        <div className={`page-mod ${on ? 'db' : 'dn'}`} style={{ backgroundColor: "#181b1e" }}>
            <div className={`history-detail-mod`}>
                <DivLang className="head-mod">gametitle</DivLang>
                <div className='content-mod clearfix hidden-scroolbar'>
                    {
                        data ? <div className='content-top'>
                        <table>
                            <tbody>
                                <tr>
                                    <th><DivLang>dateandtime</DivLang></th>
                                    <th><DivLang className='dib'>totalbet</DivLang><br></br>({currency})</th>
                                    <th><DivLang className='dib'>payout</DivLang><br></br>({currency})</th>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <th>{data.createdOnFormat}</th>
                                    <th>{toCommaAndFixed(Number(data.cost))}</th>
                                    <th>{toCommaAndFixed(Number(data.payout))}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div> : <></>
                    }
                    <div className='content-left'>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th><DivLang>winline</DivLang></th>
                                    <th><DivLang className='dib'>bet</DivLang><br></br>({currency})</th>
                                    <th><DivLang className='dib'>win</DivLang><br></br>({currency})</th>
                                    <th><DivLang className='dib'>multiper</DivLang></th>
                                </tr>
                            </tbody>
                            {
                                model ? model.linewins.map((item, i) => {
                                    const path = table.paylineMap[item.id];
                                    const win = (item.scatterWin ? model.cost : model.credit).mul(item.multiplier).toNumber()
                                    return (
                                        <tbody key={`table${i}`}>
                                            <tr>
                                                <th>{i + 1}</th>
                                                <th>
                                                    <table>
                                                        {
                                                            mapWith(3, (i) => {
                                                                return (
                                                                    <tbody key={`column${i}`}>
                                                                        <tr>
                                                                            {
                                                                                mapWith(5, (j) => {
                                                                                    let arr;
                                                                                    const index = path?.findIndex(([_j, _i]) => {
                                                                                        return _j == j && _i == i;
                                                                                    });
                                                                                    
                                                                                    if (index >= 0 || item.type == 10) {
                                                                                        arr = item.columnRowSymbolArr.find(([_j, _i]) => {
                                                                                            return _j == j && _i == i;
                                                                                        })
                                                                                    }
                                                                                    return <td key={`row${j}`} style={{ width: '1.5rem', height: '1.5rem' }}>
                                                                                        {
                                                                                            (index >= 0 || arr) ? <div className={`icon-mod symbol ${arr ? ('symbol-' + arr[2]) : 'symbol-empty'} ${symbolFormat}`}></div> : <></>
                                                                                        }
                                                                                    </td>
                                                                                })
                                                                            }
                                                                        </tr>
                                                                    </tbody>
                                                                )
                                                            })
                                                        }
                                                    </table>
                                                </th>
                                                <th>{toCommaAndFixed(model.credit.toNumber(), 2)}</th>
                                                <th>{toCommaAndFixed(win, 2)}</th>
                                                <th>{item.existWild ? 2 : 1}</th>
                                                {/* <th>{toCommaAndFixed(item.multiplier.toNumber(), 2)}</th> */}
                                            </tr>
                                        </tbody>
                                    )
                                }) : null
                            }
                        </table>
                    </div>
                    <div className='content-right'>
                        <table style={{ width: '100%' }}>
                            {
                                ss.length != 0 ? mapWith(3, (i) => {
                                    return (
                                        <tbody key={`history-reel${i}`}>
                                            <tr>
                                                {
                                                    mapWith(5, (j) => {
                                                        const index = ss[j][i]
                                                        return (
                                                            <th key={`history-s-${j}`}><div className={`icon-mod symbol symbol-${index} ${symbolFormat}`}></div></th>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        </tbody>
                                    )
                                }) : <></>
                            }
                        </table>
                    </div>
                </div>
                <SoundDiv className='close-icon btn-mod' onClick={onClose} style={{ position: 'absolute', right: '1rem', top: '0.5rem', height: '2rem', width: '2rem' }}></SoundDiv>
            </div>
        </div>
    )
}