import { LINE_COLOR, LINE_WIDTH } from '@app/flow/DefaultThemeConstants';
import AnchorPoint from '@app/flow/diagram/common/AnchorPoint';
import Link from '@app/flow/diagram/Link';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import CanvasLine from '@app/flow/graphics/canvas/shapes/CanvasLine';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { createOrthogonalLine } from '@app/flow/utils/LineUtils';


const INDENT = 20;
const ARROW_LENGTH = 8;

const styles: ShapeStyle = {
  border: {
    color: LINE_COLOR,
    style: 'solid',
    width: LINE_WIDTH,
  },
};

export default class DirectionalLink extends Link {
  public name = 'DirectionalLink';

  private arrow: CanvasLine;
  private line: CanvasLine;
  private inflectionPoints: AnchorPoint[];

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, points: AnchorPoint[], isOrthogonal: boolean = true) {
    super(canvas, htmlLayer, points);

    this.isOrthogonal = isOrthogonal;
    this.inflectionPoints = [];
    if (isOrthogonal) {
      this.applyOrthogonality();
    }

    this.line = new CanvasLine(canvas, htmlLayer, styles, this.createLineParams(this.points));
    this.arrow = new CanvasLine(canvas, htmlLayer, styles, this.createArrowParams(this.points));
  }

  private createLineParams(points: AnchorPoint[]) {
    const fromPoint = points[0];
    const toPoint = points[points.length - 1];

    return {
      from: { x: fromPoint.x, y: fromPoint.y },
      midPoints: points.slice(1, -1).map((it) => ({ x: it.x, y: it.y })),
      to: { x: toPoint.x, y: toPoint.y },
      borderRadius: 0,
    };
  }

  private createArrowParams(points: AnchorPoint[]) {
    const [from, to] = points.slice(-2).map((it) => ({ x: it.x, y: it.y }));

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const lineAngle = Math.atan2(dy, dx);
    const arrowAngle = Math.PI/4;

    const endCoordinates1 = { x: to.x - ARROW_LENGTH*Math.cos(lineAngle - arrowAngle), y: to.y - ARROW_LENGTH*Math.sin(lineAngle - arrowAngle) };
    const endCoordinates2 = { x: to.x - ARROW_LENGTH*Math.cos(lineAngle + arrowAngle), y: to.y - ARROW_LENGTH*Math.sin(lineAngle + arrowAngle) };

    return {
      from: endCoordinates1,
      midPoints: [to],
      to: endCoordinates2,
    };
  }

  public draw() {
    const arrowParams = this.createArrowParams(this.points);
    this.arrow.updateParams(arrowParams);

    const lineParams = this.createLineParams(this.points);
    this.line.updateParams(lineParams);

    this.arrow.draw();
    this.line.draw();

    if (this.isHover || this.isActive) {
      // @TODO remove when snap_to_grid works well
      this.updateInflectionPoints();

      this.inflectionPoints.forEach(point => point.draw());
      this.points.forEach(point => point.draw());
    }
  }

  public includes(x: number, y: number) {
    return this.line.includes(x, y);
  }

  public onHover(isHover: boolean) {
    this.isHover = isHover;
  }

  public applyOrthogonality() {
    this.points = this.createOrthogonalPoints();
    this.inflectionPoints = this.createInflectionPoints();
  }

  private createOrthogonalPoints() {
    const coordinatesList = createOrthogonalLine(this.points[0], this.points[this.points.length - 1], INDENT);
    return [
      this.points[0],
      ...coordinatesList.slice(1, coordinatesList.length - 1).map((it) => new AnchorPoint(this.ctx, it)),
      this.points[this.points.length - 1]
    ];
  }

  private createInflectionPoints() {
    const points = [];
    for (let i = 1; i < this.points.length; i++) {
      const prevPoint = this.points[i - 1];
      const nextPoint = this.points[i];

      const mediumX = (prevPoint.x + nextPoint.x)/2;
      const mediumY = (prevPoint.y + nextPoint.y)/2;

      points.push(new AnchorPoint(this.ctx, { x: mediumX, y: mediumY }));
    }
    return points;
  }

  private updateInflectionPoints() {
    if (this.inflectionPoints.length + 1 === this.points.length) {
      this.inflectionPoints.forEach((it, i) => {
        const prevPoint = this.points[i];
        const nextPoint = this.points[i + 1];

        const x = (prevPoint.x + nextPoint.x)/2;
        const y = (prevPoint.y + nextPoint.y)/2;
        const dx = x - it.x;
        const dy = y - it.y;

        it.move(dx, dy);
      });
    }
  }

  public getDetectedPoint(coordinates: CoordinatePoint) {
    return this.inflectionPoints.find((point) => point.includes(coordinates)) ||
      this.points.find((point) => point.includes(coordinates));
  }

  public move(dx: number, dy: number) {
    // move only inner points because the first and last points are connected with nodes
    if (!this.isOrthogonal) {
      for (let i = 1; i < this.points.length - 1; i++) {
        this.points[i].move(dx, dy);
      }
    }
  }

  public movePoint(point: AnchorPoint, dx: number, dy: number) {
    point.move(dx, dy);

    const pointIndex = this.points.indexOf(point);
    if (pointIndex === -1) {
      const index = this.inflectionPoints.indexOf(point);
      this.points = [...this.points.slice(0, index + 1), point, ...this.points.slice(index + 1, this.points.length)];
      this.inflectionPoints.splice(index, 1);
    } else if (pointIndex >= 0) {
      this.inflectionPoints = [];

      if (this.isOrthogonal) {
        this.isOrthogonal = false;
      }
    }
  }

  public movePointFinished(point: AnchorPoint) {
    this.filterOverlappedPoint(point);
    this.inflectionPoints = this.createInflectionPoints();
  }

  private filterOverlappedPoint(point: AnchorPoint) {
    const pointIndex = this.points.indexOf(point);
    const prevPoint = this.points[pointIndex - 1];
    const nextPoint = this.points[pointIndex + 1];
    if (prevPoint && prevPoint.includes({ x: point.x, y: point.y }) || nextPoint && nextPoint.includes({ x: point.x, y: point.y })) {
      this.points = this.points.filter((it, i) => it.id !== point.id);
    }
  }
}
