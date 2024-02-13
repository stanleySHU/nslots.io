import { R_Game_Bg_L, R_Game_Bg_P } from "common/assets"
import { DispatchHoc } from "common/components/dispatchhoc"
import { Layer } from "common/components/layer"
import { KSceneOptions, Scene } from "common/components/scene"
import { SpriteAtlas, SpriteImg } from "common/components/sprite"
import { action_sceneReplace } from "common/model/sceneManager";
import { KeyPress } from "common/services/keyboardService"
import { Spine_SeaBg, Spine_Title_Screen } from "../widgets/base"
import { SButton } from "common/components/button"
import { useMemoConstant } from "common/components/customhook"

export const PreMainScene = DispatchHoc<KSceneOptions>(({ dispatch, ...props }) => {
    function onContinue() {
        dispatch(action_sceneReplace('main'));
    }

    return (
        <Scene {...props}>
            <Layer>
                <KeyPress onKeySpace={onContinue} onKeyEnter={onContinue} enable={true}></KeyPress>
                <Spine_Title_Screen playing={true} action={useMemoConstant([0, 'Idle 2', true])} scale={0.33} x={270} y={500}></Spine_Title_Screen>
                <SButton x={162.5} y={820} click={onContinue}>
                    <SpriteAtlas name={`start_button.png`}/>
                </SButton>
            </Layer>
        </Scene>
    )
})

