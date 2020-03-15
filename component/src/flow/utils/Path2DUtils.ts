import Circle from '@app/flow/geometry/Circle';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Line from '@app/flow/geometry/Line';
import Pin from '@app/flow/geometry/Pin';
import Rectangle from '@app/flow/geometry/Rectangle';
import Rhombus from '@app/flow/geometry/Rhombus';
import { calculateRoundingShift } from '@app/flow/utils/MathUtils';


export function createCirclePath2D(circle: Circle) {
  const circlePath2D = new Path2D();
  circlePath2D.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
  return circlePath2D;
}

export function createLinePath2D(line: Line) {
  return createPath([line.from, ...line.midPoints, line.to]);
}

export function createPinPath2D(pinParams: Pin) {
  const radius = pinParams.radius;
  const height = pinParams.height || 1.5*pinParams.radius;
  const x = pinParams.x;
  const y = pinParams.y - (height - radius)/4;

  const pin = new Path2D();
  pin.moveTo(x, y - radius);
  pin.arc(x, y, radius, -Math.PI/2, 0);
  pin.bezierCurveTo(x + radius, y + 0.3*height, x + 0.5*radius, y + 0.7*height, x, y + height);
  pin.bezierCurveTo(x - 0.5*radius, y + 0.7*height, x - radius, y + 0.3*height, x - radius, y);
  pin.arc(x, y, radius, -Math.PI, -Math.PI/2);
  pin.closePath();

  return pin;
}

export function createRectanglePath2D(rectangle: Rectangle) {
  const x = rectangle.x;
  const y = rectangle.y;
  const halfWidth = rectangle.width/2;
  const halfHeight = rectangle.height/2;

  const leftTop = { x: x - halfWidth, y: y + halfHeight };
  const rightTop = { x: x + halfWidth, y: y + halfHeight };
  const rightBottom = { x: x + halfWidth, y: y - halfHeight };
  const leftBottom = { x: x - halfWidth, y: y - halfHeight };

  const borderRadius = rectangle.borderRadius;

  return createClosedPath([leftTop, rightTop, rightBottom, leftBottom], borderRadius);
}

export function createRhombusPath2D(rhombus: Rhombus) {
  const x = rhombus.x;
  const y = rhombus.y;
  const halfWidth = rhombus.width/2;
  const halfHeight = rhombus.height/2;

  const top = { x: x + halfHeight, y: y };
  const right = { x: x, y: y + halfWidth };
  const bottom = { x: x - halfHeight, y: y };
  const left = { x: x, y: y - halfWidth };

  const borderRadius = rhombus.borderRadius;
  if (borderRadius) {
    const roundingShiftHorizontal = calculateRoundingShift(left, bottom, top, borderRadius);
    const roundingShiftVertical = calculateRoundingShift(top, left, right, borderRadius);

    top.x += roundingShiftVertical;
    right.y += roundingShiftHorizontal;
    bottom.x -= roundingShiftVertical;
    left.y -= roundingShiftHorizontal;
  }

  return createClosedPath([top, right, bottom, left], borderRadius);
}

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

export function createPath(points: CoordinatePoint[], radius = 0) {
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
