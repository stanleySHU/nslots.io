import { IPointData } from "pixi.js";
import { Orientation } from "../../engine/src/core/types";
import { Animator, SpinAnimtionResultOptions as _SpinAnimtionResultOptions } from "./animator";

export interface SpinAnimtionResultOptions extends _SpinAnimtionResultOptions {
  path: IPointData[];
}

export class AnimatorWithMask extends Animator {
  protected halfWidth: number = 38;

  calPolygonPath(e: SpinAnimtionResultOptions, distance: number, orientation: Orientation): IPointData[] {
    const res = [];
    const path = orientation == Orientation.LANDSCAPE ? this.pathL : this.pathP;
    const pathLength = this.getPathLength(orientation);
    const tailLength = TWEEN.Easing.Circular.In(e.speed / 2000) * 250;
    const tailOffset = (distance - tailLength - this.halfWidth + pathLength) % pathLength;
    const [tailPoint, speedVector] = this.getPointAndSpeedVector(tailOffset, orientation);
    const existCorner = speedVector.x != e.speedVector.x || speedVector.y != e.speedVector.y;
    const points1 = [];
    const points2 = [];
    const points3 = [];
    if (e.speedVector.x == 1) {
      points1.push(
        { x: e.point.x - this.halfWidth, y: e.point.y - this.halfWidth },
        { x: e.point.x - this.halfWidth, y: e.point.y + this.halfWidth }
      );
      if (existCorner) {
        points2.push(
          { x: path[0].x - this.halfWidth, y: path[0].y - this.halfWidth },
          { x: path[0].x + this.halfWidth, y: path[0].y + this.halfWidth }
        );
        points3.push({ x: tailPoint.x - this.halfWidth, y: tailPoint.y }, { x: tailPoint.x + this.halfWidth, y: tailPoint.y });
        points3[0].y = Math.max(points3[0].y, points2[1].y);
        points3[1].y = Math.max(points3[1].y, points2[1].y);
      } else {
        points3.push({ x: tailPoint.x, y: tailPoint.y - this.halfWidth }, { x: tailPoint.x, y: tailPoint.y + this.halfWidth });
      }
    } else if (e.speedVector.y == -1) {
      points1.push(
        { x: e.point.x + this.halfWidth, y: e.point.y - this.halfWidth },
        { x: e.point.x - this.halfWidth, y: e.point.y - this.halfWidth }
      );
      if (existCorner) {
        points2.push(
          { x: path[1].x + this.halfWidth, y: path[1].y - this.halfWidth },
          { x: path[1].x - this.halfWidth, y: path[1].y + this.halfWidth }
        );
        points3.push({ x: tailPoint.x, y: tailPoint.y - this.halfWidth }, { x: tailPoint.x, y: tailPoint.y + this.halfWidth });
        points3[0].x = Math.min(points3[0].x, points2[1].x);
        points3[1].x = Math.min(points3[1].x, points2[1].x);
      } else {
        points3.push({ x: tailPoint.x + this.halfWidth, y: tailPoint.y }, { x: tailPoint.x - this.halfWidth, y: tailPoint.y });
      }
    } else if (e.speedVector.x == -1) {
      points1.push(
        { x: e.point.x + this.halfWidth, y: e.point.y + this.halfWidth },
        { x: e.point.x + this.halfWidth, y: e.point.y - this.halfWidth }
      );
      if (existCorner) {
        points2.push(
          { x: path[2].x + this.halfWidth, y: path[2].y + this.halfWidth },
          { x: path[2].x - this.halfWidth, y: path[2].y - this.halfWidth }
        );
        points3.push({ x: tailPoint.x + this.halfWidth, y: tailPoint.y }, { x: tailPoint.x - this.halfWidth, y: tailPoint.y });
        points3[0].y = Math.min(points3[0].y, points2[1].y);
        points3[1].y = Math.min(points3[1].y, points2[1].y);
      } else {
        points3.push({ x: tailPoint.x, y: tailPoint.y + this.halfWidth }, { x: tailPoint.x, y: tailPoint.y - this.halfWidth });
      }
    } else {
      points1.push(
        { x: e.point.x - this.halfWidth, y: e.point.y + this.halfWidth },
        { x: e.point.x + this.halfWidth, y: e.point.y + this.halfWidth }
      );
      if (existCorner) {
        points2.push(
          { x: path[3].x - this.halfWidth, y: path[3].y + this.halfWidth },
          { x: path[3].x + this.halfWidth, y: path[3].y - this.halfWidth }
        );
        points3.push({ x: tailPoint.x, y: tailPoint.y + this.halfWidth }, { x: tailPoint.x, y: tailPoint.y - this.halfWidth });
        points3[0].x = Math.max(points3[0].x, points2[1].x);
        points3[1].x = Math.max(points3[1].x, points2[1].x);
      } else {
        points3.push({ x: tailPoint.x - this.halfWidth, y: tailPoint.y }, { x: tailPoint.x + this.halfWidth, y: tailPoint.y });
      }
    }
    if (existCorner) {
      res.push(points1[0], points2[0], ...points3, points2[1], points1[1]);
    } else {
      res.push(points1[0], ...points3, points1[1]);
    }
    return res;
  }

  update(speed: number, distance: number, orientation: Orientation): SpinAnimtionResultOptions {
    const e = super.update(speed, distance, orientation) as SpinAnimtionResultOptions;
    e.path = this.calPolygonPath(e, distance, orientation);
    return e;
  }
}
