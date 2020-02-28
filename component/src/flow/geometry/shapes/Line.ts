import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export interface LineParams {
  from: CoordinatePoint;
  to: CoordinatePoint;
  midPoints?: CoordinatePoint[];
  borderRadius?: number;
}

export default class Line {
  from: CoordinatePoint;
  to: CoordinatePoint;
  midPoints: CoordinatePoint[];
  borderRadius: number;

  constructor({ from, to, midPoints = [], borderRadius = 0 }: LineParams) {
    this.from = from;
    this.to = to;
    this.midPoints = midPoints;
    this.borderRadius = borderRadius;
  }
}
