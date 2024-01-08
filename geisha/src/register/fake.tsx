import { registerApiService, registerHttpParser } from 'common/other/register';
import { ApiFakeService } from 'common/util/apiFake';

console.log('FAKE MODEL');
if (import.meta.env.VITE_FAKE) {
    registerApiService(ApiFakeService);
}