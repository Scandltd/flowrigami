import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import { CircleParams } from '@app/flow/geometry/shapes/Circle';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import nanoid from 'nanoid';


const CIRCLE_RADIUS = 4.5;
const DOT_RADIUS = 1;

const COLOR = 'rgba(83, 83, 83, 0.7)';
const BACKGROUND_COLOR = 'rgba(255, 255, 255, 1)';

const circleStyles: ShapeStyle = {
  border: {
    color: COLOR,
    style: 'solid',
    width: 1,
  },
  background: {
    color: BACKGROUND_COLOR
  }
};

const dotStyles: ShapeStyle = {
  background: {
    color: COLOR
  }
};


enum Orientation {
  Top = 'TOP',
  Bottom = 'BOTTOM',
  Left = 'LEFT',
  Right = 'RIGHT',
  TopBottom = 'TOP_BOTTOM',
  LeftRight = 'LEFT_RIGHT'
}

export default class AnchorPoint extends EventTarget {
  public static readonly Orientation = Orientation;

  public id: string;
  public x: number;
  public y: number;
  public orientation: Orientation | null;

  private ctx: CanvasRenderingContext2D;
  private circle: CanvasCircle;
  private dot: CanvasCircle;

  constructor(ctx: CanvasRenderingContext2D, { x, y }: CoordinatePoint, orientation: Orientation | null = null) {
    super();
    this.id = nanoid();
    this.x = x;
    this.y = y;
    this.orientation = orientation;

    const circleParams: CircleParams = { x, y, radius: CIRCLE_RADIUS };
    const dotParams: CircleParams = { x, y, radius: DOT_RADIUS };

    this.ctx = ctx;
    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');
    this.circle = new CanvasCircle(canvas, tmpHookDiv, circleStyles, circleParams);
    this.dot = new CanvasCircle(canvas, tmpHookDiv, dotStyles, dotParams);
  }

  public clone() {
    return new (<typeof AnchorPoint>this.constructor)(this.ctx, { x: this.x, y: this.y }, this.orientation);
  }

  // return terminal point of vector from initial coordinate
  public createVector(target: CoordinatePoint, length: number = 1) {
    const delta = { x: target.x - this.x, y: target.y - this.y };
    const terminalPoint = { x: this.x, y: this.y };
    switch (this.orientation) {
      case AnchorPoint.Orientation.Bottom:
        terminalPoint.y += length;
        break;
      case AnchorPoint.Orientation.Top:
        terminalPoint.y -= length;
        break;
      case AnchorPoint.Orientation.Left:
        terminalPoint.x -= length;
        break;
      case AnchorPoint.Orientation.Right:
        terminalPoint.x += length;
        break;
      case AnchorPoint.Orientation.LeftRight:
        terminalPoint.x += length*Math.sign(delta.x);
        break;
      case AnchorPoint.Orientation.TopBottom:
        terminalPoint.y += length*Math.sign(delta.y);
        break;
      default:
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
          terminalPoint.x += length*Math.sign(delta.x);
        } else {
          terminalPoint.y += length*Math.sign(delta.y);
        }
    }
    return terminalPoint;
  }

  public draw() {
    this.circle.draw();
    this.dot.draw();
  }

  public includes({ x, y }: CoordinatePoint) {
    return this.circle.includes(x, y);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.circle.move(dx, dy);
    this.dot.move(dx, dy);
    this.dispatchEvent(new Event('move'));
  }
}
