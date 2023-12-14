import { R_Components, R_Game_Bg_L } from 'common/assets';
import { Layer } from 'common/components/layer';
import { MenuButton } from 'common/components3/menubutton'
import { KSceneOptions, Scene } from 'common/components/scene';
import { SpriteAtlas, SpriteAtlasLang, SpriteImg } from 'common/components/sprite';
import { Sound, } from 'common/components/sound';
import { WinAmountLabel } from '../widgets/winAmount';
import { Symbol } from '../widgets/symbol';
import { GameStatus } from '../status/gameStatus';
import { SlotContext } from 'common/model/context';
import { GameSounds } from '../widgets/sound';
import { AutoSpinMonitorV1 } from 'common/components/autoSpinMonitor';
import { Reel, ReelsController } from '../widgets/reelsController';
import { ReelController } from 'common/components/spinTween/default';
import { useMenoConstant } from 'common/components/customhook';
import { mapWith } from 'common/util/array';
import { Easing } from '@tweenjs/tween.js';
import { R_Preview_Bg_L } from '@/assets';
import { Spine_CannonCount, Spine_Number } from '../widgets/base';
import { Spin, SpinButton } from '../widgets/spin';
import { WinLineStatus } from '../status/winLineStatus';
import { HandleProps } from 'common/components/component';
import { GameStatusModel } from '../status/type';
import { BigWin } from '../widgets/bigWin';
import { FiveOfAKind } from '../widgets/fiveOfAKind';
import { TipsForSpinAndBet } from '../widgets/components';
import { BalanceMonitor } from '../actions/balanceMonitor';
import { TabBar } from '../widgets/tabbar';
import { LineTexture } from 'common/components/line';
import { WinlinePanel } from '../widgets/winlinePanel';

export const MainScene = ({ ...props }: KSceneOptions) => {
    const slotContext = SlotContext.Obj;
    const { symbolFrame } = slotContext.tableOptions;

    return (
        <GameStatus>
            <WinLineStatus>
                <HandleProps>
                    {
                         ({ dataSource }: { dataSource: GameStatusModel }) => {
                            return (<Scene {...props}>
                                <SpriteImg name={R_Preview_Bg_L} />
                                <SpriteImg name={R_Game_Bg_L} x={147.5} y={222}/>
                                <Spine_CannonCount x={233} y={774} l-playing={true} p-playing={false} l-visible={true} p-visible={false} scale={0.5} action={useMenoConstant([0, 'GEISHA_IDLE', true])} timeScale={1}></Spine_CannonCount>
                                <SpriteAtlasLang x={580} l-y={325} p-y={325} anchor={0.5} scale={0.5} name={'logo.png'}></SpriteAtlasLang>
                                <Reel dataSource={dataSource} x={374} y={448}></Reel>
                                <WinAmountLabel x={480} y={410} pivot={[240, 0]} dataSource={dataSource}></WinAmountLabel>
                                <TipsForSpinAndBet dataSource={dataSource} x={585} y={750}></TipsForSpinAndBet>
                                <TabBar dataSource={dataSource}></TabBar>
                                <SpinButton dataSource={dataSource} scale={1} l-x={1000} l-y={710} l-visible={true} p-visible={false} l-enable={true} p-enable={false}></SpinButton>
                                <FiveOfAKind dataSource={dataSource}></FiveOfAKind>
                                <BigWin dataSource={dataSource}></BigWin>
                                <GameSounds dataSource={dataSource}></GameSounds>
                                <AutoSpinMonitorV1></AutoSpinMonitorV1>   
                                <BalanceMonitor dataSource={dataSource}></BalanceMonitor>  
                            </Scene>
                            )
                        }
                    }
                </HandleProps>
            </WinLineStatus>
        </GameStatus>
    )
}


// export type I_Spine_All = 'WILD_WIN' | 'WILD_IDLE' | 'SCATTER_WIN' | 'SCATTER_IDLE' | 'LP_Q_WIN' | 'LP_K_WIN' | 'LP_J_WIN' | 'LP_A_WIN' | 'LP_10_WIN' | 
// 'HP_Umbrella_WIN' | 'HP_Slipper_WIN' | 'HP_Mask_WIN' | 'HP_Geisha_IDLE' | 'HP_FAN_WIN' | 'GEISHAPROTRAIT_WIN' | 'GEISHAPROTRAIT_IDLE' | 
// 'BIGWIN_OUT' | 'BIGWIN_IDLE' | 'BIGWIN_ENTER' | '5ofakind_OUT' | '5ofakind_IDLE' | '5ofakind_ENTER';