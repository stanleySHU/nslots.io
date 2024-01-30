import { Game } from 'common/components/Game';
import { SceneManager } from 'common/components/sceneManager';
import { PreloadScene } from './scenes/preloadScene';
import { _LoadScene } from './scenes/loadScene';
// import { InfoPageScene } from 'common/components/infoPage/type_1';

import { Layer } from 'common/components/layer';
import { TabbarPage } from '@/widget/tabbarPage';

export const App = () => {
    return <Game id="game-canvas" className='game-context-mod'>
        <Layer>
            <SceneManager>
                <PreloadScene id="preload" next={'load'}></PreloadScene>
                <_LoadScene id="load"></_LoadScene>
            </SceneManager>
        </Layer>
        <TabbarPage></TabbarPage>
    </Game>
}