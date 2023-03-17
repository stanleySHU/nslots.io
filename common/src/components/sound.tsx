import { useEffect } from 'react';
import { SoundService } from '../services/soundService';

interface KSoundOptions {
    channelId: string,
    name: string,
    volum: number,
    playing: boolean
}

export function Sound({channelId, name, volum, playing = true}: KSoundOptions) {
    useEffect(() => {
        if (playing) {
            SoundService.Obj.play(channelId, name, volum);
        } 
    }, [channelId, name, playing]);

    return <></>
}

export function SoundBgm({channelId, name, volum, playing = true}: KSoundOptions) {
    useEffect(() => {
        if (playing) {
            SoundService.Obj.playBgm(channelId, name, volum);
        } else {
            SoundService.Obj.pauseBgm();
        }
    }, [channelId, name, playing]);

    return <></>
}