import { mapWith } from "../../util/array";

export function getRandomSymbolIndex(max: number): number {
    return Math.floor(Math.random() * (max+1));
}

export function getDefaultInitReels(row: number, column: number, maxSymbolIndex: number): number[][] {
    return mapWith(column, () => {
        return mapWith(row, () => getRandomSymbolIndex(maxSymbolIndex))
    });
}