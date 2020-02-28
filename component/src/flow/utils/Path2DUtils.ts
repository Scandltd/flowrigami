import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';


export function createClosedPath(points: CoordinatePoint[], radius: number) {
  const length = points.length;
  if (length < 3) {
    throw new Error('Failed to create a closed path: 3 or more points must be provided');
  }

  const path = new Path2D();
  path.moveTo((points[0].x + points[length - 1].x)/2, (points[0].y + points[length - 1].y)/2);
  for (let i = 0; i < length; i++) {
    const point = points[i];
    const nextPoint = (i + 1 < length) ? points[i + 1] : points[0];

    path.arcTo(point.x, point.y, (point.x + nextPoint.x)/2, (point.y + nextPoint.y)/2, radius);
  }
  path.closePath();

  return path;
}

export function createPath(points: CoordinatePoint[], radius: number) {
  const length = points.length;
  if (length < 2) {
    throw new Error('Failed to create a path: 2 or more points must be provided');
  }

  const path = new Path2D();
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < length; i++) {
    const prevPoint = points[i - 1];
    const point = points[i];
    path.arcTo(prevPoint.x, prevPoint.y, point.x, point.y, radius);
  }
  path.lineTo(points[length - 1].x, points[length - 1].y);

  return path;
}
