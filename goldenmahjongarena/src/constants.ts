import * as director from "../engine/src/director";

export const INTRO_ASSETS: string[] = ["introAtlas", "winnumber"];

export const INTRO_TIMER: number = 500;
export const WIN_LEVEL_FREQUENCIES: number[] = [0.11, 0.1, 0.09, 0.08, 0];
export const WINLINE_LEVELS: number[] = [0, 6, 17, 26, 38];
export const WINLINE_DURATIONS: number[] = [1, 4, 9, 18, 8.2];
export const WIN_LEVEL_COINS: number[] = [20, 40, 80, 200, 0];
export const SMALLWIN_LEVEL: number = 2;
export const BIGWIN_LEVEL: number = 5;
export const HIGH_LEVEL: number = 4;
export const WIN_AMOUNT_DURATION: number = 990;

export const WIN_MULTIPLER_COUNT_NORMAL = [1, 2, 3, 5];
export const WIN_MULTIPLER_COUNT_FS = [2, 4, 6, 10];
export const WIN_MULTIPLER_COUNT_SFS = [10, 20, 30, 50];

export const CREDIT_DEFAULT: number = 1;
export const CREDIT_FREESPINS: number = 66;
export const CREDIT_SUPER_FREESPINS: number = 328;

export const NORMAL_COLLAPSE = "normalCollapse";
export const WILD_COLLAPSE = "wildCollapse";
export const Wild_Drop = "Wild_Drop";
export const Scatter_Drop = "Scatter_Drop";
export const TRANSFORM_WILD = "TileTurnHorizontal";
export const WILD_TRIGGER = "Wild_Trigger";

export const SYMBOL_WILD = 10;
export const SYMBOL_Scatter = 9;
export const GOLD_SYMBOLS = [11, 12, 13, 14, 15, 16, 17, 18, 19];

export const BGM_MAIN = "bgm-main";
export const BGM_FREE = "bgm-free";
export const SND_SYM_STOP = "sym_stop";
export const SND_WILD_STOP = "wild_stop";
export const SND_SLOTFIRE = "slotfire_scatter";
export const SND_WIN_SCATTER1 = "win_scatter1";
export const SND_WIN_SCATTER2 = "win_scatter2";
export const SND_WIN_SCATTER3 = "win_scatter3";
export const SND_MULTIPLIER1 = "multiplier1";
export const SND_MULTIPLIER2 = "multiplier2";
export const SND_MULTIPLIER3 = "multiplier3";
export const SND_MULTIPLIER4 = "multiplier4";
export const SND_COLLAPSE = "collapse";
export const SND_BTN_BONDS = "button_bonus";
export const SND_FREE_IN = "freespin_in";
export const SND_FREE_SPIN_WIN = "free_spin_win";
export const SND_WINMETER = "winmeter";
export const FROM_LOADING = "fromLoading";

export function coins_textures(): any[] {
  const coins = [];
  for (let i: number = 1; i <= 20; i++) {
    coins.push(getImageResource("coin_" + i));
  }
  return coins;
}

export function sparkle_texture(): any[] {
  return [getImageResource("star_0005"), getImageResource("star_0010")];
}

export function getImageResource(name: string, atlas: string = "spritesAtlas/") {
  return director.resourceManager.resolve("@atlas/" + atlas + name + ".png");
}

export const coins_config = {
  alpha: {
    start: 1,
    end: 1
  },
  scale: {
    start: 1,
    end: 3,
    minimumScaleMultiplier: 1
  },
  color: {
    start: "#e6e6e6",
    end: "#ffffff"
  },
  speed: {
    start: 900,
    end: 200,
    minimumSpeedMultiplier: 1
  },
  acceleration: {
    x: 0,
    y: 2400
  },
  maxSpeed: 0,
  startRotation: {
    min: 230,
    max: 310
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 360
  },
  lifetime: {
    min: 1.2,
    max: 1.2
  },
  blendMode: "normal",
  frequency: 0.08,
  emitterLifetime: -1,
  maxParticles: 10,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  }
};

