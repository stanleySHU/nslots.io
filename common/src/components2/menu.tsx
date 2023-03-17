import { useContext } from 'react';
import { GameContext } from '../AppContext';
import { ACTION_MENU_OPEN, ACTION_PAYTABLE_OPEN, ACTION_SCENE_PUSH, ACTION_SOUND_OPEN } from '../model/actionTypes';
import './menu.scss';

export function Menu() {
    const { state, dispatch } = useContext(GameContext);
    const { menuOn, soundOn } = state.setting;

    function close(e) {
        dispatch({type: ACTION_MENU_OPEN, value: false});
    }

    function onInfo() {
        dispatch({type: ACTION_PAYTABLE_OPEN, value: true});
    }

    function onSound(event) {
        dispatch({type: ACTION_SOUND_OPEN, value: !soundOn});
        event.stopPropagation();
    }

    function onBackLobby() {

    }
    return (
        <div className={`page-mod ${menuOn ? 'visible' : 'hidden'}`} onClick={close}>
            <div className={`menu-mod ${menuOn ? 'open' : 'close'}`}>
                <div className="list">
                    <div className="item w-33 btn-mod" onClick={onInfo}>
                        <div className="icon-mod icon paytable"></div>
                        <div className="title">Paytable</div>
                    </div>
                    <div className="item w-33 btn-mod" onClick={onSound}>
                        <div className={`icon-mod icon ${soundOn ? 'sound-on' : 'sound-off'}`}></div>
                        <div className="title">Sound</div>
                    </div>
                    <div className="item w-33 btn-mod" onClick={onBackLobby}>
                        <div className="icon-mod icon lobby"></div>
                        <div className="title">Lobby</div>
                    </div>
                </div>
            </div>
        </div>
    )
}