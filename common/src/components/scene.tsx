import { Layer, KComponentOptions } from "./layer";

export interface KSceneOptions extends KComponentOptions {
    id: string;
} ;

export const Scene = ({children, ...props}: KSceneOptions) => {
    return <Layer {...props}>
        {children}
    </Layer>
};