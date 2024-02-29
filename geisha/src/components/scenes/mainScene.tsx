import { R_Game_Bg_L } from 'common/assets';
import { KSceneOptions, Scene } from 'common/components/scene';
import { SpriteAtlasLang, SpriteImg } from 'common/components/sprite';
import { WinAmountLabel } from '../widgets/winAmount';
import { GameStatus } from '../status/gameStatus';
import { SlotContext } from 'common/model/context';
import { GameSounds } from '../widgets/sound';
import { Reel } from '../widgets/reelsController';
import { useMemoConstant } from 'common/components/customhook';
import { R_Preview_Bg_L } from '@/assets';
import { Spine_All} from '../widgets/base';
import { SpinButton } from '../widgets/spin';
import { WinLineStatus } from '../status/winLineStatus';
import { HandleProps } from 'common/components/component';
import { GameStatusModel } from '../status/type';
import { BigWin } from '../widgets/bigWin';
import { FiveOfAKind } from '../widgets/fiveOfAKind';
import { TipsForSpinAndBet, BalanceMonitor } from '../widgets/components';
import { TabBar } from '../widgets/tabbar';
import { Rectangle } from 'common/components/rectangle';

export const MainScene = ({ ...props }: KSceneOptions) => {
    const slotContext = SlotContext.Obj;

    return (
        <GameStatus>
            <WinLineStatus>
                <HandleProps>
                    {
                         ({ dataSource }: { dataSource: GameStatusModel }) => {
                            return (<Scene {...props}>
                                <SpriteImg name={R_Preview_Bg_L} />
                                <SpriteImg name={R_Game_Bg_L} x={147.5} y={222}/>
                                <Spine_All x={233} y={774} l-playing={true} p-playing={false} l-visible={true} p-visible={false} scale={0.5} action={useMemoConstant([0, 'GEISHA_IDLE', true])} timeScale={1}></Spine_All>
                                <SpriteAtlasLang x={580} l-y={335} p-y={325} anchor={0.5} scale={0.8} name={'logo.png'}></SpriteAtlasLang>
                                <Reel dataSource={dataSource} x={374} y={448}></Reel>
                                <TipsForSpinAndBet dataSource={dataSource} x={585} y={750}></TipsForSpinAndBet>
                                <SpinButton dataSource={dataSource} scale={1} l-x={1000} l-y={710} l-visible={true} p-visible={false} l-enable={true} p-enable={false}></SpinButton>
                                <TabBar dataSource={dataSource}></TabBar>
                                <WinAmountLabel x={480} y={410} pivot={[240, 0]} dataSource={dataSource}></WinAmountLabel>
                                <FiveOfAKind dataSource={dataSource}></FiveOfAKind>
                                <BigWin dataSource={dataSource}></BigWin>
                                <GameSounds dataSource={dataSource}></GameSounds>
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