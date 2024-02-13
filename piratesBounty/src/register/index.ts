import './components';
import './model';

import { registerApiService, registerHttpParser } from 'common/other/register';
import { ApiService } from 'common/util/api';
import { SpinModel } from 'common/util/parser/spin/piratesBounty';
import { LoadModel } from 'common/util/parser/load/piratesBounty';
import { StartModel } from 'common/util/parser/start/piratesBounty';
import { PlayerModel } from 'common/util/parser/player';
// import { LineBets } from 'common/util/parser/lineBets/piratesBounty';
import { HistoryListModel } from 'common/util/parser/history/piratesBounty';

registerApiService(ApiService);
registerHttpParser('spin', SpinModel);
registerHttpParser('load', LoadModel);
registerHttpParser('start', StartModel);
registerHttpParser('continue', StartModel);
registerHttpParser('player', PlayerModel);
// registerHttpParser('lineBets', LineBets);
registerHttpParser('history', HistoryListModel);