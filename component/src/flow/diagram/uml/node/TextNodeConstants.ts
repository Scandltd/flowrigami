import { SHAPE_LABEL_PADDING, SHAPE_PREVIEW_COLOR, TEXT_NODE_BORDER_COLOR_ACTIVE } from '@app/flow/DefaultThemeConstants';
import NodeParams from '@app/flow/diagram/NodeParams';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import Rectangle from '@app/flow/geometry/Rectangle';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextParams from '@app/flow/graphics/TextParams';
import TextStyle from '@app/flow/graphics/TextStyle';
import { measureText } from '@app/flow/utils/CanvasUtils';


const TEXT_NODE_BORDER_WIDTH = 2;

const TEXT_NODE_PREVIEW_WIDTH = 40;
const TEXT_NODE_PREVIEW_HEIGHT = 40;


export const getTextParams = (params: TextParams) => ({
  placeholder: params.placeholder,
  text: params.text,
  x: params.x,
  y: params.y,
});

export function getRectangleParams(ctx: CanvasRenderingContext2D, style: TextStyle, params: TextParams): Rectangle {
  const boundingRect = measureText(ctx, style, params);

  return {
    x: boundingRect.x + 0.5*boundingRect.width + SHAPE_LABEL_PADDING,
    y: boundingRect.y + 0.5*boundingRect.height + SHAPE_LABEL_PADDING,
    width: boundingRect.width + 2*SHAPE_LABEL_PADDING,
    height: boundingRect.height + 2*SHAPE_LABEL_PADDING,
    borderRadius: 0,
  };
}

export function getPreviewRectangleParams({ x, y }: CoordinatePoint): Rectangle {
  return {
    x: x,
    y: y,
    width: TEXT_NODE_PREVIEW_WIDTH,
    height: TEXT_NODE_PREVIEW_HEIGHT,
    borderRadius: 0,
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
