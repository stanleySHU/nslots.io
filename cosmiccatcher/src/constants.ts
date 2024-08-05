import * as director from "../engine/src/director";

export const I_SYMBOL_BONUS_1 = 1;
export const I_SYMBOL_BONUS_2 = 0;

export const WIN_LEVEL_FREQUENCIES: number[] = [0.11, 0.1, 0.09, 0.08, 0];
export const WINLINE_LEVELS: number[] = [0, 6, 17, 26, 38];
export const WINLINE_DURATIONS: number[] = [1, 4, 9, 18, 8.2];
export const WIN_LEVEL_COINS: number[] = [20, 40, 80, 200, 0];

export const Speed = {
  defaultUp: (startSpeed: number, spendUp: number, curMillisecond: number) => {
    return (1 / 2) * spendUp * curMillisecond * curMillisecond + startSpeed * curMillisecond;
  },
  up: (startSpeed: number, endSpeed: number, totalMillisecond: number, curMillisecond: number) => {
    totalMillisecond = totalMillisecond / 1000;
    curMillisecond = curMillisecond / 1000;
    if (totalMillisecond == 0) {
      return 0;
    }
    const accSpeed = (endSpeed - startSpeed) / totalMillisecond;
    return startSpeed * curMillisecond + (accSpeed * curMillisecond * curMillisecond) / 2;
  },
  down: (startSpeed: number, endSpeed: number, totalMillisecond: number, curMillisecond: number) => {
    totalMillisecond = totalMillisecond / 1000;
    curMillisecond = curMillisecond / 1000;
    if (totalMillisecond == 0) {
      return 0;
    }
    const decSpeed = (startSpeed - endSpeed) / totalMillisecond;
    return startSpeed * curMillisecond - (decSpeed * curMillisecond * curMillisecond) / 2;
  }
};

export function getImageResource(name: string, atlas: string = "components/") {
  return director.resourceManager.resolve("@atlas/" + atlas + name + ".png");
}

export function coins_textures(): any[] {
  const coins = [];
  for (let i: number = 1; i <= 14; i++) {
    coins.push(getImageResource("coin_" + i));
  }
  return coins;
}

export const coins_config = {
  alpha: {
    start: 1,
    end: 1
  },
  scale: {
    start: 0.2,
    end: 1,
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
