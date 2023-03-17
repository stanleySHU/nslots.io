import { Scene } from './scene';
import { loadAssets, KRrsourceOptions } from '../util/assetsLoad';
import { KSceneOptions } from './scene';
import {  ACTION_SCENE_REPLACE } from '../model/actionTypes';
import { useContext } from 'react';
import { GameContext } from '../AppContext';

export interface KLoadSceneOptions extends KSceneOptions {
    assets?: readonly KRrsourceOptions[],
    next?: string,
    onProgress?: (e: number) => void,
    onComplete?: () => void;
};

export const LoadScene = ({children, onProgress, onComplete, ...props}: KLoadSceneOptions) => {
    const { dispatch } = useContext(GameContext);
    loadAssets(props.assets, (e) => {
        onProgress && onProgress(Math.floor(e * 100));
    }).then(onComplete || ((e) => {
        console.log(e)
        if (props.next) {
            dispatch({type: ACTION_SCENE_REPLACE, value: props.next});
        }
    }));
    return <Scene {...props}>
        {children}
    </Scene>
}