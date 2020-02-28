import { SHAPE_LABEL_PADDING, SHAPE_PREVIEW_COLOR, TEXT_NODE_BORDER_COLOR_ACTIVE } from '@app/flow/DefaultThemeConstants';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextParams from '@app/flow/graphics/TextParams';
import TextStyle from '@app/flow/graphics/TextStyle';
import { measureTextLine } from '@app/flow/utils/CanvasUtils';


const TEXT_NODE_BORDER_WIDTH = 2;

const TEXT_NODE_PREVIEW_WIDTH = 40;
const TEXT_NODE_PREVIEW_HEIGHT = 40;

export function getRectangleParams(ctx: CanvasRenderingContext2D, style: TextStyle, params: TextParams) {
  const metrics = measureTextLine(ctx, style, params.text || params.placeholder || '');
  const doublePadding = 2*SHAPE_LABEL_PADDING;
  const width = metrics.width + doublePadding;
  const height = style.lineHeight + doublePadding;

  return {
    x: params.x + width/2,
    y: params.y + SHAPE_LABEL_PADDING,
    width: width,
    height: height,
  };
}

export function getPreviewRectangleParams({ x, y }: CoordinatePoint) {
  return {
    x: x,
    y: y,
    width: TEXT_NODE_PREVIEW_WIDTH,
    height: TEXT_NODE_PREVIEW_HEIGHT,
  };
}


export const styles: ShapeStyle = {
  border: {
    color: TEXT_NODE_BORDER_COLOR_ACTIVE,
    style: 'solid',
    width: TEXT_NODE_BORDER_WIDTH,
  },
};

export const previewStyles: ShapeStyle = {
  border: {
    color: SHAPE_PREVIEW_COLOR,
    style: 'dashed',
    width: TEXT_NODE_BORDER_WIDTH,
  }
};
