import { ACTION_SCENE_PUSH, ACTION_SCENE_POP, ACTION_SCENE_REPLACE, ACTION_SCENE_TO_ROOT, KReducerActionOptions } from './actionTypes';

export interface KReducerSceneManagerOptions {
    sceneManager: {
        scenes: string[]
    }
}

export const sceneManager = (state: any = {}, action: KReducerActionOptions) => {
    let scenes = [].concat(state.scenes);
    switch (action.type) {
        case ACTION_SCENE_PUSH: 
            scenes.push(action.value);
            return {
                ...state,
                scenes: scenes
            }
        case ACTION_SCENE_POP:
            scenes.pop();
            return {
                ...state,
                scenes: scenes
            }
        case ACTION_SCENE_REPLACE: 
            scenes.pop();
            scenes.push(action.value);
            return {
                ...state,
                scenes: scenes
            }
        case ACTION_SCENE_TO_ROOT:
            return {
                ...state
            }
        default:
            return state
    }
}

export const sceneManagerInitialState: KReducerSceneManagerOptions = {
    sceneManager: {
        scenes: ['preload']
    }
}