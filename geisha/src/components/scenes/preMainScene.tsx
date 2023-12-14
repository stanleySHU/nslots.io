import { DispatchHoc } from "common/components/dispatchhoc"
import { Layer } from "common/components/layer"
import { KSceneOptions, Scene } from "common/components/scene"
import { SpriteAtlas, SpriteAtlasLang, SpriteImg } from "common/components/sprite"
import { action_sceneReplace } from "common/model/sceneManager";
import { KeyPress } from "common/services/keyboardService"
import { Button, SButton, SPressButton } from "common/components/button"
import { useMenoConstant } from "common/components/customhook"
import { R_Preview_Bg_L } from "@/assets";
import { Spine_CannonCount } from "../widgets/base";

export const PreMainScene = DispatchHoc<KSceneOptions>(({ dispatch, ...props }) => {
    function onContinue() {
        dispatch(action_sceneReplace('main'));
    }

    return (
        <Scene {...props}>
            <Layer>
                <KeyPress onKeySpace={onContinue} enable={true}></KeyPress>
                <SpriteImg name={R_Preview_Bg_L} />
                <SpriteAtlasLang l-x={676} l-y={480} p-x={580} p-y={280} anchor={0.5} scale={0.75} name={'logo.png'}/>
                <SPressButton l-x={604} l-y={761} p-x={581} p-y={940} onpointerup={onContinue}>
                    <SpriteImg name={'continueButton.png'} anchor={0.5}/>
                    <SpriteAtlasLang anchor={0.5}  name={'continue.png'}/>
                </SPressButton>
                <Spine_CannonCount l-x={370} l-y={790} p-x={630} p-y={800} playing={true} scale={0.4} action={useMenoConstant([0, 'GEISHA_IDLE', true])} timeScale={1}></Spine_CannonCount>
            </Layer>
        </Scene>
    )
})

