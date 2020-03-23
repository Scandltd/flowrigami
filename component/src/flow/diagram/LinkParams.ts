import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export default interface LinkParams {
  id?: string;
  from: CoordinatePoint;
  to: CoordinatePoint;
  points?: CoordinatePoint[];
}

