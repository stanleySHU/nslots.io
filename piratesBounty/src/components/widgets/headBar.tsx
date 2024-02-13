import { Layer } from "common/components/layer";
import { SpriteAtlas } from "common/components/sprite";
import { GameStatusModel } from "../status/type";
import { SButton } from "common/components/button";
import { action_menuOpen } from "common/model/setting";
import { TweenAmountBitmapText } from "common/components/tweenAnimations";
import { R_Font_Gold } from "@/assets";

export function HeadBar({ dataSource }: { dataSource: GameStatusModel }) {
    const { dispatch, state } = dataSource.base!;
    const { autoSpinCount } = state.spin;
    const isAutoSpin = autoSpinCount != 0;

    function onOpenMenu() {
       !isAutoSpin && dispatch(action_menuOpen(true));
    }

    return (
        <Layer>
            <Layer x={15} y={6}>
                <SpriteAtlas name={`header/header_backframe.png`}></SpriteAtlas>
                <SpriteAtlas name={`header/header_frame.png`}></SpriteAtlas>
                <SpriteAtlas x={-5} y={-3} name={`header/header_balanceicon.png`}></SpriteAtlas>
                <TweenAmountBitmapText x={120} y={16} maxScaleLength={180} anchor={[0.5, 0.2]} text={state.user.balance.toNumber()} style={{ fontSize: 50, fontName: R_Font_Gold, letterSpacing: -5 }}></TweenAmountBitmapText>
            </Layer>
            <SButton hitFrame={[-20, -5, 70, 55]} x={505} y={10} click={onOpenMenu}>
                <SpriteAtlas name={`header/header_menu.png`}></SpriteAtlas>
            </SButton>
        </Layer>
    )
}


