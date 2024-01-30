import { useEffect, useRef, useState } from "react";
import { DataPage } from "./dataPage";
import './tabbarPage.scss'

export function TabbarPage() {
    const frame = useRef<HTMLIFrameElement>(null);
    const [ selected, setSelected ] = useState(0);

    function onLoad() {
        try {
            const doc = frame.current?.contentWindow?.document;
            const els = doc?.getElementsByTagName('a');
            const length = els?.length || 0;
            for (let i = 0; i < length; i++) {
                const el = els?.item(i);
                if (el?.getAttribute('href')?.startsWith('http')) {
                    el.setAttribute('target', '_blank');
                }
            }
        } catch(err) {
            console.error('cant open link in a new window when click')
        }
    }

    return <div className={`page-mod tabbar-mod`}>
        <div className="tabbar-head-mod">
            {
                ['fake', 'document'].map((item, index) => {
                    return <div key={`asdasd${index}`} className="dib btn-mod text" onClick={setSelected.bind(null, index)}>{item}</div>
                })
            }
        </div>
        <div className="tabbar-context-mod">
            {
                [
                <DataPage></DataPage>,
                <iframe ref={frame} width={'100%'} height={'100%'} src={"https://stanleyshu.github.io/nslots.io/document/index"} onLoad={onLoad}></iframe>
            ][selected]
            }
        </div>
    </div>
}