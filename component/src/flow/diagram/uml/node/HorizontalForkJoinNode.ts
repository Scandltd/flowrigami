import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import NodeShape from '@app/flow/diagram/NodeShape';
import { BORDER_RADIUS, styles } from '@app/flow/diagram/uml/node/ForkJoinConstants';
import { UmlNodes } from '@app/flow/diagram/uml/UmlDiagramFactory';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasRectangle from '@app/flow/graphics/canvas/shapes/CanvasRectangle';


export default class HorizontalForkJoinNode extends NodeShape {
  public name = UmlNodes.HorizontalForkJoinNode;

  private rectanglePreview: CanvasRectangle;
  private rectangle: CanvasRectangle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, coordinates: CoordinatePoint, halfWidth?: number, halfHeight?: number) {
    super(canvas, htmlLayer, coordinates);
    const shapeHalfHeight = halfHeight || 3;
    const shapeHalfWidth = halfWidth || 40;

    const rectangleParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: shapeHalfWidth*2,
      height: shapeHalfHeight*2,
      borderRadius: BORDER_RADIUS,
    };

    const rectanglePreviewParams = {
      x: coordinates.x,
      y: coordinates.y,
      width: 50,
      height: shapeHalfHeight*2,
      borderRadius: BORDER_RADIUS,
    };

    this.rectangle = new CanvasRectangle(canvas, htmlLayer, styles, rectangleParams);
    this.rectanglePreview = new CanvasRectangle(canvas, htmlLayer, styles, rectanglePreviewParams);

    this.points = [
      new AnchorPoint(this.ctx, { x: coordinates.x - shapeHalfWidth*3/4, y: coordinates.y }, AnchorPoint.Orientation.TopBottom),
      new AnchorPoint(this.ctx, { x: coordinates.x, y: coordinates.y }, AnchorPoint.Orientation.TopBottom),
      new AnchorPoint(this.ctx, { x: coordinates.x + shapeHalfWidth*3/4, y: coordinates.y }, AnchorPoint.Orientation.TopBottom),
    ];
  }

  public draw() {
    this.rectangle.isHover = this.isHover;
    this.rectangle.isActive = this.isActive;
    this.rectangle.draw();

    if (this.isActive || this.isHover) {
      this.drawPoints();
    }
  }

  private drawPoints() {
    this.points.forEach(point => point.draw());
  }

  public includes(x: number, y: number) {
    const isInRectangle = this.rectangle.includes(x, y);
    const isInConnectionPoint = !!this.getConnectionPoint({ x, y });

    return isInRectangle || isInConnectionPoint;
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
    this.points.forEach(point => point.move(dx, dy));
    this.rectangle.move(dx, dy);
    this.rectanglePreview.move(dx, dy);
  }

  public drawPreview() {
    this.rectanglePreview.draw();
  }

  public previewIncludes(coordinates: CoordinatePoint) {
    return this.rectanglePreview.includes(coordinates.x, coordinates.y);
  }
}
