import { TableLinesOptions } from "../../../model/context";

export interface KLineWinOptions {
    readonly id: number, 
    readonly symbol: number,   //symbol => bonus, respin
    readonly multiplier: number;
    readonly lines: number[];   
    readonly linePath: [number,number][];
    readonly count: number;
    readonly director?: 'l2r' | 'r2l';
}

export abstract class BaseSpinModel {
    readonly reels: number[][];   //ss => snapshot
    readonly scaterMultiplier: number;    //sm => scater multiplier
    readonly lineMultiplier: number;       //lm => line multiplier
    linewin: KLineWinOptions[];   //lw line win
    bonusLinewin: KLineWinOptions[]; 
    bonusSymbols: number[];

    constructor(data, table: TableLinesOptions) {
        this.reels = data.ss;
        this.scaterMultiplier = data.sm;
        this.lineMultiplier = data.lm;
    }
}