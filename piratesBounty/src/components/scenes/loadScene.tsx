import { LoadSceneV2 } from 'common/components/loadScene';
import { SpriteAtlas, SpriteAtlasLang, SpriteImg } from 'common/components/sprite';
import { useContext, useMemo, useState } from 'react';
import { getLoadingAssetsConfig, R_Preview_Bg_L } from '../../assets';
import { SlotContext } from 'common/model/context';
import { useMemoConstant } from 'common/components/customhook';
import { Label } from 'common/components/text';
import { Layer } from 'common/components/layer';
import { R_PreloadComponent } from 'common/assets';
import { MaskLayer } from 'common/components/maskLayer';
import { GameContext } from 'common/AppContext';
import { ProgressBarTweenLayer } from 'common/components/progress'
import { Spine_Title_Screen } from '../widgets/base';

export const _LoadScene = ({ ...props }) => {

    const assets = useMemo(() => {
        return getLoadingAssetsConfig(SlotContext.Obj.urlOptions.lang);
    }, [])

    return (
        <LoadSceneV2 assets={assets} {...props}>
            {
                (progress: number, text: string) => {
                    const x = -450 + 450 * (progress / 100);
                    return <Layer>
                        <Spine_Title_Screen playing={true} action={useMemoConstant([0, 'Ilde 1', true])} scale={0.33} x={270} y={500}></Spine_Title_Screen>
                        <Layer x={27} y={820}>
                            <SpriteAtlas res={R_PreloadComponent} name='LoadContainer.png'></SpriteAtlas>
                            <MaskLayer x={8.5} y={7.5}>
                                <SpriteAtlas res={R_PreloadComponent} name='LoadMeter.png'></SpriteAtlas>
                                <SpriteAtlas x={x} res={R_PreloadComponent} name='LoadMetermask.png'></SpriteAtlas>
                            </MaskLayer>
                            <Label x={246} y={20} text={`${text}`} anchor={0.5} style={{
                                align: 'center', fill: '#FFFFFF', fontSize: 20,
                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                            }}></Label>
                        </Layer>
                    </Layer>
                }
            }
        </LoadSceneV2>
    )
}