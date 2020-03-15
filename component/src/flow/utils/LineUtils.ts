import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import * as MathUtils from '@app/flow/utils/MathUtils';


/**
 * Reduce number of points positioned on the same straight line.
 *
 * @param coordinatesList coordinates
 * @returns coordinates
 */
function normalizeOrthogonalLine(coordinatesList: CoordinatePoint[]) {
  let lastValid = coordinatesList[0];
  return coordinatesList.filter((c, i, arr) =>
    !(
      arr[i - 1] &&
      arr[i + 1] &&
      (
        c.x === lastValid.x && c.x === arr[i + 1].x ||
        c.y === lastValid.y && c.y === arr[i + 1].y
      )
    ) && (lastValid = c)
  );
}

/**
 * Build orthogonal line from vector to point.
 *
 * @param vp1 vector initial point
 * @param vp2 vector terminal point
 * @param target target point
 * @param indent minimum length of first segment
 * @returns line coordinates
 */
function buildOrthogonalLineFromVectorToPoint(vp1: CoordinatePoint, vp2: CoordinatePoint, target: CoordinatePoint, indent: number = 0) {
  /*
    find angle of inclination of target point from vector

                target
               *
              /
             / angle
      *————>* — - —>
     vp1   vp2
  */
  const angle = MathUtils.getAngle(vp1, vp2, vp2, target);
  let start = { ...vp1 }, intmd1 = { ...vp2 }, intmd2;
  /*
    if angle is less than 90 degrees project target point onto vector

                      target
                       *
                       |
                       |
      *————>— —*— — — —* — ->
     start   intmd1   intmd2

    otherwise project point onto closest perpendicular to the vector

      target   intmd2
         *— — —*
               |
               |
      *————>— —*— - —>
     start     intmd1
  */
  if ((angle <= 90 && angle >= 0) || (angle < 360 && angle >= 270)) {
    intmd2 = MathUtils.lineProjectPoint(start, intmd1, target);
    return [start, intmd2, target];
  } else {
    const firstSegmentLength = Math.sqrt(Math.pow(intmd1.x - start.x, 2) + Math.pow(intmd1.y - start.y, 2));
    if (firstSegmentLength < indent) {
      intmd1 = MathUtils.extendLine(start, intmd1, indent - firstSegmentLength);
    }
    if (angle < 270 && angle > 180) {
      intmd2 = MathUtils.lineProjectPoint(intmd1, MathUtils.rotatePoint(intmd1, start, 90), target);
    } else {
      intmd2 = MathUtils.lineProjectPoint(intmd1, MathUtils.rotatePoint(intmd1, start, -90), target);
    }
    return [start, intmd1, intmd2, target];
  }
}

/**
 * Build orthogonal line between two vectors.
 *
 * @param v1p1 vector 1 initial point
 * @param v1p2 vector 1 terminal point
 * @param v2p1 vector 2 initial point
 * @param v2p2 vector 2 terminal point
 * @returns line coordinates
 */
function buildOrthogonalLineFromVectorToVector(v1p1: CoordinatePoint, v1p2: CoordinatePoint, v2p1: CoordinatePoint, v2p2: CoordinatePoint) {
  /*
    if vectors vertices form convex polygon build ortho line from first vector to terminal point of the second one

     v2p2 ^\
          | \
          |  \
          |   \
     v2p1  \   \
            \   \
             ————>
          v1p1   v1p2

    otherwise build lines separately to middlepoint
  */
  if (MathUtils.isConvex(v1p1, v2p1, v2p2, v1p2)) {
    return normalizeOrthogonalLine(buildOrthogonalLineFromVectorToPoint(v1p1, v1p2, v2p2).concat(v2p1));
  } else {
    const midpoint = MathUtils.getMidpoint(v1p2, v2p2);
    const section1 = buildOrthogonalLineFromVectorToPoint(v1p1, v1p2, midpoint);
    const section2 = buildOrthogonalLineFromVectorToPoint(v2p1, v2p2, midpoint).reverse();
    return normalizeOrthogonalLine(section1.concat(section2));
  }
}

export function createOrthogonalLine(p1: AnchorPoint, p2: AnchorPoint, indent: number = 0) {
  if (p1.x !== p2.x || p1.y !== p2.y) {
    if (p1.orientation && !p2.orientation) {
      return buildOrthogonalLineFromVectorToPoint(p1, p1.createVector(p2), p2, indent);
    }
    if (!p1.orientation && p2.orientation) {
      return buildOrthogonalLineFromVectorToPoint(p2, p2.createVector(p1), p1, indent);
    }
    if (p1.orientation && p2.orientation) {
      return buildOrthogonalLineFromVectorToVector(p1, p1.createVector(p2, indent), p2, p2.createVector(p1, indent));
    }
    return buildOrthogonalLineFromVectorToPoint(p1, p1.createVector(p2), p2);
  }

  return [p1, p2];
}
