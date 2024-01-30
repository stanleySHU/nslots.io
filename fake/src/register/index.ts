import './components';
import './model';

import { registerApiService, registerHttpParser } from 'common/other/register';
import { ApiService } from 'common/util/api';
import { SpinModel } from 'common/util/parser/spin/queenBee';

registerApiService(ApiService);
registerHttpParser('spin', SpinModel);
