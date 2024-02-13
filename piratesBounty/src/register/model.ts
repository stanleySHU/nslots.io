import { registerReducerInitial } from 'common/other/register';
import config from '../../config.json';
import { KGameConfigOptions, KGameTableOptions } from 'common/model/context/baseContext';
import Decimal from 'decimal.js';

const tableModel: KGameTableOptions = {
	row: 5,
	column: 3,
    paylineMapV2: {},
	paylineMap: {},
    paylinePathMap: {},
    symbolSize: [118,118],
    symbolFrame: [118, 118]
}
registerReducerInitial('table', tableModel);

const configModel: KGameConfigOptions = {
    id: 4,
    version: '1.0.0',
    layoutMap: {
        p: {
            displayArea: [0, 0, 540, 960],
            safeArea: [0, 0, 540, 960]
        }
    }
}
registerReducerInitial('gameconfig', Object.assign(configModel, config));

//KSpinReducerOptions
const spinModel = {
    spin: {
        betLevel: new Decimal(1),
        betAmount: new Decimal(10)
    }
} 
registerReducerInitial('spin', spinModel);