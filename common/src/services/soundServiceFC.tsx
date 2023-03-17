import { useContext, useEffect } from "react"
import { GameContext } from "../AppContext"
import { SoundService } from "./soundService";

export const SoundServiceFC = () => {
    const {state} = useContext(GameContext);
    const {soundOn, volume} = state.setting;

    useEffect(() => {
        SoundService.Obj.muted = !soundOn;
    }, [soundOn]);

    useEffect(() => {

    }, [volume]);

    

    return <></>
}

