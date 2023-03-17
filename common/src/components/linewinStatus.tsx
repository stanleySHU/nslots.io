import { createContext, useContext, useEffect, useState } from "react";
import { GameContext } from "../AppContext";
import { ACTION_SPIN_STOP } from "../model/actionTypes";
import { BaseSpinModel } from '../util/parser/spin/type';

export interface KLinewinConfig {
    column: number,
    row: number,
    symbol: number
}

interface KLinewinShowConfigs {
    soundId: string
    lineId: number,
    symbol: number,
    config: KLinewinConfig[]
}

interface KLinewinStatusOptions {
    children: (e: KLinewinShowConfigs) => any,
    linewinloop?: number
}

function getLinewinShowConfigs(model: BaseSpinModel, loop: [number, number]): KLinewinShowConfigs {
    let winline = model.linewin[loop[1]], config = [], reelLength = model.reels.length, column, row;
    if (winline.director =='r2l') { //default is r2l
        for (let i = reelLength - winline.count; i < reelLength; i++) {
            column = i; 
            row = winline.lines[column];
            config.push({
                column: column,
                row: row,
                symbol: model.reels[column][row]
            });
        }
    } else {
        for (let i = 0; i < winline.count; i++) {
            column = i; 
            row = winline.lines[column];
            config.push({
                column: column,
                row: row,
                symbol: model.reels[column][row]
            });
        }
    }
    return {
        soundId: `${loop[0]}_${loop[1]}`,
        symbol: winline.symbol,
        lineId: winline.id,
        config: config
    };
}

export const LinewinStatusContext = createContext<{next: () => void}>({} as any);
export function LinewinStatus({children, ...props}: KLinewinStatusOptions) {
    const {linewinloop = 5} = props;
    const {state, dispatch} = useContext(GameContext);
    const {status, responseModel} = state.spin;
    const [loop, setLoop] = useState<[number, number]>([0, 0]);
    useEffect(() => {
        if (status == 'showWinLine') {
            if (responseModel.linewin.length == 0) {
                dispatch({type: ACTION_SPIN_STOP});
            }
        }
    }, [status]);

    function next() {
        let symbolIndex = loop[1] + 1, linewinIndex = loop[0];
        if (symbolIndex == responseModel.linewin.length) {
            symbolIndex = 0;
            linewinIndex++;
        }
        if (symbolIndex == 0 && linewinIndex == linewinloop) {
            setLoop([0, 0]);
            dispatch({type: ACTION_SPIN_STOP});
        } else {
            setLoop([linewinIndex, symbolIndex]);
        }
    }

    return <LinewinStatusContext.Provider value={{next: next}}>
        {
            (status == 'showWinLine' && responseModel.linewin.length > 0) ? children(getLinewinShowConfigs(responseModel, loop)) : children({lineId: -1, config: [], symbol: null, soundId: '0_0'})
        }
    </LinewinStatusContext.Provider>
}