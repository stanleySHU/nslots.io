import { TableLinesOptions } from '../../../model/context';
import { BaseSpinModel, KLineWinOptions } from './type';


// {"ss":[[7,8,3],[2,7,4],[0,1,5],[1,7,2],[4,9,7]],"sm":0,"lm":12,"lw":{"l2r":[[3,7,2,3]],"r2l":[[8,9,1,2],[7,9,1,2],[4,7,2,3],[0,9,1,2]]}}
// line，　symbol，count， multiplier

export class SpinModel extends BaseSpinModel {
    constructor(data, table: TableLinesOptions) {
        super(data, table);

        let lineWins: KLineWinOptions[] = [],
            bonusLineWins = [],
            bonusSymbols = [];
        if (data.lw) {
            for (let key in data.lw) {
                for (let item of data.lw[key]) {
                    let id = item[0];
                    let line: KLineWinOptions= {
                        id: id,
                        symbol: item[1],
                        multiplier: item[3],
                        lines: table.payLineMap[id],
                        linePath: table.winLinePathMap[id],
                        count: item[2],
                        director: key as any
                    }
                    lineWins.push(line);
                    if (table.bonusSymbols && table.bonusSymbols.indexOf(line.symbol) >= 0) {
                        bonusLineWins.push(line);
                        bonusSymbols.push(line.symbol);
                    }   
                }
            }
        }
        this.bonusLinewin = bonusLineWins;
        this.bonusSymbols = bonusSymbols;
        this.linewin = lineWins.sort((a, b) => {
            return (a.id > b.id || (a.id == b.id && a.director == 'l2r')) ? 1 : -1;
        });
    }
}
