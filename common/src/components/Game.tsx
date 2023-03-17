import { Stage, useTick } from "@pixi/react";
import { update as tweenUpdate } from '@tweenjs/tween.js'
import { Children, ComponentProps, useReducer } from "react";
import { GameContext } from "../AppContext";
import { getCombineReducers, getInitState } from '../model';

import { HttpServiceFC } from '../services/httpService';
import { KeyboardServiceFC } from '../services/keyboardService';
import { LayoutServiceFC } from '../services/layoutService';
import { SoundServiceFC } from '../services/soundServiceFC';

interface KGameOptions extends ComponentProps<typeof Stage>{
    children: any,
}

const ContextBridge = ({ children, Context, render }) => {
    return (
        <Context.Consumer>
            {value => {
                return render(<Context.Provider value={value}>{children}</Context.Provider>)
            }}
        </Context.Consumer>
    )
}

const reducers = getCombineReducers();
const initState: any = getInitState();

export const Game = (({children, ...props}: KGameOptions) => {
    const [state, dispatch] = useReducer(reducers, initState);
    if (!Array.isArray(children)) {
        children = [children]
    }
    let [gamechild, ...child] = Children.map(children, e => e);
    return (
        <GameContext.Provider value={{state: state, dispatch: dispatch}}>
            <ContextBridge Context={GameContext} 
                            render={children => <Stage {...props}>
                                                    <Gameconfig></Gameconfig> 
                                                    <LayoutServiceFC></LayoutServiceFC>
                                                    {children}
                                                </Stage>
                                    }>{gamechild}</ContextBridge>
            {child}
            <HttpServiceFC></HttpServiceFC>
            <KeyboardServiceFC></KeyboardServiceFC>
            <SoundServiceFC></SoundServiceFC>
        </GameContext.Provider>
    )
});


export function Gameconfig() {
    useTick((delta) => {
        tweenUpdate();
    }, true);
    return <></>;
}
