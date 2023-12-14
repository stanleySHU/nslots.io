import { FakeLogicBase } from '../../../common/src/services/fake/fakeLogicBase';

export class FakeLogic extends FakeLogicBase {
    private indexOfSpin: number = 0;

    resolve(url: string) {
        let res = null;
        if (/^(\/s\/start)/.test(url)) {
            res = this.data['start'];
        } else if (/^(\/s\/spin)/.test(url)) {
            const spins = this.data['spin'];
            res = spins[this.indexOfSpin++ % spins.length];
        } else if (/^(\/s\/cont)/.test(url)) {
            res = this.data['cont'];
        } else if (/^(\/s\/load)/.test(url)) {
            res = this.data['load'];
        } else if (/^(\/s\/lineBets)/.test(url)) {
            res = this.data['lineBets'];
        }
        return  res;
    }
}