import { Layer } from "common/components/layer";
import { GameStatusModel } from "../status/type";
import { SpriteAtlas } from "common/components/sprite";
import { BLEND_MODES } from "pixi.js";
import { Tween } from "common/components/tween";
import { getShipPoint } from "./fleet";
import { Parabola } from "common/util/math";
// import { WinJackpotStar } from "./components";
import { CANNOM_HIT_BOSS_HP_MAP } from "./config";
import { Interpolation } from "@tweenjs/tween.js";
import { ICaptainYScale } from "./capital";


export function WinPoints({dataSource}: {dataSource: GameStatusModel}) {
    const { state, gameStatus } = dataSource.base!;
    const { activeWinShipPoint } = dataSource.points!;

    return (
        <Layer>
            {
                activeWinShipPoint.map((item, index) => {
                    const { point, pt, currentTime, delay } = item;
                    const [startX, startY] = getShipPoint(point.x, point.y);
                    const targetX = 520, offsetX = startX - targetX;
                    const parabola = Parabola.withVertex([Math.random() * 0.1 + 0.4, 0.2]);
                    return (
                        <Tween key={`shipmeter${point.x}${point.y}`} from={{ k: 0 }} to={{ k: 1 }} duration={600} playing={true}>
                            {
                                ({ k }) => {
                                    const x = startX - offsetX * k;
                                    const y = startY + parabola(k) * offsetX;
                                    return <SpriteAtlas blendMode={BLEND_MODES.SCREEN} x={x} y={y} visible={k != 1} scale={0.33} name={'shipmeter_fx.png'} anchor={0.5}></SpriteAtlas>
                                }
                            }
                        </Tween>
                    )
                })
            }
        </Layer>
    )
}
