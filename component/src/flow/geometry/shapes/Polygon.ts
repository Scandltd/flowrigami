import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export interface PolygonParams {
  points: CoordinatePoint[];
  borderRadius?: number;
}

export default class Polygon {
  points: CoordinatePoint[];
  borderRadius: number;

  constructor({ points, borderRadius = 0 }: PolygonParams) {
    this.points = points;
    this.borderRadius = borderRadius;
  }
}
