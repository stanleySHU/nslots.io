import { useEffect, useState } from "react"

export function KeyboardServiceFC() {
    const [keys, setKeys] = useState<string[]>([]);

    function keyDownHandler(event: KeyboardEvent) {
        if (event && event.key) {
            let key = event.key.toLowerCase();
            if (keys.indexOf(key) == -1) {
                keys.push(key);
                setKeys(keys);
            }
        }
    }

    function keyUpHandler(event: KeyboardEvent) {
        if (event && event.key) {
            let key = event.key.toLowerCase();
            let index = keys.indexOf(key);
            index > -1 && keys.splice(index, 1);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);
    }, []);

    return <></>
}