import { SoundDiv } from 'common/components2/widget/button';
import './rule.scss';
import { GameContext } from "common/AppContext";
import { SlotContext } from 'common/model/context';
import { mapWith } from 'common/util/array';
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { action_paytableOpen } from 'common/model/setting';
import { useDebounce, useMenoConstant } from 'common/components/customhook';
import { DivLang } from 'common/components2/widget/text';
import { Languages } from 'common/model/context/baseContext';

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
    const lang = SlotContext.Obj.urlOptions.lang;

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
        // if (scrollTop > scatterViewOffsetTop) {
        //     setSelected(2);
        // } else if (scrollTop > scatterViewOffsetTop) {
        //     setSelected(1);
        // } else {
        //     setSelected(0);
        // }

        if (scrollTop < scatterViewOffsetTop - 200) {
            setSelected(0);
        } else if (scrollTop < scatterViewOffsetTop + 150) {
            setSelected(1);
        } else {
            setSelected(2);
        }
    }, 300);

    function onSelected(e: number) {
        let y = 0;
        if (e == 1) {
            y = scatterView.current?.offsetTop || 0;
        } else if (e == 2) {
            y = gamePlayView.current?.offsetTop || 0;
        }
        scrollView.current?.scrollTo({
            top: y,
            behavior: "smooth"
        });
        setSelected(e);
    }

    useEffect(() => {
        if (payTableOn) {
            scrollView.current?.scrollTo({
                top: 0
            });
        }
    }, [payTableOn])

    const symbolFormat = useMenoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'png']));

    return (
        <div className={`page-mod ${payTableOn ? 'db' : 'dn'}`}>
            <div className='rule-bg-mod'>
                <div className={`blur-bg bg ${useMenoConstant(SlotContext.Obj.filterImageFormat(['avif', 'webp', 'jpg']))}`}></div>
                <div className='cover blur-filter-mod'></div>
            </div>
            <div className={`rule-head-mod ${orientation}`}>
                <div className='list'>
                    <DivLang className={`item btn-mod ${selected == 0 ? 'selected' : ''}`} onClick={onSelected.bind(null, 0)}>payout</DivLang>
                    <DivLang className={`item btn-mod ${selected == 1 ? 'selected' : ''}`} onClick={onSelected.bind(null, 1)}>features</DivLang>
                    <DivLang className={`item btn-mod ${selected == 2 ? 'selected' : ''}`} onClick={onSelected.bind(null, 2)}>gameplay</DivLang>
                </div>
            </div>
            <div ref={scrollView} className="rule-page-mod hidden-scroolbar" onScroll={onScroll}>
                <div ref={payoutView} id={'geisha-payout'} className='paytable-mod clearfix'>
                    <DivLang className='title'>paytable</DivLang>
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
                    <DivLang className='title'>paylines</DivLang>
                    <div className='clearfix'>
                        {
                            paylineInfo.map((item, index) => {
                                return (
                                    <div className={`item ${orientation}`} key={`line${index}`}>
                                        <div className='dib' style={{ verticalAlign: 'middle', padding: '1rem 1rem 1rem 0', color: '#ffffff' }}>{index + 1}</div>
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
                        <DivLang>9lines</DivLang>
                        <DivLang className='text'>features1</DivLang>
                        {/* <div className='text'>LEFTMOST TO RIGHT AND RIGHTMOST TO LEFT ON THE ACTIVE PAYLINES.</div> */}
                        <DivLang className='text'>payFeatures1</DivLang>
                        <DivLang className='text'>features2</DivLang>
                        <DivLang className='text'>payFeatures2</DivLang>
                    </div>
                </div>
                <div ref={scatterView} className='wild-scatter-mod'>
                    <DivLang className='title'>wild_scatter</DivLang>
                    <div style={{ textAlign: 'center' }}>
                        <div>
                            <div className={`icon-mod symbol ${lang == Languages.Chinese ? 'symbol-11-cn' : "symbol-11"} ${symbolFormat}`} style={{ verticalAlign: 'middle', margin: '0' }}></div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.English || lang == Languages.Japanese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>The <div className='dib text-coral'>WILD</div> will substute ALL symbols including <div className='dib text-coral'>SCATTER</div></div>
                            <div className='text'><div className='dib text-coral'>WILD</div> will appear on 2, 3, 4, reel only.</div>
                            <div className='text'>All winning combination with <div className='dib text-coral'>WILD</div> are <div className='dib text-coral'>x 2 !</div></div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Chinese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'><div className='dib text-coral'>百搭符号</div>将替代包括<div className='dib text-coral'>夺宝符号</div>在内的所有符号</div>
                            <div className='text'><div className='dib text-coral'>百搭符号</div>只出现在2, 3, 4,卷轴上。</div>
                            <div className='text'>所有带<div className='dib text-coral'>百搭符号</div>的中奖组合都是<div className='dib text-coral'>2倍!</div></div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Indonesian) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'><div className='dib text-coral'>WILD</div> akan menggantikan SEMUA simbol termasuk<div className='dib text-coral'>SCATTER</div></div>
                            <div className='text'><div className='dib text-coral'>WILD</div> akan muncul di reel 2, 3, 4, saja.</div>
                            <div className='text'>emua kombinasi pemenang dengan <div className='dib text-coral'>WILD</div> adalah<div className='dib text-coral'>x 2 !</div></div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Vietnamese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>Biểu tượng <div className='dib text-coral'>WILD</div> sẽ thay thế TẤT CẢ các biểu tượng bao gồm cả<div className='dib text-coral'>SCATTER</div></div>
                            <div className='text'>Biểu tượng <div className='dib text-coral'>WILD</div> sẽ chỉ xuất hiện trên cuộn quay 2,3,4.</div>
                            <div className='text'> Tất cả các kết hợp chiến thắng với biểu tượng <div className='dib text-coral'>WILD</div> sẽ được thánh toán <div className='dib text-coral'>x 2</div> lần!</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Korean) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle', marginTop: '1rem' }}>
                            <div style={{height: '2rem'}}><div className='text'><div className='dib text-coral'>와일드</div> 는 <div className='dib text-coral'>SCATTER</div>를 포함한 모든 심볼을 대체합니다.</div></div>
                            <div className='text'><div className='dib text-coral'>와일드</div> 는 오직 2, 3, 4릴에 나타납니다.</div>
                            <div className='text'>모든 <div className='dib text-coral'>와일드</div>  당첨 조합은 <div className='dib text-coral'>x2</div>  입니다!</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Khmer) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>និមិត្តសញ្ញា <div className='dib text-coral'>WILD</div> នឹងបូកជាមួយនិមិត្តសញ្ញាដ៏ទៃទៀតទាំងអស់រួមទាំង<div className='dib text-coral'>SCATTER</div></div>
                            <div className='text'><div className='dib text-coral'>WILD</div> លេចចេញនៅលើ Reel ទី2 ទី3 ទី4 តែប៉ុណ្ណោះ</div>
                            <div className='text'>រាល់ការឈ្នះបូកបញ្ចូលគ្នាជាមួយនិមិត្តសញ្ញា <div className='dib text-coral'>WILD</div> ត្រូវ <div className='dib text-coral'>x 2!</div></div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Thai) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>สัญลักษณ์ <div className='dib text-coral'>WILD</div> จะแทนที่สัญลักษณ์ทั้งหมด รวมถึงสัญลักษณ์<div className='dib text-coral'>SCATTER</div></div>
                            <div className='text'>สัญลักษณ์ <div className='dib text-coral'>WILD</div> จะปรากฏบนแถว 2, 3, 4, เท่านั้น</div>
                            <div className='text'>สัญลักษณที่ชนะโดยมีสัญลักษณ์ WILD ผสมอยู่ด้วยจะได้รับรางวัล <div className='dib text-coral'>x 2!</div></div>
                        </div>

                
                    </div>
                    <div className='clearfix' style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <div className='symbol-mod db' style={{ verticalAlign: 'middle', float: 'none', width: 'auto' }} >
                            <div className='left'>
                                <div className={`icon-mod symbol ${lang == Languages.Chinese ? 'symbol-10-cn' : "symbol-10"} ${symbolFormat}`}></div>
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
                        <div className={`description ${orientation} ${(lang == Languages.English || lang == Languages.Japanese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>2 or more <div className='dib text-coral'>SCATTER</div> appearing consecutively from leftmost to right</div>
                            <div className='text'>or rightmost to left awards payout.</div>
                            <div className='text'>The <div className='dib text-coral'>SCATTER</div> win is multiplied by TOTAL BET.</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Chinese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>从最左到右或者从最右到左连续出现2个或更多的<div className='dib text-coral'>夺宝符号</div></div>
                            <div className='text'>即可获得奖金。</div>
                            <div className='text'><div className='dib text-coral'>夺宝符号</div>奖金是由获得的倍数乘以总投注额</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Indonesian) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>2 atau lebih <div className='dib text-coral'>SCATTER</div> muncul secara berurutan dari kiri ke kanan</div>
                            <div className='text'>atau pembayaran penghargaan dari kanan ke kiri.</div>
                            <div className='text'>Kemenangan <div className='dib text-coral'>SCATTER</div> dikalikan TOTAL BET.</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Vietnamese) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>Từ 2 biểu tượng <div className='dib text-coral'>SCATTER</div> trở lên xuất hiện liên tiếp từ trái sang phải</div>
                            <div className='text'>hoặc từ phải sang trái sẽ được thanh toán chiến thắng.</div>
                            <div className='text'>Chiến thắng <div className='dib text-coral'>SCATTER</div> được thanh toán dựa vào hệ số nhân với TỔNG CƯỢC.</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Korean) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>2개 또는 이상의 <div className='dib text-coral'>스캐터</div>가 왼쪽에서 오른쪽으로 또는 </div>
                            <div className='text'>오른쪽에서 왼쪽으로 연속적으로 나올 경우 당첨금이 지급됩니다.</div>
                            <div className='text'><div className='dib text-coral'>스캐터</div> 당첨은 총 베팅에 곱해져 지급됩니다.</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Khmer) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>និមិត្តសញ្ញា <div className='dib text-coral'>SCATTER</div> ចំនួន2 ឬច្រើនលេខចេញបន្តបន្ទាប់គ្នាពីឆ្វេងទៅស្តាំ </div>
                            <div className='text'>ឬពីស្តាំទៅឆ្វេងនឹងត្រូវបានទូទាត់សង</div>
                            <div className='text'>ការឈ្នះ <div className='dib text-coral'>SCATTER</div>  ត្រូវបានគណនាដោយចំនូនភ្នាល់សរុប</div>
                        </div>
                        <div className={`description ${orientation} ${(lang == Languages.Thai) ? 'db' : 'dn'}`} style={{ verticalAlign: 'middle' }}>
                            <div className='text'>ปรากฏสัญลักษณ์ <div className='dib text-coral'>SCATTER</div> 2 ตัวขึ้นไปติดต่อกันจากซ้ายไปขวา </div>
                            <div className='text'>หรือขวาไปซ้าย การจ่ายเงินรางวัล</div>
                            <div className='text'>การชนะสัญลักษณ์ <div className='dib text-coral'>SCATTER</div> จะคูณด้วยการเดิมพันทั้งหมด</div>
                        </div>
                    </div>
                </div>
                <div ref={gamePlayView} id={'geisha-gameplay'} className='game-info-mod'>
                    <DivLang className='title'>gameplay</DivLang>
                    <div className='detail-table'>
                        <div>
                            <div className='item'>
                                <DivLang>reel</DivLang>
                                <DivLang>3_5reel</DivLang>
                            </div>
                            <div className='item'>
                                <DivLang>fixedlinesNo</DivLang>
                                <DivLang>9lines</DivLang>
                            </div>
                            <div className='item'>
                                <DivLang>defaultrtp</DivLang>
                                <div>95.45%</div>
                            </div>
                        </div>
                    </div>
                    <div className={`description ${orientation}`} style={{ marginTop: '2rem' }}>
                        <DivLang className='text text-coral'>minmaxbet</DivLang>
                        <DivLang className='text' style={{ fontWeight: 'bold' }}>gameplay1</DivLang>

                        <div className='clearfix'>
                            <div className='text fl'><DivLang style={{ fontWeight: 'bold' }} tmp={['example', ':']}></DivLang> </div>
                            <div className='fl'>
                                <DivLang className='text'>gameplay2</DivLang>
                                <DivLang className='text' replaceMap={{'{%line%}': '9', '{%amount%}': '1.00'}}>gameplay3</DivLang>
                            </div>
                        </div>
                        <DivLang className='text' style={{ marginTop: '1.3rem' }} replaceMap={{'{%amount%}': '9.00'}}>gameplay4</DivLang>
                    </div>
                    <div className={`description ${orientation}`}>
                        <DivLang className='text text-coral' tmp={['howtoplay',":"]}></DivLang>
                        <div className='text'><DivLang className='dib text' tmp={['1.', 'howtoplay1']}></DivLang></div>
                        <div className='text'><DivLang className='dib text' tmp={['2.', 'howtoplay2']}></DivLang></div>
                        <div className='text'><DivLang className='dib text' tmp={['3.', 'howtoplay3']}></DivLang></div>
                    </div>
                </div>
            </div>
            <SoundDiv className='close-icon btn-mod' onClick={close} style={{ position: 'absolute', right: '1rem', top: '1.4rem', height: '2rem', width: '2rem' }}></SoundDiv>
        </div>
    )
}