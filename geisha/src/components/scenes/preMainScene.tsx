import { DispatchHoc } from "common/components/dispatchhoc"
import { Layer } from "common/components/layer"
import { KSceneOptions, Scene } from "common/components/scene"
import { SpriteAtlasLang, SpriteImg } from "common/components/sprite"
import { action_sceneReplace } from "common/model/sceneManager";
import { KeyPress } from "common/services/keyboardService"
import { SPressButton } from "common/components/button"
import { useMemoConstant } from "common/components/customhook"
import { R_Preview_Bg_L } from "@/assets";
import { Spine_All } from "../widgets/base";
import { Demo } from "../widgets/demo";

export const PreMainScene = DispatchHoc<KSceneOptions>(({ dispatch, ...props }) => {
    function onContinue() {
        dispatch(action_sceneReplace('main'));
    }

    return (
        <Scene {...props}>
            <Layer>
                <KeyPress onKeySpace={onContinue} onKeyEnter={onContinue} enable={true}></KeyPress>
                <SpriteImg name={R_Preview_Bg_L} />
                <Demo l-x={430} l-y={415} l-scale={1} p-x={470} p-y={450} p-scale={0.9}></Demo>
                <SpriteAtlasLang l-x={660} l-y={380} p-x={580} p-y={280} anchor={0.5} name={'logo.png'}/>
                <SPressButton l-x={574} l-y={841} p-x={581} p-y={940} onpointerup={onContinue}>
                    <SpriteImg name={'continueButton.png'} anchor={0.5}/>
                    <SpriteAtlasLang anchor={0.5} y={-1.5} name={'continue.png'}/>
                </SPressButton>
                <Spine_All l-x={370} l-y={790} p-x={410} p-y={800} playing={true} scale={0.4} action={useMemoConstant([0, 'GEISHA_IDLE', true])} timeScale={1}></Spine_All>
            </Layer>
        </Scene>
    )
})

