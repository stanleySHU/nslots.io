import { IPointData } from "pixi.js";
import { Orientation } from "../../engine/src/core/types";
import { Point } from "../../engine/src/util/math";
import { Animator, SpinAnimtionResultOptions as _SpinAnimtionResultOptions } from "./animator";

export interface SpinAnimtionResultOptions extends _SpinAnimtionResultOptions {
  path: IPointData[];
}

export class AnimatorWithMask extends Animator {
  protected halfWidth: number = 38;
  protected outerPathL: Point[] = [
    { x: this.pathL[0].x - this.halfWidth, y: this.pathL[0].y - this.halfWidth },
    { x: this.pathL[1].x + this.halfWidth, y: this.pathL[1].y - this.halfWidth },
    { x: this.pathL[2].x + this.halfWidth, y: this.pathL[2].y + this.halfWidth },
    { x: this.pathL[3].x - this.halfWidth, y: this.pathL[3].y + this.halfWidth }
  ];

  protected outerPathP: Point[] = [
    { x: this.pathP[0].x - this.halfWidth, y: this.pathP[0].y - this.halfWidth },
    { x: this.pathP[1].x + this.halfWidth, y: this.pathP[1].y - this.halfWidth },
    { x: this.pathP[2].x + this.halfWidth, y: this.pathP[2].y + this.halfWidth },
    { x: this.pathP[3].x - this.halfWidth, y: this.pathP[3].y + this.halfWidth }
  ];

  protected interPathL: Point[] = [
    { x: this.pathL[0].x + this.halfWidth, y: this.pathL[0].y + this.halfWidth },
    { x: this.pathL[1].x - this.halfWidth, y: this.pathL[1].y + this.halfWidth },
    { x: this.pathL[2].x - this.halfWidth, y: this.pathL[2].y - this.halfWidth },
    { x: this.pathL[3].x + this.halfWidth, y: this.pathL[3].y - this.halfWidth }
  ];

  protected interPathP: Point[] = [
    { x: this.pathP[0].x + this.halfWidth, y: this.pathP[0].y + this.halfWidth },
    { x: this.pathP[1].x - this.halfWidth, y: this.pathP[1].y + this.halfWidth },
    { x: this.pathP[2].x - this.halfWidth, y: this.pathP[2].y - this.halfWidth },
    { x: this.pathP[3].x + this.halfWidth, y: this.pathP[3].y - this.halfWidth }
  ];

  private _outerPathLengthL: number;
  private _outerPathNodeLengthL: number[] = [];
  protected getOuterPathLengthL() {
    if (!this._outerPathLengthL) {
      [this._outerPathLengthL, this._outerPathNodeLengthL] = this.calPathLength(this.outerPathL);
    }
    return this._outerPathLengthL;
  }

  private _outerPathLengthP: number;
  private _outerPathNodeLengthP: number[] = [];
  protected getOuterPathLengthP() {
    if (!this._outerPathLengthP) {
      [this._outerPathLengthP, this._outerPathNodeLengthP] = this.calPathLength(this.outerPathP);
    }
    return this._outerPathLengthP;
  }

  protected getOuterPathLength(orientation: Orientation) {
    if (orientation == Orientation.LANDSCAPE) {
      return this.getOuterPathLengthL();
    } else {
      return this.getOuterPathLengthP();
    }
  }

  private _interPathLengthL: number;
  private _interPathNodeLengthL: number[] = [];
  protected getInterPathLengthL() {
    if (!this._interPathLengthL) {
      [this._interPathLengthL, this._interPathNodeLengthL] = this.calPathLength(this.interPathL);
    }
    return this._interPathLengthL;
  }

  private _interPathLengthP: number;
  private _interPathNodeLengthP: number[] = [];
  protected getInterPathLengthP() {
    if (!this._interPathLengthP) {
      [this._interPathLengthP, this._interPathNodeLengthP] = this.calPathLength(this.interPathP);
    }
    return this._interPathLengthP;
  }

  protected getInterPathLength(orientation: Orientation) {
    if (orientation == Orientation.LANDSCAPE) {
      return this.getInterPathLengthL();
    } else {
      return this.getInterPathLengthP();
    }
  }

  calPolygonPath(e: SpinAnimtionResultOptions, distance: number, orientation: Orientation): IPointData[] {
    const pathLength = this.getPathLength(orientation);
    const outerPathLength = this.getOuterPathLength(orientation);
    const interPathLength = this.getInterPathLength(orientation);
    const outerPathNodeLength = orientation == Orientation.LANDSCAPE ? this._outerPathNodeLengthL : this._outerPathNodeLengthP;
    const outerPath = orientation == Orientation.LANDSCAPE ? this.outerPathL : this.outerPathP;
    const interPathNodeLength = orientation == Orientation.LANDSCAPE ? this._interPathNodeLengthL : this._interPathNodeLengthP;
    const interPath = orientation == Orientation.LANDSCAPE ? this.interPathL : this.interPathP;
    const inPart = e.speedVector.x == 1 ? 0 : e.speedVector.x == -1 ? 2 : e.speedVector.y == 1 ? 3 : 1;

    const offset = distance % pathLength;
    const tailLength = TWEEN.Easing.Circular.In(e.speed / 100) * 100;
    const outerDistanceStart = (offset + this.halfWidth + this.halfWidth * 2 * inPart + outerPathLength) % outerPathLength;
    const outerDistance = (offset + this.halfWidth + this.halfWidth * 2 * inPart + outerPathLength - tailLength) % outerPathLength;
    const interDistanceStart = (offset - this.halfWidth - this.halfWidth * 2 * inPart + interPathLength) % interPathLength;
    const interDistance = (offset - this.halfWidth - this.halfWidth * 2 * inPart + interPathLength - tailLength) % interPathLength;
    const [outerPoint, outerSpeedVector] = this.getPointAndSpeedVectorWith(outerDistance, outerPathNodeLength, outerPath);
    const [outerPointStart] = this.getPointAndSpeedVectorWith(outerDistanceStart, outerPathNodeLength, outerPath);
    const [interPoint, interSpeedVector] = this.getPointAndSpeedVectorWith(interDistance, interPathNodeLength, interPath);
    const [interPointStart] = this.getPointAndSpeedVectorWith(interDistanceStart, interPathNodeLength, interPath);
    console.log(offset, interDistanceStart);

    const outPoint2 =
      outerSpeedVector.x == 1
        ? { x: outerPoint.x - 20, y: outerPoint.y + 20 }
        : outerSpeedVector.y == -1
          ? { x: outerPoint.x - 20, y: outerPoint.y - 20 }
          : outerSpeedVector.x == -1
            ? { x: outerPoint.x + 20, y: outerPoint.y - 20 }
            : { x: outerPoint.x + 20, y: outerPoint.y + 20 };
    const interPoint2 =
      interSpeedVector.x == 1
        ? { x: interPoint.x - 20, y: interPoint.y - 20 }
        : interSpeedVector.y == -1
          ? { x: interPoint.x + 20, y: interPoint.y - 20 }
          : interSpeedVector.x == -1
            ? { x: interPoint.x + 20, y: interPoint.y + 20 }
            : { x: interPoint.x - 20, y: interPoint.y + 20 };
    return [outerPointStart, interPointStart, interPoint, interPoint2, outPoint2, outerPoint];
  }

  update(speed: number, distance: number, orientation: Orientation): SpinAnimtionResultOptions {
    const e = super.update(speed, distance, orientation) as SpinAnimtionResultOptions;
    e.path = this.calPolygonPath(e, distance, orientation);
    return e;
  }
}
