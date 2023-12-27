import { LoadSceneV2 } from 'common/components/loadScene';
import { SpriteAtlas, SpriteAtlasLang, SpriteImg } from 'common/components/sprite';
import { useMemo } from 'react';
import { getLoadingAssetsConfig, R_Preview_Bg_L } from '../../assets';
import { SlotContext } from 'common/model/context';
import { Label } from 'common/components/text';
import { Layer, Orientation } from 'common/components/layer';
import { R_PreloadComponent } from 'common/assets';
import { MaskLayer } from 'common/components/maskLayer';

export const _LoadScene = ({ ...props }) => {
    const assets = useMemo(() => {
        return getLoadingAssetsConfig(SlotContext.Obj.urlOptions.lang);
    }, [])

    return (
        <LoadSceneV2 assets={assets} {...props}>
            {
                (progress: number, text: string) => {
                    const x = -450 + 450 * (progress / 100);
                    return <Orientation>
                        <SpriteImg name={R_Preview_Bg_L} />
                        <SpriteAtlasLang l-x={550} l-y={580} p-x={580} p-y={280} anchor={0.5} name={'logo.png'} />
                        <Layer l-x={300} l-y={770} p-x={340} p-y={770}>
                            <SpriteAtlas res={R_PreloadComponent} name='LoadConatiner.png'></SpriteAtlas>
                            <MaskLayer x={18} y={4.5}>
                                <SpriteAtlas res={R_PreloadComponent} name='LoadMeter.png'></SpriteAtlas>
                                <SpriteAtlas x={x} res={R_PreloadComponent} name='LoadMetermask.png'></SpriteAtlas>
                            </MaskLayer>
                            <Label x={246} y={15} text={`${text}`} anchor={0.5} style={{
                                align: 'center', fill: '#FFFFFF', fontSize: 20,
                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                            }}></Label>
                        </Layer>
                    </Orientation>
                }
            }
        </LoadSceneV2>
    )
}