import './components';
import './model';

import { registerApiService, registerHttpParser } from 'common/other/register';
import { ApiService } from 'common/util/api';
import { PlayerModel } from 'common/util/parser/player';
import { SpinModel } from 'common/util/parser/spin/queenBee';
import { LineBets } from 'common/util/parser/lineBets/geisha';
import { HistoryListModel } from 'common/util/parser/history/default';

registerApiService(ApiService);
registerHttpParser('spin', SpinModel);
registerHttpParser('player', PlayerModel);
registerHttpParser('history', HistoryListModel);
registerHttpParser('lineBets', LineBets);