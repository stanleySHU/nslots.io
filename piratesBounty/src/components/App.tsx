import { Game } from 'common/components/Game';
import { SceneManager } from 'common/components/sceneManager';
import { _LoadScene } from './scenes/loadScene';
import { PreloadScene } from './scenes/preloadScene';
import { MainScene } from './scenes/mainScene';
import { PreMainScene } from './scenes/preMainScene';
// import { InfoPageScene } from 'common/components/infoPage/type_1';

import { Menu } from 'common/components2/menu';
import { Paytable } from 'common/components2/paytable';
import { AutoSpin } from 'common/components2/autoSpin';
import { SceneLoginLoading } from 'common/components2/loading';
import { ErrorPage } from 'common/components2/errorPage';
import { Layer } from 'common/components/layer';
import { BgmSounds } from './widgets/sound';
import { useState } from 'react';
import { HistoryList } from './widgets2/list';
import { HistoryDetail } from './widgets2/detail';
import { SpinServiceFC } from 'common/services/spinService';
import { LoginServiceFC, HttpLoaded  } from 'common/services/loginService';
import { FPS } from 'common/components/fps';
import { Debug } from 'common/components/debug';
import { TimeWithVersion } from 'common/components/time_version';
import { KCurrentGameStatus, KGameStatus, KGameStep } from './status/type';
import { LocalMemo } from 'common/services/localStorage';

export const App = () => {
    return (
        <Game id="game-canvas" className='game-context-mod' maxResolution={1}>
            <Layer>
                <SceneManager>
                    <PreloadScene id="preload" next='load'></PreloadScene>
                    <_LoadScene id='load' next='premain'></_LoadScene>
                    <PreMainScene id='premain'></PreMainScene>
                    <MainScene id="main"></MainScene>
                </SceneManager>
                <Debug>
                    <FPS x={0} y={38}></FPS>
                </Debug>
                <TimeWithVersion></TimeWithVersion>
            </Layer>
            {/* <SceneLoginLoading /> */}
            {/* <TabBar themeColor={'#F58FBF'} /> */}
            {/* <MenuButton></MenuButton> */}
            <Menu style={{ bottom: 0 }} />
            <Paytable count={3} />
            <AutoSpin themeColor={'#F58FBF'} />
            <HistoryList></HistoryList>
            <HistoryDetail></HistoryDetail>
            <ErrorPage />
            <BgmSounds></BgmSounds>
            <SpinServiceFC></SpinServiceFC>
            <LoginServiceFC>
                <HttpLoaded></HttpLoaded>
            </LoginServiceFC>
            <LocalMemo></LocalMemo>
        </Game>
    )
}