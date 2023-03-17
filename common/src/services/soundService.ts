import { isBlank, isPresent, isEmptyObject } from "../util/lang";
import { Howler, Howl } from 'howler';
import { getJson } from "../util/assetsLoad";

type Playback = {
    channelId: string;
    name: string;
    soundId: number;
    volume?: number;
}

class ChannelManager {
    channels: { [channelId: string]: { [soundName: string]: Playback } } = {};

    exist(channelId: string, soundName: string) {
        let playbackMap = this.channels[channelId];
        return isPresent(channelId) && isPresent(playbackMap[soundName]);
    }

    add(channelId: string, soundName: string, soundId: number, volume = 1) {
        let playbackMap = this.channels[channelId];
        if (isBlank(playbackMap)) {
            playbackMap = {};
            this.channels[channelId] = playbackMap;
        }
        if (isPresent(playbackMap[soundName])) {
            console.warn(`sound "${soundName}" is existing in channel "${channelId}"`);
        }
        let playback = {
            channelId: channelId,
            name: soundName,
            soundId: soundId,
            volume: volume
        };
        playbackMap[soundName] = playback;
        return playback;
    }

    getPlaybackBy(predicate: (playback: Playback) => boolean): Playback {
        for (let channelKey in this.channels) {
            let playbackMap = this.channels[channelKey];
            for (let playbackKey in playbackMap) {
                if (predicate(playbackMap[playbackKey])) {
                    return playbackMap[playbackKey];
                }
            }
        }
    }

    getPlaybackBySoundId(e: number): Playback {
        return this.getPlaybackBy(playback => playback.soundId == e);
    }

    getPlaybackBySoundName(e: string): Playback {
        return this.getPlaybackBy(playback => playback.name == e);
    }

    removeBy(predicate: (playback: Playback) => boolean) {
        for (let channelKey in this.channels) {
            let playbackMap = this.channels[channelKey];
            for (let playbackKey in playbackMap) {
                let playback = playbackMap[playbackKey];
                if (predicate(playback)) {
                    delete playbackMap[playbackKey];
                    if (isEmptyObject(playbackMap)) {
                        delete this.channels[channelKey];
                    }
                }
            }
        }
    }

    removeBySoundId(e: number) {
        return this.removeBy(playback => playback.soundId == e);
    }

    removeBySoundName(e: string) {
        return this.removeBy(playback => playback.name == e);
    }
}

export class SoundService {
    private howlers: { [channelId: string]: Howl } = {};
    private _muted: boolean = false;
    private _volume: number = 1;
    private bgm: { channelId: string, name: string };
    private channelManager: ChannelManager;

    private static _Obj: SoundService;
    static get Obj(): SoundService {
        if (!this._Obj) {
            this._Obj = new SoundService();
        }
        return this._Obj;
    }
    constructor() {
        this.channelManager = new ChannelManager();
    }

    startup() {
        this.muted = this._muted;
        this.volume = this._volume;
    }

    getSoundIdBySoundName(name: string) {
        let playback = this.channelManager.getPlaybackBySoundName(name);
        if (playback) return playback.soundId;
    }

    getChannelIdBySoundName(name: string) {
        let playback = this.channelManager.getPlaybackBySoundName(name);
        if (playback) return playback.channelId;
    }

    play(channelId: string, soundName: string, volume = 1):Playback
    {
        let playback = this.channelManager.getPlaybackBySoundName(soundName);
        if (playback && playback.channelId == channelId) {
            this.getSoundPlayer(playback.channelId).play(playback.soundId);
        } else {
            let howl = this.getSoundPlayer(channelId);
            let mute = howl.mute(); //play sound then volume = 0 
            howl.mute(true);
            let soundId = howl.play(soundName);
            howl.volume(volume, soundId);
            if (!mute) {
                howl.mute(false);
            }
            playback = this.channelManager.add(channelId, soundName, soundId, volume);
        }
        return playback;
    }

    playBgm(channelId: string, soundName: string, volume = 1) {
        if (this.bgm) this.stop(this.bgm.channelId, this.bgm.name);
        let howl = this.getSoundPlayer(channelId);
        let soundId = howl.play(soundName);
        howl.volume(volume, soundId);
        this.channelManager.add(channelId, soundName, soundId, volume);
        this.bgm = {
            channelId: channelId,
            name: soundName
        };
    }

    private isReady(channelId: string): boolean {
        return isPresent(this.howlers[channelId]);
    }

    private getSoundPlayer(channelId: string): Howl {
        if (!this.isReady(channelId)) {
            let options = getJson(channelId);
            if (isPresent(options)) {
                options.onend = (soundId: number) => {
                    if (channelId == this.bgm.channelId) {
                        this.restartBgm(this.bgm.name);
                    } else {
                        this.channelManager.removeBySoundId(soundId);
                    }
                }
                let howl = new Howl(options);
                this.howlers[channelId] = howl;
            }
        }
        return this.howlers[channelId];
    }

    resume() {
        for (let channelId in this.channelManager.channels) {
            let playbackMap = this.channelManager.channels[channelId];
            for (let soundName in playbackMap) {
                this.getSoundPlayer(channelId).play(playbackMap[soundName].channelId);
            }
        }
    }

    pause(channelId: string, soundName: string) {
        let soundId = this.getSoundIdBySoundName(soundName);
        soundId && this.getSoundPlayer(channelId).pause(soundId);
    }

    pauseBgm(soundName: string = "bgm") { //"bgm"
        let playback = this.channelManager.getPlaybackBySoundName(soundName);
        playback && this.getSoundPlayer(playback.channelId).pause(playback.soundId);
    }

    restartBgm(soundName: string = "bgm") {
        let playback = this.channelManager.getPlaybackBySoundName(soundName);
        playback && this.getSoundPlayer(playback.channelId).play(playback.channelId);
    }

    stop(channelId: string, soundName: string) {
        let soundId = this.getSoundIdBySoundName(soundName);
        if (soundId) {
            this.channelManager.removeBySoundId(soundId);
            this.getSoundPlayer(channelId).stop(soundId);
        }
    }

    setVolume(channelId: string, soundName: string, volume:number) {
        let soundId = this.getSoundIdBySoundName(soundName);
        if (soundId) {
            this.getSoundPlayer(channelId).volume(volume, soundId);
        }
    }

    setBgVolume(volume: number) {
        if (this.bgm) {
            let soundId = this.getSoundIdBySoundName(this.bgm.name);
            soundId && this.getSoundPlayer(this.bgm.channelId).volume(volume, soundId);
        }
    }

    get volume(): number {
        return this._volume;
    }

    set volume(e: number) {
        this._volume = this.volume;
        if (!this._muted) Howler.volume(e);
    }

    get muted(): boolean {
        return this._muted;
    }

    set muted(e: boolean) {
        this._muted = e;
        Howler.mute(e);
    }
}