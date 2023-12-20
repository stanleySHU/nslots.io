import { Layer } from "common/components/layer";
import { SpriteAtlas, SpriteImg } from "common/components/sprite";
import { Label } from "common/components/text";
import { toCommaAndFixed } from "common/util/amount";
import { KLineWinOptions, KWinlineParamsPositionSymbolArr } from "common/util/parser/spin/queenBee";
import { Spine_Number } from "./base";
import { useMenoConstant } from "common/components/customhook";

interface KLineWinAmountOptions {
    winline: KLineWinOptions,
    columnRowSymbolArr: KWinlineParamsPositionSymbolArr[]
}

const rowPoint = [-20, 82.5, 185].map(e => e + 20);
const columnPoint = [-65, 38, 145, 250, 355].map(e => e + 65);
// let points: [number, number][][] = (() => {
//     let res = [];
//     for (let i = 0; i < 5; i++) {
//         let arr: any[] = [];    
//         res.push(arr);
//         for (let j = 0; j < 3; j++) {
//             arr.push([columnPoint[i], rowPoint[j]]);
//         }
//     }
//     return res;
// })();

export function LineWinAmount({winline, columnRowSymbolArr = []}: KLineWinAmountOptions) {
    // let position_symbol = columnRowSymbolArr[0], point = position_symbol ? points[position_symbol[0]][position_symbol[1]] : [0,0];
    const visible = columnRowSymbolArr.length > 0 && winline.type == 10;
    // mul = type == 10 ? mul : 1;
    let length = 0, p1 = [0, 0], p2 = [0, 0], p3 = [0, 0], p4 = [0, 0];
    if (winline) {
        length = winline.columnRowSymbolArr.length;
        if (length >= 2) p1 = winline.columnRowSymbolArr[1];
        if (length >= 3) p2 = winline.columnRowSymbolArr[2];
        if (length >= 4) p3 = winline.columnRowSymbolArr[3];
        if (length >= 5) p4 = winline.columnRowSymbolArr[4];
    }

    return (
        <Layer visible={visible} >
            <Spine_Number x={columnPoint[p1[0]]} y={rowPoint[p1[1]]} playing={length >= 2} action={useMenoConstant([0, 'MultiplierWin', false])} skin={`x${1}`} toFrameOneWhenStop={true}></Spine_Number> 
            <Spine_Number x={columnPoint[p2[0]]} y={rowPoint[p2[1]]} playing={length >= 3} action={useMenoConstant([0, 'MultiplierWin', false])} skin={`x${5}`} toFrameOneWhenStop={true}></Spine_Number> 
            <Spine_Number x={columnPoint[p3[0]]} y={rowPoint[p3[1]]} playing={length >= 4} action={useMenoConstant([0, 'MultiplierWin', false])} skin={`x${10}`} toFrameOneWhenStop={true}></Spine_Number> 
            <Spine_Number x={columnPoint[p4[0]]} y={rowPoint[p4[1]]} playing={length >= 5} action={useMenoConstant([0, 'MultiplierWin', false])} skin={`x${100}`} toFrameOneWhenStop={true}></Spine_Number> 
        </Layer>
    )
}