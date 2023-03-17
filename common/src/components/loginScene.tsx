import { Container, Sprite, Text } from '@pixi/react';
import { TextStyle, Text as pixiText } from 'pixi.js';
import { useRef } from 'react';
import { R_Loading_Bg } from '../assets';
import { getImg } from '../util/assetsLoad';
import { KLoadSceneOptions, LoadScene } from './loadScene';

export const LoginScene = ({children, ...props}: KLoadSceneOptions) => {
    const loadingTextRef = useRef<pixiText>(null);

    function onProgress(e) {
        loadingTextRef.current.text = `${e}%`;
    }

    function onComplete() {

    }

    return <LoadScene onProgress={onProgress} /*onComplete={onComplete}*/ {...props} >
            {
                children ? 
                children : 
                <Container>
                    <Sprite texture={getImg(R_Loading_Bg)}/>
                    <Text text="loading" x={480} y={200} ref={loadingTextRef} style={new TextStyle({
                        align: 'center',
                        fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                        fontSize: 50,
                        fontWeight: '400',
                        fill: ['#ffffff', '#00ff99'], // gradient
                        stroke: '#01d27e',
                        strokeThickness: 5,
                        letterSpacing: 20,
                        dropShadow: true,
                        dropShadowColor: '#ccced2',
                        dropShadowBlur: 4,
                        dropShadowAngle: Math.PI / 6,
                        dropShadowDistance: 6,
                        wordWrap: true,
                        wordWrapWidth: 440,
                    })}/>
                </Container>
            }
        </LoadScene>
}