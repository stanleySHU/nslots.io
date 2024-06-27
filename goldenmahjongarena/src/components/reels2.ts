import * as builder from "../../engine/src/component/builder";
import { View } from "../../engine/src/component/component";
import { Layer } from "../../engine/src/component/layer";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { EVENTS_REEL_ALLSTOP } from "../../engine/src/slotMachine/component/inBackAnimatorAll";
import { ReelsAnimator } from "../../engine/src/slotMachine/component/reelAnimator";
import { Symbol } from "../../engine/src/slotMachine/component/symbol";
import * as slotType from "../../engine/src/slotMachine/component/type";
import { Line, WinPanel } from "../../engine/src/slotMachine/component/winPanel";
import { WinLine } from "../../engine/src/slotMachine/model/types";
import { SymbolService } from "../../engine/src/slotMachine/services/services";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import * as graphics from "../../engine/src/util/graphics";
import { Point } from "../../engine/src/util/math";
import * as random from "../../engine/src/util/random";
import * as xml from "../../engine/src/util/xml";
import { SYMBOL_Scatter, SYMBOL_WILD } from "../constants";
import { GameMainScene } from "../scenes/mainScene.mobile";

@Register({ tag: "reels" })
export class Reels extends View implements slotType.Reels {
  //reels: Reel[] = [];
  isSpinning: boolean = false;
  // eslint-disable-next-line @typescript-eslint/ban-types
  symbols: Symbol[][] = [];
  protected stopHandler: any;
  private _winPanel: WinPanel;
  winLines: WinLine[];
  symbolService: SymbolService;
  protected stopTimeout: NodeJS.Timeout;
  stopTime: number;
  preWinLineAnimation: () => void;
  //symbols to display on top [1st prioritySymbol, 2nd prioritySymbol]
  //prioritySymbols: number[] = [];
  symbolContainer: Layer;
  animator: ReelsAnimator;
  spinningSymbols: number[];
  maskSprite: any;
  symbolIndexes: number[][];

  // get symbolIndexes(): number[][] {
  //   return this._symbolIndexes;
  // }

  // set symbolIndexes(e: number[][]) {
  //   const arr = [];
  //   for (let col = 0; col < e.length; col++) {
  //     const item = e[col];
  //     const ss = [];
  //     for (let _ = 0; _ < (col == 0 || col == 4 ? 2 : 1); _++) {
  //       if (col == 2 && (this.parent as any).isFreeSpin) {
  //         ss.push(random.rangeInteger(20, 11));
  //       } else {
  //         ss.push(random.rangeInteger(20));
  //       }
  //     }
  //     arr.push([...item, ...ss]);
  //   }
  //   this._symbolIndexes = arr;
  // }

  constructor() {
    super();
    this.symbolService = director.services.get<SymbolService>("symbolService");
    director.injector.map("reels").toValue(this);
    for (let i = 0; i < slotApp.numCols(); i++) this.symbols.push([]);
    this.initSymbolContainer();
    this.animator = director.injector.get("reelsAnimator");
    this.animator.reels = this;
    //this.setMask();
    director.injector.map("winLineSetupSymbols").toValue(this.winLineSymbolSetup);
  }

  get scene() {
    return this.parent as GameMainScene;
  }

  initSymbolContainer() {
    this.symbolContainer = new Layer() as any;
    this.addChild(this.symbolContainer);
  }

  winLineSymbolSetup(line: Line, winLine: WinLine) {
    // console.log(line, winLine)
    // for (let i = 0; i < winLine.positions.length; i++) {
    //   const [x, y] = winLine.positions[i];
    //   let symbolAnim = line.symbolsPrefabs[x][y];
    //   if (symbolAnim === undefined) {
    //     const registerPoint = line.reels.getRegisterPoint(x, y);
    //     // console.log(registerPoint)
    //     symbolAnim = line.reels.getSymbol(x, y).clone();
    //     symbolAnim.col = x;
    //     symbolAnim.row = y;
    //     //newSymbol.reference = symbol;
    //     symbolAnim.x = registerPoint.x;
    //     symbolAnim.y = registerPoint.y;
    //     const pos = line.reels.getSymbolPos(x, y);
    //     for (const p of pos) {
    //       line.symbolsPrefabs[p.x][p.y] = symbolAnim;
    //     }
    //   }
    //   if (line.reels.symbols[x].indexOf(symbolAnim) === -1) line.reels.symbols[x].push(symbolAnim);
    // }
  }