export const bigwin_config = {
  alpha: {
    start: 1,
    end: 1
  },
  scale: {
    start: 1,
    end: 0.5,
    minimumScaleMultiplier: 0.2
  },
  color: {
    start: "#ffffff",
    end: "#ffffff"
  },
  speed: {
    start: 50,
    end: 60,
    minimumSpeedMultiplier: 3
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 0,
  startRotation: {
    min: 0,
    max: 0
  },
  noRotation: false,
  rotationSpeed: {
    min: -15,
    max: 30
  },
  lifetime: {
    min: 2,
    max: 5
  },
  blendMode: "screen",
  frequency: 0.01,
  emitterLifetime: 10,
  maxParticles: 200,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "ring",
  spawnCircle: {
    x: 0,
    y: 0,
    r: 200,
    minR: 0
  }
};

export const getFreeSpin_config = {
  alpha: {
    start: 1,
    end: 1
  },
  scale: {
    start: 1,
    end: 0.2,
    minimumScaleMultiplier: 1.2
  },
  color: {
    start: "#ffffff",
    end: "#ffffff"
  },
  speed: {
    start: 0,
    end: 0,
    minimumSpeedMultiplier: 3
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 600,
  startRotation: {
    min: 0,
    max: -180
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.2,
    max: 1
  },
  blendMode: "normal",
  frequency: 0.005,
  emitterLifetime: -1,
  maxParticles: 50,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -200,
    y: -150,
    w: 400,
    h: 300
  }
};

export const free_yuanbao_config = {
  alpha: {
    start: 1,
    end: 0.8
  },
  scale: {
    start: 1,
    end: 1.5,
    minimumScaleMultiplier: 1.2
  },
  color: {
    start: "#ffffff",
    end: "#ffffff"
  },
  speed: {
    start: 200,
    end: 0,
    minimumSpeedMultiplier: 3
  },
  acceleration: {
    x: 0,
    y: 300
  },
  maxSpeed: 600,
  startRotation: {
    min: 30,
    max: -180
  },
  noRotation: false,
  rotationSpeed: {
    min: -180,
    max: 540
  },
  lifetime: {
    min: 5,
    max: 5
  },
  blendMode: "normal",
  frequency: 0.005,
  emitterLifetime: 0.5,
  maxParticles: 30,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -140,
    y: -5,
    w: 280,
    h: 10
  }
};

export const free_s_config = {
  alpha: {
    start: 1,
    end: 1
  },
  scale: {
    start: 1,
    end: 0.2,
    minimumScaleMultiplier: 1.2
  },
  color: {
    start: "#ffffff",
    end: "#ffffff"
  },
  speed: {
    start: 0,
    end: 0,
    minimumSpeedMultiplier: 3
  },
  acceleration: {
    x: 0,
    y: 0
  },
  maxSpeed: 600,
  startRotation: {
    min: 0,
    max: -180
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 0
  },
  lifetime: {
    min: 0.2,
    max: 1
  },
  blendMode: "normal",
  frequency: 0.005,
  emitterLifetime: 2,
  maxParticles: 60,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -400,
    y: -150,
    w: 800,
    h: 300
  }
};

export const free_coin_config = {
  alpha: {
    start: 1,
    end: 0.8
  },
  scale: {
    start: 0.8,
    end: 1,
    minimumScaleMultiplier: 1.2
  },
  color: {
    start: "#ffffff",
    end: "#ffffff"
  },
  speed: {
    start: 200,
    end: 0,
    minimumSpeedMultiplier: 3
  },
  acceleration: {
    x: 0,
    y: 300
  },
  maxSpeed: 600,
  startRotation: {
    min: 30,
    max: -180
  },
  noRotation: false,
  rotationSpeed: {
    min: 0,
    max: 180
  },
  lifetime: {
    min: 5,
    max: 5
  },
  blendMode: "normal",
  frequency: 0.005,
  emitterLifetime: 0.5,
  maxParticles: 100,
  pos: {
    x: 0,
    y: 0
  },
  addAtBack: false,
  spawnType: "rect",
  spawnRect: {
    x: -140,
    y: -5,
    w: 280,
    h: 10
  }
};
