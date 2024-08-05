import { Orientation } from "../../engine/src/core/types";
import { Point } from "../../engine/src/util/math";

export interface SpinAnimtionResultOptions {
  point: Point;
  speedVector: Point;
  speed: number;
  offsetInPathPct: number;
  stop?: boolean;
}

export class Animator {
  protected pathL: Point[] = [
    { x: 0, y: 0 },
    { x: 522, y: 0 },
    { x: 522, y: 336 },
    { x: 0, y: 336 }
  ];
  protected pathP: Point[] = [
    { x: 0, y: 0 },
    { x: 336, y: 0 },
    { x: 336, y: 522 },
    { x: 0, y: 522 }
  ];

  protected calPathLength(path: Point[]): [number, number[]] {
    let pathLength = 0;
    const pathNodeLength: number[] = [];
    for (let i = 0; i < path.length; i++) {
      const p0 = path[i];
      const p1 = path[(i + 1) % path.length];
      const l = Math.sqrt((p1.x - p0.x) ** 2 + (p1.y - p0.y) ** 2);
      pathLength += l;
      pathNodeLength.push(pathLength);
    }
    return [pathLength, pathNodeLength];
  }

  private _pathLengthL: number;
  private _pathNodeLengthL: number[] = [];
  protected getPathLengthL() {
    if (!this._pathLengthL) {
      [this._pathLengthL, this._pathNodeLengthL] = this.calPathLength(this.pathL);
    }
    return this._pathLengthL;
  }

  private _pathLengthP: number;
  private _pathNodeLengthP: number[] = [];
  protected getPathLengthP() {
    if (!this._pathLengthP) {
      [this._pathLengthP, this._pathNodeLengthP] = this.calPathLength(this.pathP);
    }
    return this._pathLengthP;
  }

  protected getPointAndSpeedVectorWith(offset: number, pathNodeLength: number[], path: Point[]) {
    let point: Point, speedVector: Point;

    if (offset < pathNodeLength[0]) {
      point = { x: offset + path[0].x, y: path[0].y };
      speedVector = { x: 1, y: 0 };
    } else if (offset < pathNodeLength[1]) {
      point = { x: path[1].x, y: offset - pathNodeLength[0] };
      speedVector = { x: 0, y: -1 };
    } else if (offset < pathNodeLength[2]) {
      point = { x: path[2].x - (offset - pathNodeLength[1]), y: path[2].y };
      speedVector = { x: -1, y: 0 };
    } else {
      point = { x: path[3].x, y: path[3].y - (offset - pathNodeLength[2]) };
      speedVector = { x: 0, y: 1 };
    }
    return [point, speedVector];
  }

  protected getPointAndSpeedVector(offset: number, orientation: Orientation) {
    const pathNodeLength = orientation == Orientation.LANDSCAPE ? this._pathNodeLengthL : this._pathNodeLengthP;
    const path = orientation == Orientation.LANDSCAPE ? this.pathL : this.pathP;
    return this.getPointAndSpeedVectorWith(offset, pathNodeLength, path);
  }

  getPathLength(orientation: Orientation) {
    if (orientation == Orientation.LANDSCAPE) {
      return this.getPathLengthL();
    } else {
      return this.getPathLengthP();
    }
  }

  update(speed: number, distance: number, orientation: Orientation): SpinAnimtionResultOptions {
    const pathLength = this.getPathLength(orientation);
    const offset = distance % pathLength;
    const [point, speedVector] = this.getPointAndSpeedVector(offset, orientation);
    return {
      point: point,
      speedVector: speedVector,
      speed: speed,
      offsetInPathPct: offset / pathLength
    };
  }
}
