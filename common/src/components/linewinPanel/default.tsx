import { KComponentOptions, Layer } from "../layer";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../AppContext";
import { KLineOptions, Line } from '../line';
import { TableLinesOptions } from "../../model/context";

interface KLinewinPanelOptions extends KComponentOptions {
    lineId: number;
    lineConfig: KLineOptions;
}

function getInitlines(table: TableLinesOptions, lineConfig) {
    let map = {};
    for (let id in table.winLinePathMap) {
        let line = <Line key={`winline_${id}`} {...lineConfig} path={table.winLinePathMap[id].map(([x, y]) => { 
            let i = x % 1, j = x - i;
            if (table.column == j) {
                i = 1;
                j = j - 1;
            }
            return [j * table.symbolFrame[0] + i * table.symbolSize[0], y * table.symbolFrame[1]]
         })}></Line>;  
        map[id] = line;
    }
    return map;
}

export function LinewinPanel({lineConfig, lineId, ...props}: KLinewinPanelOptions) {
    const { state } = useContext(GameContext);
    const [lineMap, setLineMap] = useState({});

    useEffect(() => {
        setLineMap(getInitlines(state.game.table, lineConfig));
    }, []);

    return <Layer {...props}>
        {
            lineMap[lineId]
        }
    </Layer>
}