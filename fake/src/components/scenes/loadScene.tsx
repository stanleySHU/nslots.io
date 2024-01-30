import { SlotContext } from 'common/model/context';
import { Scene } from 'common/components/scene';
import { useEffect } from 'react';

export const _LoadScene = ({ ...props }) => {
    const slotContext = SlotContext.Obj;
    const { lang } = slotContext.urlOptions;

    useEffect(() => {
        window.oncontextmenu=function(e){
            
          };
    }, [])

    return (
        <Scene></Scene>
    )
}