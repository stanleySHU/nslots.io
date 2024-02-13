import './list.scss'
import { toCommaAndFixed } from 'common/util/amount';
import { KDefaultHistoryListItemOptions, HistoryList as _HistoryList } from 'common/components2/history/list';

export function getBetDescription(data: any) {
    const cost = Number(data.cost);
    const ng = data.result.ng;
    if (cost > 0) {
        return toCommaAndFixed(Number(data.cost));
    } else if (!data.result.slot) {
        return 'start';
    } else {
        const ss = data.result.slot.ss;
        const isFree = ss[0].length == 5;
        if (isFree) {
            return 'free spin';
        } else {
            return 'respin';
        }
    }
}

export function HistoryList() {
    return <_HistoryList order={0} TitleEL={HistoryListTitle} ItemEL={HistoryListItem}></_HistoryList>
}

export function HistoryListTitle({currency}: {currency: string}) {
    return <div className='pirates-history-list-item list history-info history-head'>
        <div className='item id'>Boss HP/<br></br>Rolls</div>
        <div className='item time'>Time</div>
        <div className='item bet'>Bet<br></br>(currency)</div>
        <div className='item total-points'>Earn<br></br>Points</div>
        <div className='item payout'>Payout<br></br>(currency)</div>
        <div className='item detail'>Detail</div>
    </div>
}

export function HistoryListItem({ item, index, onHistoryDetail }: KDefaultHistoryListItemOptions) {
    const existSlot = item.result.slot;
    const color = item.result.battle.r * 8;
    const hp = item.result.battle.bh * 5;
    //`rgb(${color}, ${255}, ${hp})`
    return <li className='pirates-history-list-item list history-info btn-mod' onClick={existSlot ? onHistoryDetail.bind(null, item) : null}>
        <div className='item id' style={{ color: `rgb(${255}, ${51}, ${51})` }}>{`${item.result.battle.bh}/${30 - item.result.battle.r}`}</div>
        <div className='item time'>{item.createdOnFormat}</div>
        <div className='item bet'>{getBetDescription(item)}</div>
        <div className='item total-points'>{item.result.accPoints || 0}</div>
        <div className='item payout'>{toCommaAndFixed(Number(item.payout))}</div>
        <div className={`item detail ${existSlot ? 'btn-mod' : ''}`}>
            {/* <div className={`info icon-mod ${existSlot ? 'history-info-icon' : ''}`}></div> */}
            <svg xmlns="http://www.w3.org/2000/svg" className='info' viewBox="0 0 24 24">
                <path d="M 12 2 C 10.343 2 9 3.343 9 5 C 9 6.657 10.343 8 12 8 C 13.657 8 15 6.657 15 5 C 15 3.343 13.657 2 12 2 z M 9 10 A 1.0001 1.0001 0 1 0 9 12 L 10 12 L 10 20 L 9 20 A 1.0001 1.0001 0 1 0 9 22 L 15 22 A 1.0001 1.0001 0 1 0 15 20 L 14 20 L 14 11 C 14 10.448 13.552 10 13 10 L 11 10 L 9 10 z"></path>
            </svg>
        </div>
    </li>
}