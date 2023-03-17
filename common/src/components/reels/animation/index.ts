export interface KAnimationSymbolPropsOptions {
    id: number,
    sIndex: number,
    y?: number
}

export interface KAnimationReelsPropsOptions {
    reelStop: boolean,
    reelStopColumn: number,
    reelStates: KAnimationSymbolPropsOptions[][]
}