import { registerReducerInitial } from 'common/other/register';
import config from '../../config.json';
import { KGameTableOptions, KGameConfigOptions  } from 'common/model/context/baseContext';
import Decimal from 'decimal.js';
import { safeAreaInMobileL, safeAreaInMobileP } from 'common/util/layout';
import { getPaylinePathMap, getPaylineMap } from 'common/util/winline';

let paylineMap = {
    0: [1,1,1,1,1],
    1: [0,0,0,0,0],
    2: [2,2,2,2,2],
    3: [0,1,2,1,0],
    4: [2,1,0,1,2],
    5: [0,0,1,0,0],
    6: [2,2,1,2,2],
    7: [1,2,2,2,1],
    8: [1,0,0,0,1]
}

const tableModel: KGameTableOptions = {
	row: 3,
	column: 5,
    paylineMapV2: paylineMap,
	paylineMap: getPaylineMap(paylineMap),
    paylinePathMap: getPaylinePathMap(paylineMap),
    symbolSize: [104,102],
    symbolFrame: [104, 102]
}
registerReducerInitial('table', tableModel);


const configModel: KGameConfigOptions = {
    id: 1,
    layoutMap: {
        l: {
            safeArea: safeAreaInMobileL([105, 265, 1170, 650], false),
            displayArea: [0, 185, 1170, 800]
        },
        p: {
            safeArea: safeAreaInMobileP([285, 105, 600, 960], false),
            displayArea: [0, 70, 1170, 1100]
        }
    }
}
registerReducerInitial('gameconfig', Object.assign(configModel, config));

const spinModel = {
    spin: {
        betLevel: new Decimal(9)
    }
} 
registerReducerInitial('spin', spinModel);