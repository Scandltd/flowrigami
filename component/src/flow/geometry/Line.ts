import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export default interface Line {
  from: CoordinatePoint;
  to: CoordinatePoint;
  midPoints: CoordinatePoint[];
}
