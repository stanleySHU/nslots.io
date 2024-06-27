export type ResultResponse = {
  value: ResultValue | BonusResultValue | CollapsingResultValue;
  error: number;
  errorCode: string;
  isError: boolean;
};

export type ResultValue = {
  isRespinBonus: boolean;
  balance: Balance;
  bet: number;
  bonus: Bonus;
  collapsingAdds: {};
  collapsingMultiplier: number;
  collapsingRemoves: {};
  collapsingSpinCount: number;
  credit: number;
  cumulativeWin: number;
  currentFreeSpinCounter: number;
  currentFreeSpinStep: number;
  frsumm: number;
  hasBonus: boolean;
  isBonus: boolean;
  isBuyFreeSpin: boolean;
  isCollapse: boolean;
  isFirstCollapse: boolean;
  isFreeGame: boolean;
  isFreeSpin: boolean;
  isSuperFreeSpin: boolean;
  multiplier: number;
  numOfFreeSpin: number;
  numOfScatter: number;
  totalWin: number;
  type: string | "s";
  uniqueID: string;
  win: number;
  winElement: WinElement;
  winPositions: [];
  wheel: Wheel;
};

export type CollapsingResultValue = {
  balance: Balance;
  bet: number;
  bonus: Bonus;
  frsumm: number;
  isCompleted: boolean;
  isFreeGame: boolean;
  spinResult: SpinResult;
  step: number;
  type: string | 'cs';
  uniqueID: string;
  win: number;
  xmlType: number;


}

export type BonusResultValue = {
  balance: Balance;
  bet: number;
  bonus: BonusBonus;
  counter: number;
  cumulativeWin: number;
  currentStep: number;
  frsumm: number;
  isCompleted: boolean;
  isFreeGame: boolean;
  isFreeSpin: boolean;
  mainGameKey: number;
  step: number;
  totalSpin: number;
  type: string | 'fs';
  uniqueID: string;
  win: number;
  xmlType: number;
  spinResult: SpinResult;
};

export type SpinResult = {
  win: decimal.Decimal;
  multiplier?: number;
  balance: decimal.Decimal;
  wheels: number[][];
  winLines?: number[];
  winPositions?: number[];
  wheel: Wheel;
  bonusID?: string;
  bonusKey?: string;
  bonus?: any;
  data?: any;
  fround?: any;

  //bonus
  bet: number;
  collapsingAdds: {0: [], 1: [], 2:[], 3: [], 4:[]}
  collapsingMultiplier: number;
  collapsingRemoves: {0: [], 1: [], 2:[], 3: [], 4:[]}
  collapsingSpinCount: number;
  credit: number;
  cumulativeWin: number;
  currentFreeSpinCounter: number;
  currentFreeSpinStep: number;
  frsumm: number;
  hasBonus: boolean;
  isBonus: boolean;
  isBuyFreeSpin: boolean;
  isCollapse: boolean;
  isFirstCollapse: boolean;
  isFreeGame: boolean;
  isFreeSpin: boolean;
  isSuperFreeSpin: boolean;
  numOfFreeSpin: number;
  numOfScatter: number;
  totalWin: number;
  type: string | 's';
  winElement: WinElement;
};

export type SpinBet = {
  credits: number;
  currencyId: number;
  funPlayDemoKey: number;
  gameSettingGroupId: number;
  isAutoSpin: boolean;
  lineBet: number;
  lines: number;
  multiplier: number;
  platformType: number;
  reel: number;
  totalBet: number;
  userGameKey: UserGameKey;
};

export type Wheel = {
  fallDownAmount: number[];
  fallDownIndexes: number[];
  height: number;
  mode: number;
  parSheetClsId: number;
  reels: number[][];
  rows: number[];
  type: number;
  width: number;
};

export type UserGameKey = {
  campaignId: number;
  frExpired: boolean;
  frWinLose: number;
  gameId: number;
  gameMode: number;
  isBonusAccount: boolean;
  isFreeGame: boolean;
  isFunPlay: boolean;
  level: number;
  userId: number;
};
export type WinElement = {
  credit: number;
  jackpot: number;
  value: number;
};
export type Bonus = {
  id: number;
  count: number;
};

export type BonusBonus = 
{
  counter: number;
  cumulativeWin: number;
  currentFreeSpinStep: number;
  gameWin: number;
  guid: string;
  id: number;
  isCompleted: boolean;
  isCollapsingFreeSpin: boolean;
  isFreeSpin: boolean;
  isOptional: boolean;
  isStarted: boolean;
  maxRound: number;
  maxStepPerCurrentRound: number;
  multiplier: number;
  numOfFreeSpin: number;  
  spinBet: SpinBet;
  version: number;
  additionalCounter: number;
  gameResult: ResultValue;
}

export type Balance = {
  conversion: number;
  credit: number;
  value: number;
};


export type GAME_STATE = 'IDLE' | 'SPIN' | 'FS' | 'COLLAPSING' | 'SUPERGOLD' | 'PREFS' | 'PRESUPERGOLD';
export type GAME_TYPE = 'test' | 'real';
