import { AppStateOptions } from "common/AppContext";
import { KReducerActionOptions } from "common/model/actionTypes";
import { KSpinStatus } from "common/model/spin";
import { SpinModel } from "common/util/parser/spin/piratesBounty";
import { ReactElement } from "react";
import { IDestoryShipsMap, IFleetArr, ISplashInfo } from "./fleetStatus";
import { KCSMapmodel } from "./cannonStatus";
import { IBulletHitBossInfo, IBulletInfo } from "./bulletStatus";
import { IWinPointTweenArr } from "./pointStatus";
import { IWinJackpotArr } from "./jackpotStatus";
import { KCaptialHpReduce } from "./captialStatus";

export enum KCurrentGameStatus {
    showShipBattleOut = 'showShipBattleOut',
    showBossIn = 'showBossIn',
    showFogIn = 'showFogIn',
    showFogOut = 'showFogOut',
    showGetScatter = 'showGetScatter',
    showActiveGear = 'showActiveGear',
    showCannon = 'showCannon',
    showWinAmount = 'showWinAmount',
    showFreeSpinWinAmount = 'showFreeSpinWinAmount',
    showGetFreeSpin = 'showGetFreeSpin',
    showGateOpen = 'showGateOpen',
    showGateClose = 'showGateClose',
    bossHit = 'bossHit',
    bossDestory = 'bossDestory',
    loseInBossBattle = 'loseInBossBattle',
    loseInShip = 'loseInShip',
    win = 'win'    
}

export type KGameStatus = KSpinStatus | KCurrentGameStatus;
export enum KGameStep  {
    notStart = 'notStart',
    inShipBattle = 'inShipBattle',
    InBossBattle = 'InBossBattle',
    bossDestroyed = 'bossDestroyed'
}

export type KBossCannonStatus = 'Reload' | 'Idle' | 'Fire' | 'readyFire' ;

interface KMascotModel {
    action: 'Idle' | 'Cheer' | 'Jump' | 'Shocked' | 'Sword' | 'Telescope';   
}

export interface GameStatusComponent {
    children: ReactElement,
    dataSource?: GameStatusModel
}

export interface GameStatusModel {
    base?: {
        state: AppStateOptions<SpinModel>,
        dispatch: (e: KReducerActionOptions) => any,
        nextGameStatus: () => void,
        gameStatus: KGameStatus,
        gameStep: KGameStep,
        spunRound: number
    },
    actions?: {
        onForceUpdateAll: () => void,
        onFogOut: () => void,
        onGameStart: (e: boolean) => void,
        onGameGiveUp: (e: boolean) => void,
        onGoToInit: () => void,
        onContinue: () => void
    },
    tips?: {
        showGameStartTip: boolean,
        showGiveUpTip: boolean,
    },
    fs?: {
        inFS: boolean,
        fsCount: number
    },
    points? : {
        accPoints: number,
        activeWinShipPoint: IWinPointTweenArr
    },
    fleet?: {
        destoryShipsMap: IDestoryShipsMap,
        fleet: IFleetArr;
        splashArr: ISplashInfo,
        destoryShips: [[], [], []]
    },
    cannon?: {
        showCannonId: number,
        csMap: KCSMapmodel
    },
    gear?: {
        activeReels: number[],
        respinReels: number[]
    },
    jackpot?: {
        jpValue: number,
        getJpInfoTween: IWinJackpotArr
    },
    bullet?: {
        bulletHitShipMap: IBulletInfo,
        bulletHitCaptialMap: IBulletInfo,
        bulletHitOtherShipMap: IBulletInfo,
        bulletHitBossMap: IBulletHitBossInfo
    },
    captial?: {
        distance: number,
        hp: number,
        hpReduceId: number,
        hpReduceMap: {[key: number]: KCaptialHpReduce},
        hpIncreaseId: number
    },
    boss?: {
        bossHP: number
        playerHP: number,
    }
};

// [0, 1, 2, 3, 4, 5, 6, 7]
// 1: cannon
// 2: bullet
// 3: ship1 ship2
// 4: ship in