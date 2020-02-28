import CanvasAnchorPoint from '@app/_redesign/graphics/canvas/shapes/CanvasAnchorPoint';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';
import Node from '@app/_redesign/graphics/diagram/Node';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';


const BORDER_WIDTH = 3;
const BORDER_RADIUS = 10;
const WIDTH = 120;
const HEIGHT = 60;

const COLOR = 'rgba(142, 201, 203, 1)';
const BACKGROUND_COLOR = 'rgba(185, 229, 230, 1)';

const activityNodeStyles = {
  background: {
    color: BACKGROUND_COLOR
  },
  border: {
    width: BORDER_WIDTH,
    color: COLOR,
    style: 'solid',
  },
} as ShapeStyle;


type ActivityNodeParams = {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export default class ActivityNode extends Node {
  public name = 'ActivityNode';

  private rectangle: CanvasRectangle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: ActivityNodeParams) {
    super(canvas, htmlLayer);

    const rectangleParams = {
      x: params.x,
      y: params.y,
      width: params.width || WIDTH,
      height: params.height || HEIGHT,
      borderRadius: BORDER_RADIUS,
    };
    this.rectangle = new CanvasRectangle(canvas, htmlLayer, activityNodeStyles, rectangleParams);
    this.connections = [
      new CanvasAnchorPoint(canvas, htmlLayer, { x: rectangleParams.x, y: rectangleParams.y - rectangleParams.height/2 }),
      new CanvasAnchorPoint(canvas, htmlLayer, { x: rectangleParams.x + rectangleParams.width/2, y: rectangleParams.y }),
      new CanvasAnchorPoint(canvas, htmlLayer, { x: rectangleParams.x, y: rectangleParams.y + rectangleParams.height/2 }),
      new CanvasAnchorPoint(canvas, htmlLayer, { x: rectangleParams.x - rectangleParams.width/2, y: rectangleParams.y }),
    ];
  }

  public draw() {
    this.rectangle.draw();

    if (this.isHover || this.isActive) {
      this.connections.forEach((it) => it.draw());
    }
  }

  public includes(x: number, y: number) {
    return this.rectangle.includes(x, y) || this.connections.some((it) => it.includes(x, y));
  }

  public move(dx: number, dy: number) {
    this.rectangle.move(dx, dy);
    this.connections.forEach((it) => it.move(dx, dy));
  }
}
