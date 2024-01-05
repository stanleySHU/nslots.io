import { LoadScene } from 'common/components/loadScene';
import { useMemo } from 'react';
import { getPreloadAssetsConfig } from '../../assets';
import { SlotContext } from 'common/model/context';


export const PreloadScene = ({...props}) => {    
    const assets = useMemo(() => {
        return getPreloadAssetsConfig(SlotContext.Obj.urlOptions.lang);
    }, [])

    return <LoadScene assets={assets} {...props}/>
}