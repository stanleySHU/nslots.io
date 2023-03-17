import { Sprite } from "@pixi/react";
import { useContext } from "react";
import { GameContext } from "../../AppContext";
import { R_Icons } from "../../assets";
import { ACTION_MENU_OPEN } from "../../model/actionTypes";
import { getAtlas } from "../../util/assetsLoad";
import { Button, KButtonOptions} from "../button";

export function MenuButton(props: KButtonOptions) {
    const {state, dispatch} = useContext(GameContext)
    const {menuOn} = state.setting;

    function handle() {
        dispatch({type: ACTION_MENU_OPEN, value: !menuOn})
    }

    return (
        <Button pointerup={handle} hitFrame={[-4,-4,50,50]} x={50} y={400} {...props}>
            <Sprite texture={getAtlas(R_Icons, menuOn ? 'menu-off.png' : 'menu-on.png')}></Sprite>
        </Button>
    )
}