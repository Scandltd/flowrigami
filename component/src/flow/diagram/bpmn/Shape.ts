import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export default abstract class Shape {
  public isActive = false;

  public abstract draw(styles: any): void;

  public abstract includes(coordinates: CoordinatePoint): boolean;

  public abstract move(dx: number, dy: number): void;
}
