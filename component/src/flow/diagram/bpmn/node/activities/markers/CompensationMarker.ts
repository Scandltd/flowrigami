import Shape from '@app/flow/diagram/bpmn/Shape';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


export default class CompensationMarker extends Shape {
  coordinates: Coordinates;


  private ctx: CanvasRenderingContext2D;

  private halfHeight: number;
  private halfWidth: number;

  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, halfHeight: number, halfWidth: number) {
    super();
    this.coordinates = coordinates;
    this.halfHeight = halfHeight;
    this.halfWidth = halfWidth;
    this.ctx = ctx;
  }

  public draw(styles: any) {
    drawPath2D(this.ctx, this.createPath(), styles);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
  }

  public includes(coordinates: Coordinates) {
    return this.ctx.isPointInPath(this.createPath(), coordinates.x, coordinates.y);
  }

  private createPath() {
    const path = new Path2D();
    path.moveTo(this.coordinates.x - this.halfWidth, this.coordinates.y);
    path.lineTo(this.coordinates.x, this.coordinates.y - this.halfHeight);
    path.lineTo(this.coordinates.x, this.coordinates.y);
    path.lineTo(this.coordinates.x + this.halfWidth, this.coordinates.y - this.halfHeight);
    path.lineTo(this.coordinates.x + this.halfWidth, this.coordinates.y + this.halfHeight);
    path.lineTo(this.coordinates.x, this.coordinates.y);
    path.lineTo(this.coordinates.x, this.coordinates.y + this.halfHeight);
    path.lineTo(this.coordinates.x - this.halfWidth, this.coordinates.y);
    return path;
  }
}
