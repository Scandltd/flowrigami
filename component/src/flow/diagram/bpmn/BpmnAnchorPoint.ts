import { POINT_BACKGROUND_COLOR, POINT_BORDER_COLOR, POINT_BORDER_WIDTH, POINT_DOT_RADIUS, POINT_RADIUS } from '@app/flow/DefaultThemeConstants';
import Circle from '@app/flow/geometry/Circle';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import nanoid from 'nanoid';


const circleStyles: ShapeStyle = {
  border: {
    color: POINT_BORDER_COLOR,
    style: 'solid',
    width: POINT_BORDER_WIDTH,
  },
  background: {
    color: POINT_BACKGROUND_COLOR
  }
};

const dotStyles: ShapeStyle = {
  background: {
    color: POINT_BORDER_COLOR
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

export default class BpmnAnchorPoint extends EventTarget {
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

    const circleParams: Circle = { x, y, radius: POINT_RADIUS };
    const dotParams: Circle = { x, y, radius: POINT_DOT_RADIUS };

    this.ctx = ctx;
    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');
    this.circle = new CanvasCircle(canvas, tmpHookDiv, circleStyles, circleParams);
    this.dot = new CanvasCircle(canvas, tmpHookDiv, dotStyles, dotParams);
  }

  public clone() {
    return new (<typeof BpmnAnchorPoint>this.constructor)(this.ctx, { x: this.x, y: this.y }, this.orientation);
  }

  // return terminal point of vector from initial coordinate
  public createVector(target: CoordinatePoint, length: number = 1) {
    const delta = { x: target.x - this.x, y: target.y - this.y };
    const terminalPoint = { x: this.x, y: this.y };
    switch (this.orientation) {
      case BpmnAnchorPoint.Orientation.Bottom:
        terminalPoint.y += length;
        break;
      case BpmnAnchorPoint.Orientation.Top:
        terminalPoint.y -= length;
        break;
      case BpmnAnchorPoint.Orientation.Left:
        terminalPoint.x -= length;
        break;
      case BpmnAnchorPoint.Orientation.Right:
        terminalPoint.x += length;
        break;
      case BpmnAnchorPoint.Orientation.LeftRight:
        terminalPoint.x += length*Math.sign(delta.x);
        break;
      case BpmnAnchorPoint.Orientation.TopBottom:
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
