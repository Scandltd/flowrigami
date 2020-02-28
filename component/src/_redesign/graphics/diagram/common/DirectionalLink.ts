import CanvasLine from '@app/_redesign/graphics/canvas/shapes/CanvasLine';
import Link from '@app/_redesign/graphics/diagram/Link';
import { LINE_COLOR, LINE_WIDTH } from '@app/flow/DefaultThemeConstants';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';


const BORDER_RADIUS = 10;

const directionalLinkStyles = {
  border: {
    width: LINE_WIDTH,
    color: LINE_COLOR,
    style: 'solid',
  },
} as ShapeStyle;

type DirectionalLinkParams = {
  from: CoordinatePoint;
  to: CoordinatePoint;
  midPoints?: CoordinatePoint[];
}

export default class DirectionalLink extends Link {
  public name = 'DirectionalLink';

  private line: CanvasLine;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: DirectionalLinkParams) {
    super(canvas, htmlLayer);

    const lineParams = {
      from: params.from,
      to: params.to,
      midPoints: params.midPoints || [],
      borderRadius: BORDER_RADIUS,
    };
    this.line = new CanvasLine(canvas, htmlLayer, lineParams, directionalLinkStyles);
  }

  public draw() {
    this.line.draw();
  }

  public includes(x: number, y: number) {
    return false;
  }
}
