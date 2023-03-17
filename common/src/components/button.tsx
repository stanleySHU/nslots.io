import { useEffect, useState } from 'react';
import { Layer, KComponentOptions } from './layer';

export interface KButtonOptions extends KComponentOptions {
    enable?: boolean
}

export function Button({children, enable = true ,...props}: KButtonOptions) {
    return (
        <Layer cursor='pointer' interactive={enable} {...props}>
            {children}
        </Layer>
    )
}