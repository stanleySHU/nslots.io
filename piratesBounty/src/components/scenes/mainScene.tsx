import { Layer } from 'common/components/layer';
import { Scene } from 'common/components/scene';
import { GameStatus } from '../status/GameStatus';
import { HandleProps } from 'common/components/component';
import { GameStatusModel, KCurrentGameStatus, KGameStep } from '../status/type'
import { ScreenShake } from '../widgets/tweenAnimations';
import { Sea } from '../widgets/sea';
import { Capital } from '../widgets/capital';
import { Fleet, SheetExplosion } from '../widgets/fleet';
import { JackpotPanel } from '../widgets/jackpotPanel';
import { Boss } from '../widgets/boss';
import { Fog } from '../widgets/fog';
import { Grates, Player } from '../widgets/player';
import { Bullet } from '../widgets/bullet';
import { Gear } from '../widgets/gear';
import { Cannon } from '../widgets/cannon';
import { BattleBar } from '../widgets/battleBar';
import { Spin } from '../widgets/spin';
import { Banner } from '../widgets/banner';
import { Hyper } from '../widgets/hyper';
import { HeadBar } from '../widgets/headBar';
import { PointBar } from '../widgets/pointBar';
import { WinPoints } from '../widgets/winPoints';
import { WinAmount } from '../widgets/winAmount';
import { Warning } from '../widgets/warning';
import { GearStatus } from '../status/gearStatus';
import { CannonStatus } from '../status/cannonStatus';
import { FleetStatus } from '../status/fleetStatus';
import { ButtleStatus } from '../status/bulletStatus';
import { Mascot } from '../widgets/mascot';
import { JackpotStatus } from '../status/jackpotStatus';
import { PointsStatus } from '../status/pointStatus';
import { CaptialStatus } from '../status/captialStatus';
import { Splashs } from '../widgets/splash';
import { WinJackpot } from '../widgets/winJackpot';
import { Spine_Hyper } from '../widgets/base';
import { Hp } from '../widgets/hp';
import { Ann } from '../widgets/ann';
import { BalanceMonitor } from '../widgets/balanceMonitor';
import { GameSounds } from '../widgets/sound';

export const MainScene = ({...props }: {
    id: string,
}) => {
    return (
        <Scene {...props}>
            <GameStatus>
                <CannonStatus>
                    <FleetStatus>
                        <ButtleStatus>
                            <GearStatus>
                                <JackpotStatus>
                                    <PointsStatus>
                                        <CaptialStatus>
                                            <HandleProps>
                                                {
                                                    ({ dataSource }: { dataSource: GameStatusModel }) => {
                                                        return (
                                                            <Layer>
                                                                <ScreenShake dataSource={dataSource}>
                                                                    <Sea dataSource={dataSource}></Sea>
                                                                    <Capital dataSource={dataSource}></Capital>
                                                                    <Fleet dataSource={dataSource}></Fleet>
                                                                    <Splashs dataSource={dataSource}></Splashs>
                                                                    <JackpotPanel dataSource={dataSource}></JackpotPanel>
                                                                    <Boss dataSource={dataSource}></Boss>
                                                                    <Hp dataSource={dataSource}></Hp>
                                                                    <Fog dataSource={dataSource}></Fog>
                                                                    <Player dataSource={dataSource}></Player>
                                                                    <Gear dataSource={dataSource}></Gear>
                                                                    <Bullet dataSource={dataSource}></Bullet>
                                                                    <Cannon dataSource={dataSource}></Cannon>
                                                                    <Grates dataSource={dataSource}></Grates>
                                                                </ScreenShake>
                                                                <BattleBar dataSource={dataSource}></BattleBar>
                                                                <Spin dataSource={dataSource}></Spin>
                                                                {/* <Mascot dataSource={dataSource}></Mascot> */}
                                                                <Banner dataSource={dataSource}></Banner>
                                                                <Ann dataSource={dataSource}></Ann>
                                                                <Hyper dataSource={dataSource}></Hyper>
                                                                <HeadBar dataSource={dataSource}></HeadBar>
                                                                <PointBar dataSource={dataSource}></PointBar>
                                                                <WinPoints dataSource={dataSource}></WinPoints>
                                                                <WinJackpot dataSource={dataSource}></WinJackpot>
                                                                <WinAmount dataSource={dataSource}></WinAmount>
                                                                <Warning dataSource={dataSource}></Warning>
                                                                <BalanceMonitor dataSource={dataSource}></BalanceMonitor>
                                                                <GameSounds dataSource={dataSource}></GameSounds>
                                                                {/* <Spine_Hyper playing={true} x={200} y={400} scale={0.33} action={[0, 'hyper_normal', true]}></Spine_Hyper> */}
                                                            </Layer>
                                                        )
                                                    }
                                                }
                                            </HandleProps>
                                        </CaptialStatus>
                                    </PointsStatus>
                                </JackpotStatus>
                            </GearStatus>
                        </ButtleStatus>
                    </FleetStatus>
                </CannonStatus>
            </GameStatus>
        </Scene>
    )
}

