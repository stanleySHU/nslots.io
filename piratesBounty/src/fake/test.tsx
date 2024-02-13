import { GameContext } from "common/AppContext";
import { getApiService } from "common/other/register"
import { useContext, useEffect, useRef } from "react";

export function Test() {
    const api = getApiService();
    let start: any, spin: any, continue1: any, load: any;

    
    // const { current } = useRef<{arr: any[]}>({arr: []})
    // console.error('error result', current.arr);

    
    function t(res: any) {
        if (res.result) {
            if (res.result.status == 1) {
                continue1();
            } else if (res.result.status == 2 || res.result.status == 3) {
                start();
            } else {
               setTimeout(() => {
                spin();
               }, 100)   
            }
        }
    }

    load = () => {
        api.load().then((res) => {
            // t(res);
        });
    }

    spin = () => {
        api.spin(1).then((res) => {
            if (res.code) {
                load();
            } else {
                t(res);
            }
        });
    }

    start = () => {
        api.start(1).then((res) => {
            spin();
        });
    }

    continue1 = () => {
        api.continue().then((res) => {
            spin();
        });
    }

    useEffect(() => {
        start();
    }, []);

    return <></>
}