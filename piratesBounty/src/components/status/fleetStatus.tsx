import { cloneElement, useMemo, useRef } from "react";
import { GameStatusModel, KCurrentGameStatus, KGameStep } from "./type";
import { IPointData } from "pixi.js";
import { isShortCannon } from "../widgets/utils";
import { ICannonToInt } from "common/util/parser/spin/piratesBounty";
import { ISpine_Boat } from "../widgets/base";
import { otherShipExplodeDelay, shipExplodeDelay, shipInDelayByGold, shipInDelayByIron } from "../widgets/config";
import { isPresent } from "common/util/lang";

export type IDestoryShipsMap = { [key: number]: { ship: { point: IPointData, shipId?: number }, subShips: { point: IPointData, shipId?: number }[] } };
export type ISplashInfo = { targetPoints: IPointData, delay: number }[]
export type IFleetArr = [ShipModel[], ShipModel[], ShipModel[]];

export const FleetStatus = ({ dataSource, children }: { dataSource?: GameStatusModel, children?: any }) => {
    const { state, dispatch, gameStatus, gameStep } = dataSource?.base!;
    const { csMap } = dataSource?.cannon!;
    const { current } = useRef<{
        oldFleet: [number[], number[], number[]],
        newFleet: [number[], number[], number[]],
        destoryShips: [number[], number[], number[]],
        destoryShipsMap: IDestoryShipsMap,
        fleet: IFleetArr,
        splashArr: ISplashInfo
    }>({
        oldFleet: [[], [], []],
        newFleet: [[], [], []],
        destoryShips: [[], [], []],
        destoryShipsMap: {},
        fleet: [[], [], []],
        splashArr: []
    });
    const { spinModel } = state.spin;
    const isInShipBattle = gameStep == KGameStep.inShipBattle;
    const isNotStart = gameStep == KGameStep.notStart;
    const isShowCannon = gameStatus == KCurrentGameStatus.showCannon;
    const isFogOut = gameStatus == KCurrentGameStatus.showFogOut;

    function initFleet() {
        const destoryShips = current.destoryShips;
        const newFleet = current.newFleet;
        const fleet = [
            [...destoryShips[0], ...newFleet[0]],
            [...destoryShips[1], ...newFleet[1]],
            [...destoryShips[2], ...newFleet[2]],
        ];
        const arr: any = [];
        let inColumn = 0;
        for (let sub of fleet) {
            let inRow = 0;
            const subArr = [];
            for (const shipId of sub) {
                const ship = new ShipModel(shipId, inColumn, inRow);
                ship.id = shipId;
                subArr.push(ship);
                inRow++;
            }
            arr.push(subArr);
            inColumn++;
        }
        current.fleet = arr;
    }

    useMemo(() => {
        if (isInShipBattle) {
            const fleet = spinModel!.fleet;
            current.oldFleet = fleet as [number[], number[], number[]];
            current.newFleet = [
                [...fleet[0]].splice(0, 5),
                [...fleet[1]].splice(0, 5),
                [...fleet[2]].splice(0, 5)
            ];
            initFleet();
        } else  {
            current.destoryShips = [[],[],[]];
            current.newFleet = [[],[],[]];
            initFleet();
        }
    }, [isFogOut, gameStep]);

    useMemo(() => {
        if (isShowCannon) {
            const fleet = spinModel!.fleet;
            const oldFleet = current.oldFleet;
            current.destoryShips = [
                [...oldFleet[0]].splice(0, oldFleet[0].length - fleet[0].length),
                [...oldFleet[1]].splice(0, oldFleet[1].length - fleet[1].length),
                [...oldFleet[2]].splice(0, oldFleet[2].length - fleet[2].length)
            ]
        }
    }, [isShowCannon]);

    useMemo(() => {
        if (isShowCannon) {
            const fleet = spinModel!.fleet;
            current.newFleet = [
                [...fleet[0]].splice(0, 5),
                [...fleet[1]].splice(0, 5),
                [...fleet[2]].splice(0, 5)
            ];
        }
    }, [isShowCannon]);


    useMemo(() => {
        if (isShowCannon) {
            const map: IDestoryShipsMap = {};
            const destoryShipsCountMap: { [key: number]: number } = { 0: 0, 1: 0, 2: 0 };

            function setShip(obj: any, inColumn: number) {
                const t = destoryShipsCountMap[inColumn];
                obj.ship = {
                    point: {
                        x: inColumn,
                        y: t
                    },
                    shipId: current.destoryShips[inColumn][t]
                }
                obj.subShips = [];
                // if (destoryShipsCountMap[inColumn] < current.destoryShips[inColumn].length) {
                    destoryShipsCountMap[inColumn]++;
                // }
            }

            function setCaptialShip(obj: any) {
                obj.ship = {
                    point: null,
                    shipId: null
                }
                obj.subShips = [];
            }

            function setSubShip(obj: any, inColumn: number) {
                const t = destoryShipsCountMap[inColumn];
                if (destoryShipsCountMap[inColumn] < current.destoryShips[inColumn].length) {
                    obj.subShips.push({
                        point: {
                            x: inColumn,
                            y: t
                        },
                        shipId: current.destoryShips[inColumn][t]
                    });
                } else {
                    obj.subShips.push({
                        point: {
                            x: inColumn,
                            y: t
                        },
                        shipId: null
                    });
                }
                destoryShipsCountMap[inColumn]++;
            }

            function setShipInfo(obj: any, cannonId: number, inColumn: number, inColumns: number[]) {
                if (isShortCannon(cannonId)) {
                    setShip(obj, inColumn);
                    if (cannonId == ICannonToInt.GoldShort) {
                        inColumns.forEach((column) => {
                            setSubShip(obj, column);
                        })
                    }
                } else {
                    setCaptialShip(obj);
                }
            }
            for (let inColumn in csMap) {
                const obj: any = {};
                const column = Number(inColumn);
                const cannonId = csMap[column].cannonId;
                if (column < 2) {
                    setShipInfo(obj, cannonId, 0, [0, 1]);
                } else if (column == 2) {
                    setShipInfo(obj, cannonId, 1, [0, 1, 2]);
                } else {
                    setShipInfo(obj, cannonId, 2, [1, 2]);
                }
                map[column] = { ...obj };
            }
            current.destoryShipsMap = map;
        }
    }, [isShowCannon]);

    useMemo(() => {
        if (isShowCannon) {
            current.oldFleet = spinModel!.fleet as [number[], number[], number[]];
        }
    }, [isShowCannon]);

    useMemo(() => {
        if (isShowCannon) {
            initFleet();
            const splashArr: ISplashInfo = [];

            function setShipExpand(delay: number, point: IPointData, shipId?: number) {
                const { x: inColumn, y: inRow } = point;
                if (isPresent(shipId)) {
                    const shipInfo = current.fleet[inColumn][inRow];
                    shipInfo.setDestory(delay);
                } else {
                    splashArr.push({ targetPoints: point, delay: delay });
                }
            }

            // setDestory ship
            for (let inColumn in csMap) {
                const column = Number(inColumn);
                const { order, cannonId, isLong, isGold } = csMap[column];
                if (!isLong) {
                    const { ship, subShips } = current.destoryShipsMap[column];
                    const { point, shipId } = ship;
                    const delay = shipExplodeDelay(order, cannonId);
                    const otherShipDelay = otherShipExplodeDelay(order, cannonId);
                    setShipExpand(delay, point, shipId);
                    if (isGold) {
                        for (let { point, shipId } of subShips) {
                            setShipExpand(otherShipDelay, point, shipId);
                        }
                    }
                }
                current.splashArr = splashArr;
            }

            function getDelayCenter(isGold: boolean, order: number, cannonColumn: number) {
                const { x, y } = current.destoryShipsMap[cannonColumn].ship.point;
                if (isGold && isPresent(current.destoryShips[x][y + 1])) {
                    return shipInDelayByGold(order, 9);
                } else {
                    return shipInDelayByIron(order, 1);
                }
            }

            function getDelayleft(order: number, cannonColumn: number) {
                const { ship, subShips } = current.destoryShipsMap[cannonColumn];
                const { x, y } = ship.point;
                const isExistLeftShip = subShips.find(e => e.point.x == (x - 1));
                if (isExistLeftShip) {
                    return shipInDelayByGold(order, 9);
                }
                console.warn('getDelayleft error')
            }

            function getDelayRight(order: number, cannonColumn: number) {
                const { ship, subShips } = current.destoryShipsMap[cannonColumn];
                const { x, y } = ship.point;
                const isExistRightShip = subShips.find(e => e.point.x == (x + 1));
                if (isExistRightShip) {
                    return shipInDelayByGold(order, 9);
                }
                console.warn('getDelayright error')
            }

            //set new ship
            let delay;
            const destoryShips2Count = current.destoryShips[2].length, destoryShips1Count = current.destoryShips[1].length, destoryShips0Count = current.destoryShips[0].length;
            if (destoryShips2Count > 0) { //from 2 | 3 | 4
                const cs4 = csMap[4], cs3 = csMap[3], cs2 = csMap[2];
                if (cs4 && !cs4.isLong) {
                    delay = getDelayCenter(cs4.isGold, cs4.order, 4);
                } else if (cs3 && !cs3.isLong) {
                    delay = getDelayCenter(cs3.isGold, cs3.order, 3);
                } else if (cs2 && cs2.isGold && !cs2.isLong) {
                    delay = getDelayRight(cs2.order, 2);
                }
                let index = 0;
                for (let i = destoryShips2Count; i < current.fleet[2].length; i++) {
                    const ship = current.fleet[2][i];
                    ship.setShipIn(delay!, index++);
                }
            }
            if (destoryShips1Count > 0) {
                const cs4 = csMap[4], cs3 = csMap[3], cs2 = csMap[2], cs1 = csMap[1], cs0 = csMap[0];
                if (cs4 && !cs4.isGold && !cs4.isLong) {
                    delay = getDelayleft(cs4.order, 4);
                } else if (cs3 && !cs3.isGold && !cs3.isLong) {
                    delay = getDelayleft(cs3.order, 3);
                } else if (cs2 && !cs2.isLong) {
                    delay = getDelayCenter(cs2.isGold, cs2.order, 2);
                } else if (cs1 && cs1.isGold && !cs1.isLong) {
                    delay = getDelayRight(cs1.order, 1);
                } else if (cs0 && cs0.isGold && !cs0.isLong) {
                    delay = getDelayRight(cs0.order, 0);
                }
                let index = 0;
                for (let i = destoryShips1Count; i < current.fleet[1].length; i++) {
                    const ship = current.fleet[1][i];
                    ship.setShipIn(delay!, index++);
                }
            }
            if (destoryShips0Count > 0) {
                const cs2 = csMap[2], cs1 = csMap[1], cs0 = csMap[0];
                if (cs2 && cs2.isGold && !cs2.isLong) {
                    delay = getDelayleft(cs2.order, 2);
                } else if (cs1 && !cs1.isLong) {
                    delay = getDelayCenter(cs1.isGold, cs1.order, 1);
                } else if (cs0 && !cs0.isLong) {
                    delay = getDelayCenter(cs0.isGold, cs0.order, 0);
                }
                let index = 0;
                for (let i = destoryShips0Count; i < current.fleet[0].length; i++) {
                    const ship = current.fleet[0][i];
                    ship.setShipIn(delay!, index++);
                }
            }
        }
    }, [isShowCannon]);

    const fleet = useMemo(() => {
        return current.fleet.map(e => [...e].reverse());
    }, [current.fleet])

    const _dataSource: GameStatusModel = {
        ...dataSource,
        fleet: {
            destoryShipsMap: current.destoryShipsMap,
            fleet: fleet,
            splashArr: current.splashArr,
            destoryShips: current.destoryShips
        }
    }

    return cloneElement(children, { dataSource: _dataSource })
}

export class ShipModel {
    id: number;
    inColumn: number;
    inRow: number;
    nextRow: number
    action: [number, ISpine_Boat, boolean];
    isDestory: boolean;
    destoryDelay: number;
    pt: number;
    isMove: boolean;
    moveDelay: number;
    moveDuration: number;

    constructor(id: number, inColumn: number, inRow: number) {
        this.id = id;
        this.inColumn = inColumn;
        this.inRow = inRow;
        this.nextRow = inRow;
        this.isMove = false;
        this.moveDelay = 0;
        this.action = [0, `Lv${id}boat_${[`left`, `mid`, `right`][inColumn]}` as ISpine_Boat, true];
        this.isDestory = false;
        this.destoryDelay = 0;
        this.pt = id;
        this.moveDuration = 0;
    }

    setDestory(destoryDelay: number) {
        this.isDestory = true;
        this.destoryDelay = destoryDelay;
    }

    setShipIn(moveDelay: number, nextRow: number) {
        this.isMove = true;
        this.moveDelay = moveDelay;
        this.nextRow = nextRow;
        this.moveDuration = 300 * (Math.min(5, this.inRow) - this.nextRow);
    }
}