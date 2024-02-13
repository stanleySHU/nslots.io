import { ICannonToInt, ICannonComponent } from 'common/util/parser/spin/piratesBounty'

export const CANNOM_HIT_BOSS_HP_MAP: {[key: number]: number} = {
    1: 1,
    10: 2,
    9: 2,
    90: 3
}

export const JACKPOT = 55
export const BOSS_HP = 100
export const PLAYER_HP = 30
export const MAX_ROUNDS = 30

export const GOLD_BULLET_PNG_NAME = 'Cannon_Ball_gold.png';
export const IRON_BULLET_PNG_NAME = 'Cannon_Ball.png';


export const I_BET_AMOUNT_LIST = [1, 10, 50, 100, 500, 1000];
export const I_POINTS_LIST = [0, 1, 4, 8, 16, 26, 41, 61, 81];
export const I_POINTS_ODD_LIST = [0, 1, 2, 5, 10, 15, 25, 50, 100];


export const I_SYMBOL_FREE = 7;
export const I_SYMBOL_SUPER_FREE = 8;

//CANNON
export const I_PLAYER_CANNON_SHOOT_SPACING = 100;
export const I_CANNON_FORM_DURATION = 800;

export const I_PLAYER_CANNON_HIT_SHIP_DURATION = 800 * 0.6;
export const I_PLAYER_CANNON_HIT_OTHERSHIP_DURATION= 500;

export const I_PLAYER_CANNON_HIT_CAPTION_DURATION = 800 * 1;

export const I_PLAYER_CANNON_HIT_BOSS_DURATION = 800 * 0.6;

export const I_BOSS_CANNON_HIT_PLAYER_DURATION = 800;

export const I_WIN_POINT_FROM_SHIP_DURATION = 600;
export const I_WIN_POINT_FROM_CAPTION_DURATION = 1000;

export const I_Explosion_Duration = 500;

export function cannonDelayTime(order: number) {
    return I_PLAYER_CANNON_SHOOT_SPACING * order;
}

export function bulletDelayTime(order: number, cannonId: number) {
    const cannonDelay = cannonDelayTime(order);
    return cannonDelay + I_CANNON_FORM_DURATION;
}

export function bulletHitOtherShipDelay(order: number, cannonId: number) {
    const t = bulletDelayTime(order, cannonId);
    return t + I_PLAYER_CANNON_HIT_SHIP_DURATION;
}

export function shipExplodeDelay(order: number, cannonId: number) {
    const t = bulletDelayTime(order, cannonId);
    return t + I_PLAYER_CANNON_HIT_SHIP_DURATION;
}

export function otherShipExplodeDelay(order: number, cannonId: number) {
    const t = bulletDelayTime(order, cannonId);
    return t + I_PLAYER_CANNON_HIT_SHIP_DURATION + I_PLAYER_CANNON_HIT_OTHERSHIP_DURATION;
}

export function shipInDelayByIron(order: number, cannonId: number) {
    return shipExplodeDelay(order, cannonId);
}

export function shipInDelayByGold(order: number, cannonId: number) {
    return otherShipExplodeDelay(order, cannonId);
}