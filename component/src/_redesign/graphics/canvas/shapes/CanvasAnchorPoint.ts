import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasCircle from '@app/flow/graphics/canvas/shapes/CanvasCircle';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';


const LINE_WIDTH = 1;
const CIRCLE_RADIUS = 4.5;
const DOT_RADIUS = 1;

const COLOR = 'rgba(83, 83, 83, 0.7)';
const BACKGROUND_COLOR = 'rgba(255, 255, 255, 1)';

const circleStyles = {
  background: {
    color: BACKGROUND_COLOR
  },
  border: {
    color: COLOR,
    style: 'solid',
    width: LINE_WIDTH,
  }
} as ShapeStyle;

const dotStyles = {
  background: {
    color: COLOR
  }
} as ShapeStyle;

export default class CanvasAnchorPoint extends CanvasShape {
  public name = 'CanvasAnchorPoint';
  public x: number;
  public y: number;

  private circle: CanvasCircle;
  private dot: CanvasCircle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, { x, y }: CoordinatePoint) {
    super(canvas, htmlLayer);
    this.x = x;
    this.y = y;

    const circleParams = { x, y, radius: CIRCLE_RADIUS };
    this.circle = new CanvasCircle(canvas, htmlLayer, circleStyles, circleParams);

    const dotParams = { x, y, radius: DOT_RADIUS };
    this.dot = new CanvasCircle(canvas, htmlLayer, dotStyles, dotParams);
  }

  public draw() {
    this.circle.draw();
    this.dot.draw();
  }

  public includes(x: number, y: number) {
    return this.circle.includes(x, y);
  }

  public move(dx: number, dy: number) {
    this.circle.move(dx, dy);
    this.dot.move(dx, dy);
  }
}
