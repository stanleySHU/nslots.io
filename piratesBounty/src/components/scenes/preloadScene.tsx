import { LoadScene } from 'common/components/loadScene';
import { useMemo } from 'react';
import { getPreloadAssetsConfig } from '../../assets';
import { SlotContext } from 'common/model/context';

export const PreloadScene = ({...props}) => {    
    const slotContext = SlotContext.Obj;
    const lang = slotContext.urlOptions.lang;

    const assets = useMemo(() => {
        return getPreloadAssetsConfig(lang);
    }, [])

    return <LoadScene assets={assets} {...props}/>
}