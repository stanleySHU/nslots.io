export function mapWith<T = any>(number: number, cb: (i) => T) {
    let res = [];
    for (let i = 0; i < number; i++) {
        res.push(cb(i));
    }
    return res;
}