  getNumRows(reelIndex) {
    // if (reelIndex % 4 == 0) {
    //   return 4;
    // }
    // return 5;
    return 7;
  }
  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    this.animator.play();
    this.winPanel.close();
    this.initMask();
  }

  spinReel(spinIdx: number) {}

  display(symbols?: number[][]) {
    if (symbols) this.symbolIndexes = symbols;
    else symbols = this.symbolIndexes;

    const length = symbols.length;
    for (let i = length - 1; i >= 0; i--) {
      this.displayCol(i);
    }
  }

  displayCol(i: number) {
    this.clearColSymbols(i);
    const symbols = this.symbolIndexes[i];
    for (let j = 0; j < this.getNumRows(i); j++) {
      const symbol = this.symbolService.get(symbols[j]);
      symbol.idle();
      this.setColRow(symbol, i, j);
      this.symbols[i][j] = symbol;
      this.addSymbol(symbol, i);
    }
  }

  layoutSymbols() {}

  reelStoped(col: number) {
    for (const s of this.symbolContainer.children as any) {
      if (s.col == col) {
        s.idle();
      }
    }
  }

  sortSymbols() {
    const arr = this.symbolContainer.children;
    arr.sort((a: any, b: any) => {
      if (a.index == SYMBOL_WILD || a.index == SYMBOL_Scatter) {
        return -1;
      } else if (b.index == SYMBOL_WILD || b.index == SYMBOL_Scatter) {
        return 1;
      } else {
        if (a.col == b.col) {
          return b.row - a.row;
        } else {
          return a.col - b.col;
        }
      }
    });
    for (let i = 0; i < arr.length; i++) {
      const symbol = arr[i];
      (symbol as View).parent.setChildIndex(symbol, 0);
    }
  }

  addSymbol(symbol, col) {
    this.symbolContainer.addChild(symbol);
    symbol.pivot.y = this.getSymbolPivotY(col);
  }

  addSymbolAt(symbol, index, col) {
    const symbolIndex = Number(index);
    const isWildOrScatter = symbolIndex === 10 || symbolIndex === 9;
    const childrenCount = this.symbolContainer.children.length - 1;
    this.symbolContainer.addChildAt(symbol, isWildOrScatter ? childrenCount : Math.min({ 0: 27, 1: 21, 2: 14, 3: 7, 4: 0 }[col], childrenCount));
    symbol.pivot.y = this.getSymbolPivotY(col);
  }

  adjustCol(i: number) {
    for (let j = 0; j < this.getNumRows(i); j++) {
      const symbol = this.symbols[i][j];
      symbol.idle();
      this.setColRow(symbol, i, j);
    }
  }

  clearColSymbols(i: number) {
    this.symbols[i].forEach((s) => {
      this.removeSymbol(s);
    });
    this.symbols[i] = [];
  }

  clearSymbols() {
    for (let i = 0; i < slotApp.numCols(); i++) {
      this.clearColSymbols(i);
    }
  }

  stop(symbols: number[][], simultaneously: boolean = false, winLines?: WinLine[], stopHandler?: () => void) {
    this.symbolIndexes = symbols;
    this.winLines = winLines;
    this.stopHandler = stopHandler;
    this.stopTimeout = setTimeout(() => {
      if (simultaneously) {
        this.stopImmediately();
      } else {
        this.animator
          .stop()
          .then(() => this.layoutSymbols())
          .then(() => this.animationStopped())
          .catch((err) => {
            slotApp.showTranslateErr(err.code ? err.code : slotApp.SPIN_ERROR);
          });
      }
    }, this.stopTime);
  }

  deactivate() {
    super.deactivate();
    this.winPanel.close();
  }

  addSpinSymbols(index: number) {
    for (let i = index; i < slotApp.numCols(); i++) {
      this.addSymbolsAtColTop(i, this.pickMany(1, i), (s) => {
        s.spin();
        s.col = i;
      });
    }
  }

  addStopSymbols(index: number) {
    this.addSymbolsAtColTop(index, this.symbolIndexes[index], (s) => s.idle());
    const stopDis = -this.symbols[index][0].y;
    return stopDis;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  addSymbolsAtColTop(index: number, symbols: number[] | string[], symbolCreated: (s: Symbol) => void) {
    if (!symbols) return;
    for (let i = symbols.length - 1; i >= 0; i--) {
      const topSymbol = this.symbols[index][0];
      // const firstSymbolPos = this.getNumRows(index) === 4 ? -slotApp.symbolHeight() : 0;
      const top = topSymbol ? topSymbol.y : 0;
      const symbol = this.symbolService.get(symbols[i]);
      symbol.x = topSymbol ? topSymbol.x : this.getReelX(index);
      symbol.y = top - slotApp.symbolHeight();
      symbolCreated(symbol);
      //this.symbolContainer.addChild(symbol);
      this.addSymbolAt(symbol, symbols[i], index);
      this.symbols[index].unshift(symbol);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  addSymbolsAtColsTop(indexes: number[], symbols: number[][] | string[][], symbolCreated: (s: Symbol) => void) {
    if (!symbols) return;
    for (let i = 0; i < indexes.length; i++) {
      this.addSymbolsAtColTop(indexes[i], symbols[i], symbolCreated);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  addSymbolsAtTop(symbols: number[][] | string[][], symbolCreated: (s: Symbol) => void, index = 0) {
    const indexes = [];
    for (let i = index; i < slotApp.numCols(); i++) indexes.push(i);
    this.addSymbolsAtColsTop(indexes, symbols, symbolCreated);
  }

  setColRow(symbol, i, j) {
    const registerPoint = this.getRegisterPoint(i, j);
    symbol.col = i;
    symbol.row = j;
    symbol.position.set(registerPoint.x, registerPoint.y);
  }

  pickMany(count: number, col?: number) {
    const symbols = [];
    for (let j = 0; j < count; j++) {
      if (col == 2 && this.scene.isFreeSpin) {
        for (let j = 0; j < count; j++) {
          symbols.push(random.rangeInteger(20, 11));
        }
      } else {
        for (let j = 0; j < count; j++) {
          symbols.push(random.rangeInteger(20));
        }
      }
    }
    return symbols;
  }

  removeOutsideSymbols() {
    for (let i = 0; i < slotApp.numCols(); i++) {
      const len = this.symbols[i].length;
      for (let j = len - 1; j >= 0; j--) {
        const s = this.symbols[i][j];
        if (s.y > slotApp.symbolHeight() * (this.getNumRows(i) + 1)) {
          this.removeSymbol(s);
          this.symbols[i].splice(j, 1);
        }
      }
    }
  }

  public removeSymbolByPos(col: number, row: number) {
    const s = this.symbols[col][row];
    this.removeSymbol(s);
    this.symbols[col].splice(row, 1);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public removeSymbol(symbol: Symbol) {
    if (symbol.attachedSymbol && symbol.attachedFollow) {
      //this.symbolContainer.removeChild(symbol.attachedSymbol);
      if (symbol.attachedSymbol.parent) symbol.attachedSymbol.parent.removeChild(symbol.attachedSymbol);
      this.symbolService.free(symbol.attachedSymbol);
    }
    //this.symbolContainer.removeChild(symbol);
    if (symbol.parent) symbol.parent.removeChild(symbol);
    this.symbolService.free(symbol);
  }

  initMask() {
    if (this.maskSprite) {
      this.removeChild(this.maskSprite);
      this.maskSprite = undefined;
    }
    this.setMask();
  }

  setMask() {
    if (!this.maskSprite) {
      // this.maskSprite = graphics.rectangle(this.getReelX(slotApp.numCols()), slotApp.numRows() * slotApp.symbolHeight());
      this.maskSprite = graphics.rectangle(480, 570);
      this.addChild(this.maskSprite);
      this.maskSprite.y = -10;
    }
    this.mask = this.maskSprite;
    this.maskSprite.visible = true;
  }

  removeMask() {
    this.mask = undefined;
    this.maskSprite.visible = false;
  }

  stopImmediately() {
    clearTimeout(this.stopTimeout);
    //this.stopSymbols((reel) => reel.stopImmediately());
    this.display();
    this.animator.cancel();
    this.animationStopped();
    this.scene.playSymbolDropAnimAfterSkip();
  }

  protected animationStopped() {
    this.isSpinning = false;
    this.removeMask();
    if (this.stopHandler) this.stopHandler({ symbols: this.symbolIndexes, winlines: this.winLines }).then(() => this.showWinLines());
    else this.showWinLines();

    director.inputManager.emit(EVENTS_REEL_ALLSTOP);
  }

  public showWinLines(winLines?: WinLine[], silent: boolean = false) {
    winLines = winLines === undefined ? this.winLines : winLines;
    if (winLines) {
      //winLines.forEach(this.setupSymbols, this);
      // this.winPanel.show(winLines, silent);
    }
  }

  public getReelX(idx): number {
    return idx * (slotApp.symbolWidth() + slotApp.reelPadding());
  }

  public getReelY(idx, col?): number {
    return idx * (slotApp.symbolHeight() + slotApp.symbolPadding());
  }

  private getSymbolPivotY(col: number) {
    const symbolHeightPadding = slotApp.symbolHeight() + slotApp.symbolPadding();
    if (col % 4 == 0) {
      return symbolHeightPadding / 2;
    } else {
      return symbolHeightPadding;
    }
  }

  public getRegisterPoint(col: number, row: number): Point {
    //let reel = this.getDisplayedReel(reelIndex);
    //let point = reel.getRegisterPoint(symbolIndex);
    return {
      x: this.getReelX(col),
      y: this.getReelY(row, col)
    };
  }

  public getSymbol(col: number, row: number) {
    return this.symbols[col][row];
  }

  public getSymbolPos(col: number, row: number) {
    return [{ x: col, y: row }];
  }

  public setSpinningTime(idx: number, time: number, once = true) {
    this.animator.setSpinningTime(idx, time, once);
  }

  hasSymbolInReel(reelIdx: number, symbolIdx: number): boolean {
    const symbols = this.symbolIndexes[reelIdx];
    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] === symbolIdx) return true;
    }
    return false;
  }

  get winPanel(): WinPanel {
    if (!this._winPanel) {
      this._winPanel = director.sceneManager.current.getComponentByTag("winPanel") as WinPanel;
    }
    return this._winPanel;
  }

  set reelPadding(value) {
    slotApp.reelPadding(value);
    for (let i = 0; i < this.symbols.length; i++) {
      for (let j = 0; j < this.symbols[i].length; j++) {
        const reg = this.getRegisterPoint(i, j);
        this.symbols[i][j].x = reg.x;
      }
    }
    // this.initMask();
  }

  static create(node: Element, args: builder.BuildArgs) {
    return createReels(Reels, node, args);
  }
}

export function createReels(type: any, node: Element, args: builder.BuildArgs) {
  const reels = new type();
  reels.stopTime = xml.num(node, "stopTime", 1000);
  builder.setProperties(reels, node, args);
  builder.setLayoutValue(reels, node, "reelPadding", xml.num, 0);
  slotApp.reelPadding(xml.num(node, "reelPadding"));
  // reels.setMask();
  return reels;
}
