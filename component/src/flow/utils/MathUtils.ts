import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Rectangle from '@app/flow/geometry/Rectangle';


export function calculateRoundingShift(corner: CoordinatePoint, point1: CoordinatePoint, point2: CoordinatePoint, radius: number) {
  const angle = Math.atan2(corner.y - point1.y, corner.x - point1.x) - Math.atan2(corner.y - point2.y, corner.x - point2.x);
  const curvedSection = radius/Math.abs(Math.tan(angle/2));

  return Math.sqrt(radius**2 + curvedSection**2) - radius;
}

export function belongsToLine(point: CoordinatePoint, from: CoordinatePoint, to: CoordinatePoint) {
  // https://stackoverflow.com/a/907491/5177605
  // check whether the determinant of the matrix {{to.x - from.x, to.y - from.y}, {point.x - from.x, point.y - from.y}} is close to 0
  const determinant = (to.x - from.x)*(point.y - from.y) - (to.y - from.y)*(point.x - from.x);
  const lineLength = Math.sqrt((from.x - to.x)**2 + (from.y - to.y)**2);
  return Math.abs(determinant) < lineLength*5;
}

export function belongsToRectangle(point: CoordinatePoint, rectangle: Rectangle) {
  const from = { x: rectangle.x - 0.5*rectangle.width, y: rectangle.y - 0.5*rectangle.height };
  const to = { x: from.x + rectangle.width, y: from.y + rectangle.height };

  return (from.x <= point.x) && (point.x <= to.x) && (from.y <= point.y) && (point.y <= to.y);
}


/**
 * Adopted algorithm for detecting convex shape of simple polygons.
 * See {@link https://stackoverflow.com/a/25304159 }
 *
 * @param vertices polygon vertices in either clockwise or counter-clockwise order
 * @returns if convex
 */
export function isConvex(...vertices: CoordinatePoint[]): boolean {
  if (vertices.length >= 4) {
    const n = vertices.length;
    let sign = false;

    for (let i = 0; i < n; i++) {
      const dx1 = vertices[(i + 2)%n].x - vertices[(i + 1)%n].x;
      const dy1 = vertices[(i + 2)%n].y - vertices[(i + 1)%n].y;
      const dx2 = vertices[i].x - vertices[(i + 1)%n].x;
      const dy2 = vertices[i].y - vertices[(i + 1)%n].y;
      const zcrossproduct = dx1*dy2 - dy1*dx2;

      if (i === 0) {
        sign = zcrossproduct > 0;
      } else if (sign !== (zcrossproduct > 0)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Calculate angle between lines.
 * Source line is rotated clockwise for system where x-axis oriented from left to right and y-axis oriented from bottom to top.
 *
 * @param originStart origin line start point
 * @param originEnd origin line end point
 * @param sourceStart rotation line start point
 * @param sourceEnd rotation line end point
 * @returns angle in degrees
 */
export function getAngle(originStart: CoordinatePoint, originEnd: CoordinatePoint, sourceStart: CoordinatePoint, sourceEnd: CoordinatePoint) {
  const angle =
    (Math.atan2(sourceEnd.y - sourceStart.y, sourceEnd.x - sourceStart.x) -
      Math.atan2(originEnd.y - originStart.y, originEnd.x - originStart.x))*180/Math.PI;

  return angle < 0 ? 360 + angle : angle;
}

/**
 * Rotate point around origin by specified angle.
 *
 * @param originPoint origin point
 * @param rotatePoint rotation point
 * @param angle angle in degrees
 * @returns rotated point
 */
export function rotatePoint(originPoint: CoordinatePoint, rotatePoint: CoordinatePoint, angle: number) {
  const radians = (Math.PI/180)*angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: Math.round((cos*(rotatePoint.x - originPoint.x)) + (sin*(rotatePoint.y - originPoint.y)) + originPoint.x),
    y: Math.round((cos*(rotatePoint.y - originPoint.y)) + (sin*(rotatePoint.x - originPoint.x)) + originPoint.y)
  };
}

/**
 * Project point to a line.
 * See {@link http://www.sunshine2k.de/coding/java/PointOnLine/PointOnLine.html } for algorithm reference.
 *
 * @param p1 line start point
 * @param p2 line end point
 * @param target point to project
 * @return projected point coordinates
 */
export function lineProjectPoint(p1: CoordinatePoint, p2: CoordinatePoint, target: CoordinatePoint) {
  const e1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  const e2 = { x: target.x - p1.x, y: target.y - p1.y };

  const valDp = e1.x*e2.x + e1.y*e2.y;
  const len2 = e1.x*e1.x + e1.y*e1.y;

  return {
    x: Math.round(p1.x + (valDp*e1.x)/len2),
    y: Math.round(p1.y + (valDp*e1.y)/len2),
  };
}

export function getMidpoint(p1: CoordinatePoint, p2: CoordinatePoint) {
  return { x: p2.x + (p1.x - p2.x)*0.5, y: p2.y + (p1.y - p2.y)*0.5 };
}

export function extendLine(p1: CoordinatePoint, p2: CoordinatePoint, extension: number) {
  const dx = (p2.x - p1.x)/Math.sqrt((Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));
  const dy = (p2.y - p1.y)/Math.sqrt((Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));

  return { x: p2.x + dx*extension, y: p2.y + dy*extension };
}
