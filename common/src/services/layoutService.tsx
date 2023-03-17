import { useApp } from "@pixi/react";
import { useEffect } from "react"

const htmlEl = document.querySelector('html');
export const LayoutServiceFC = () => {    
    const app = useApp();

    function resize() {
        let innerWidth = window.innerWidth,
            innerHeight = window.innerHeight,
            appWidth = app.renderer.width,
            appHeight = app.renderer.height;
        if (innerWidth !== appWidth && innerHeight !== appHeight) {
            const appEl = document.getElementById('App');
            let width, height, left = 0, top = 0;
            if (innerHeight/innerWidth <= 540/960) {
                let scale = innerHeight/540;
                htmlEl.style.fontSize = `${20 * scale}px`;
                app.stage.scale.set(scale);
                width = innerHeight/(540/960);
                height = innerHeight;
                left = (innerWidth - width) / 2;
            } else {
                let scale = innerWidth/960;
                htmlEl.style.fontSize = `${20 * scale}px`;
                app.stage.scale.set(scale);
                width = window.innerWidth;
                height = 540/960*window.innerWidth;
                top = (innerHeight - height) / 2;
            }
            app.renderer.resize(width, height);
            appEl.style.width = `${width}px`;
            appEl.style.height = `${height}px`;
            appEl.style.top = `${top}px`;
            appEl.style.left = `${left}px`;  
        }
    }

    useEffect(() => {
          window.onresize = resize;
          resize();
    }, []);

    return <></>
}
