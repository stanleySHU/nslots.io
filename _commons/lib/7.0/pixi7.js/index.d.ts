
declare namespace PIXI {
    type Container = import("pixi.js").Container;
    type Graphics = import("pixi.js").Graphics;
    type Sprite = import("pixi.js").Sprite;
    type Texture = import("pixi.js").Texture;
    type Ticker = import("pixi.js").Ticker;
    type Rectangle = import("pixi.js").Rectangle;
    type Point = import("pixi.js").Point;
    type Text = import("pixi.js").Text;
    type BitmapText = import("pixi.js").BitmapText;
    type AnimatedSprite = import("pixi.js").AnimatedSprite;
    type ParticleContainer = import("pixi.js").ParticleContainer;
    type BaseTexture = import("pixi.js").BaseTexture;
    type TilingSprite = import("pixi.js").TilingSprite;
    type DisplayObject = import("pixi.js").DisplayObject;
    type Renderer = import("pixi.js").Renderer;
    type Application = import("pixi.js").Application;
    type ColorMatrixFilter = import("pixi.js").ColorMatrixFilter;
    type AssetsClass = import("pixi.js").AssetsClass;
    type Spritesheet = import("pixi.js").Spritesheet;
    type IRenderer = import("pixi.js").IRenderer;
    type LoaderParser = import("pixi.js").LoaderParser;
    type ExtensionType = import("pixi.js").ExtensionType;
    type Loader = import("pixi.js").Loader;
    type ResolvedAsset = import("pixi.js").ResolvedAsset;
    type BitmapFont = import("pixi.js").BitmapFont;
    type BitmapFontData = import("pixi.js").BitmapFontData;
    
    namespace spine {
        type Spine = import("pixi-spine").Spine;
        type ISkeletonData = import("pixi-spine").ISkeletonData;
        type ITrackEntry = import("pixi-spine").ITrackEntry;
    }   
    namespace particles {
        type Emitter = import("pixi-particles").Emitter;
        type Particle = import("pixi-particles").Particle;
        type PropertyList<V> = import("pixi-particles").PropertyList<V>;
        type PropertyNode<V> = import("pixi-particles").PropertyNode<V>;
        type AnimatedParticleArt = import("pixi-particles").AnimatedParticleArt;
        type ParsedAnimatedParticleArt = import("pixi-particles").ParsedAnimatedParticleArt;
    }
}

declare const PIXI: typeof import("pixi.js") & {spine: typeof import("pixi-spine")} & {particles: typeof import("pixi-particles")};