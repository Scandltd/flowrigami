import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import nanoid from 'nanoid';


export default abstract class Link {
  id: string;
  points: AnchorPoint[];
  // @TODO correct way how to link
  // public abstract name: string;
  // from: ConnectionPoint;
  // to: ConnectionPoint;

  isHover = false;
  isActive = false;
  isOrthogonal = false;

  constructor(points: AnchorPoint[]) {
    if (points.length < 2) throw new Error('Link must contain at least 2 points');

    this.id = nanoid();
    this.points = points;
  }

  public abstract clone(): Link;

  public abstract draw(): void;

  public abstract getDetectedPoint(coordinates: Coordinates): AnchorPoint | undefined;

  public abstract includes(coordinates: Coordinates): boolean;

  public abstract move(dx: number, dy: number): void;

  public abstract movePoint(point: AnchorPoint, dx: number, dy: number): void;

  public abstract movePointFinished(point: AnchorPoint): void;

  public abstract onHover(isHover: boolean): void;
}
