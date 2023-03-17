import { useContext } from "react";
import { GameContext } from "../AppContext";

export const SceneManager = ({children}) => {
    const { state } = useContext(GameContext);
    const { scenes } = state.sceneManager;
    return children.map((item) => {
        if (scenes.indexOf(item.props.id)!=-1) {
            return item;
        }
    })
} 
