import { I_SYMBOL_BONUS_1, I_SYMBOL_BONUS_2 } from "../constants";

export type WheelStopPosition = { symbol: number; index: number; multiplier: number };

export class SpinModel {
  data: any;
  constructor(data) {
    this.data = data;
  }

  get symbolInfo(): WheelStopPosition {
    return this.data.value.wheelStopPosition;
  }

  get isBonus(): boolean {
    return this.isBonus1 || this.isBonus2;
  }

  get isBonus1(): boolean {
    return this.symbolInfo.symbol == I_SYMBOL_BONUS_1;
  }

  get isBonus2(): boolean {
    return this.symbolInfo.symbol == I_SYMBOL_BONUS_2;
  }

  get bonusSymbolInfos(): WheelStopPosition[] {
    return this.data.value.wheelBonusStopPosition;
  }

  get isExistWin(): boolean {
    return this.win.gt(0);
  }

  get win() {
    return new Decimal(this.data.value.cumulativeWin);
  }

  get balance() {
    return new Decimal(this.data.value.balance.value);
  }

  get doubleup(): { isLow: boolean; count: number; value: number; isWin: boolean; isComplete: boolean } {
    return this.data.value.doubleUp;
  }

  get bet() {
    return new Decimal(this.data.value.bet);
  }
}
