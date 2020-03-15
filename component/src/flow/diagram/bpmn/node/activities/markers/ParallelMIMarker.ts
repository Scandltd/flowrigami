import Coordinates from '@app/flow/diagram/bpmn/Coordinates';
import Shape from '@app/flow/diagram/bpmn/Shape';
import { drawPath2D } from '@app/flow/utils/CanvasUtils';


export default class SequentialMIMarker extends Shape {
  coordinates: Coordinates;


  private ctx: CanvasRenderingContext2D;

  private halfWidth: number;
  private halfHeight: number;


  constructor(ctx: CanvasRenderingContext2D, coordinates: Coordinates, halfHeight: number, halfWidth: number) {
    super();
    this.coordinates = coordinates;
    this.halfHeight = halfHeight;
    this.halfWidth = halfWidth;

    this.ctx = ctx;
  }

  public draw(styles: any) {
    drawPath2D(this.ctx, this.createFigurePath(), styles);
  }

  public move(dx: number, dy: number) {
    this.coordinates.move(dx, dy);
  }


  public includes(coordinates: Coordinates) {
    return this.ctx.isPointInPath(this.createFigurePath(), coordinates.x, coordinates.y);
  }

  private createFigurePath() {
    const path = new Path2D();
    path.moveTo(this.coordinates.x - this.halfWidth, this.coordinates.y - this.halfHeight);
    path.lineTo(this.coordinates.x + this.halfWidth, this.coordinates.y - this.halfHeight);
    path.moveTo(this.coordinates.x - this.halfWidth, this.coordinates.y);
    path.lineTo(this.coordinates.x + this.halfWidth, this.coordinates.y);
    path.moveTo(this.coordinates.x - this.halfWidth, this.coordinates.y + this.halfHeight);
    path.lineTo(this.coordinates.x + this.halfWidth, this.coordinates.y + this.halfHeight);
    return path;
  }
}
