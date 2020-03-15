import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';


export default abstract class Link extends CanvasShape {
  public points: AnchorPoint[];
  // @TODO check is this necessary
  public isOrthogonal = false;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, points: AnchorPoint[]) {
    super(canvas, htmlLayer);

    this.points = points;
  }

  public abstract draw(): void;

  public abstract getDetectedPoint(coordinates: CoordinatePoint): AnchorPoint | undefined;

  public abstract includes(x: number, y: number): boolean;

  public abstract move(dx: number, dy: number): void;

  public abstract movePoint(point: AnchorPoint, dx: number, dy: number): void;

  public abstract movePointFinished(point: AnchorPoint): void;

  public abstract onHover(isHover: boolean): void;
}
