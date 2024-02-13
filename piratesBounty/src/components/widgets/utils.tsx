import { ICannonToInt, ICannonComponent } from 'common/util/parser/spin/piratesBounty';

export function isLongCannon(c: number) {
    return c == ICannonToInt.IronLong || c == ICannonToInt.GoldLong;
}

export function isShortCannon(c: number) {
    return c == ICannonToInt.IronShort || c == ICannonToInt.GoldShort;
}

export function isBaseOfCannon(c: number) {
    return c == ICannonComponent.Base || c == ICannonComponent.GBase;
}

export function isGunOfCannon(c: number) {
    return c == ICannonComponent.Gun || c == ICannonComponent.GGun;
}

export function isGoldCannon(c: number) {
    return c == ICannonToInt.GoldLong || c == ICannonToInt.GoldShort;
}