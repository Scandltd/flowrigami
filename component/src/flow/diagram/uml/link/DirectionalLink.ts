import AnchorPoint from '@app/flow/diagram/AnchorPoint';
import Link from '@app/flow/diagram/Link';
import Coordinates from '@app/flow/graphics/canvas/Coordinates';
import CanvasLine from '@app/flow/graphics/canvas/shapes/CanvasLine';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import { createOrthogonalLine } from '@app/flow/utils/LineUtils';


const INDENT = 20;
const ARROW_LENGTH = 8;

const styles: ShapeStyle = {
  border: {
    width: 2,
    color: 'rgba(83, 83, 83, 0.7)',
    style: 'solid',
  },
};

export default class DirectionalLink extends Link {
  private ctx: CanvasRenderingContext2D;

  private arrow: CanvasLine;
  private line: CanvasLine;
  private inflectionPoints: AnchorPoint[];

  constructor(ctx: CanvasRenderingContext2D, points: AnchorPoint[], isOrthogonal: boolean = true) {
    super(points);
    this.ctx = ctx;
    this.inflectionPoints = [];

    if (isOrthogonal) {
      this.setOrthogonal(isOrthogonal);
      this.applyOrthogonality();
    }

    const canvas = ctx.canvas;
    const tmpHookDiv = document.createElement('div');
    this.line = new CanvasLine(canvas, tmpHookDiv, styles, this.createLineParams(this.points));
    this.arrow = new CanvasLine(canvas, tmpHookDiv, styles, this.createArrowParams(this.points));
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
    this.arrow.line.from = arrowParams.from;
    this.arrow.line.midPoints = arrowParams.midPoints;
    this.arrow.line.to = arrowParams.to;

    const lineParams = this.createLineParams(this.points);
    this.line.line.from = lineParams.from;
    this.line.line.midPoints = lineParams.midPoints;
    this.line.line.to = lineParams.to;

    this.arrow.draw();
    this.line.draw();

    if (this.isHover || this.isActive) {
      // @TODO remove when snap_to_grid works well
      this.updateInflectionPoints();

      this.inflectionPoints.forEach(point => point.draw());
      this.points.forEach(point => point.draw());
    }
  }

  public includes(coordinates: Coordinates) {
    return this.line.includes(coordinates.x, coordinates.y);
  }

  public applyOrthogonality = () => {
    this.points = this.createOrthogonalPoints();
    this.inflectionPoints = this.createInflectionPoints();
  };

  public setOrthogonal(isOrthogonal: boolean) {
    if (this.isOrthogonal && !isOrthogonal) {
      this.isOrthogonal = isOrthogonal;
      this.points[0].removeEventListener('move', this.applyOrthogonality);
      this.points[this.points.length - 1].removeEventListener('move', this.applyOrthogonality);
    }
    if (!this.isOrthogonal && isOrthogonal) {
      this.isOrthogonal = isOrthogonal;
      this.points[0].addEventListener('move', this.applyOrthogonality);
      this.points[this.points.length - 1].addEventListener('move', this.applyOrthogonality);
    }
  }

  public onHover(isHover: boolean) {
    this.isHover = isHover;
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

      points.push(new AnchorPoint(this.ctx, new Coordinates(mediumX, mediumY)));
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

  public getDetectedPoint(coordinates: Coordinates) {
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
        this.setOrthogonal(false);
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

  // @TODO it must be clarified how to clone link
  public clone() {
    return new DirectionalLink(this.ctx, this.points.map(point => point.clone()));
  }
}
