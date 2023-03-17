import { useContext, useEffect } from "react"
import { GameContext } from "../AppContext";
import { ACTION_SPIN_STOPPING } from "../model/actionTypes";
import { getHttpService, getHttpParser } from '../other/register';

const api = getHttpService();
const TypeSpin = getHttpParser('spin');
export const HttpServiceFC = () => {
    const { state, dispatch } = useContext(GameContext);
    const { status } = state.spin;
    const { loggingIn } = state.user;
    const table = state.game.table;

    useEffect(() => {
        if (status == 'spin') {
            api.spin().then((e) => {
                let model = new TypeSpin(e, table);
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    dispatch({type: ACTION_SPIN_STOPPING, value: model})
                }, 1000);
            });
        }
    }, [status]);
    
    useEffect(() => {
        if (loggingIn) {
            //require login
        }
    }, [loggingIn]);

    return <></>
}