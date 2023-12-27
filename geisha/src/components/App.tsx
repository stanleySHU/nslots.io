import { Game } from 'common/components/Game';
import { SceneManager } from 'common/components/sceneManager';
import { _LoadScene } from './scenes/loadScene';
import { PreloadScene } from './scenes/preloadScene';
import { MainScene } from './scenes/mainScene';

import { Menu } from 'common/components2/menu';
import { ScenePreloadLoading } from 'common/components2/loading';
import { BgmSounds } from './widgets/sound';
import { Layer } from 'common/components/layer';
import { HistoryList } from 'common/components2/history/list'
import { ErrorPage } from 'common/components2/errorPage';
import { HistoryDetail } from './widgets2/detail';
import { PreMainScene } from './scenes/preMainScene';
import { Rule } from './widgets2/rule';
import { SpinServiceFC } from 'common/services/spinService';
import { LocalMemo } from 'common/services/localStorage';
import { LoginServiceFC, HttpLineBets } from 'common/services/loginService';
import { FPS } from 'common/components/fps';
import { Debug } from 'common/components/debug';

export const App = () => {
    return <Game id="game-canvas" className='game-context-mod' maxResolution={1.3}>
        <Layer>
            <SceneManager>
                <PreloadScene id="preload" next='load'></PreloadScene>
                <_LoadScene id='load' next='premain'></_LoadScene>
                <PreMainScene id='premain'></PreMainScene>
                <MainScene id="main"></MainScene>
            </SceneManager>
            <Debug>
                <FPS l-x={340} l-y={136} p-x={340} p-y={250}></FPS>
            </Debug>
        </Layer>
        <ScenePreloadLoading />
        <Menu></Menu>
        <Rule></Rule>
        <HistoryList></HistoryList>
        <HistoryDetail></HistoryDetail>
        <ErrorPage />
        <BgmSounds></BgmSounds>
        <SpinServiceFC></SpinServiceFC>
        <LoginServiceFC>
            <HttpLineBets></HttpLineBets>
        </LoginServiceFC>
        <LocalMemo></LocalMemo>
    </Game>
}