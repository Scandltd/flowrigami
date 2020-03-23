import { SHAPE_LABEL_STYLE } from '@app/flow/DefaultTheme';
import {
  ACTIVITY_BACKGROUND_COLOR,
  ACTIVITY_BORDER_COLOR,
  ACTIVITY_BORDER_COLOR_ACTIVE,
  ACTIVITY_BORDER_COLOR_HOVER,
  SHAPE_BORDER_WIDTH,
  SHAPE_LABEL_HEIGHT,
  SHAPE_LABEL_WIDTH,
  SHAPE_PREVIEW_BACKGROUND_COLOR,
  SHAPE_PREVIEW_COLOR,
  SHAPE_SELECTION_MARGIN
} from '@app/flow/DefaultThemeConstants';
import NodeParams from '@app/flow/diagram/NodeParams';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextStyle from '@app/flow/graphics/TextStyle';


const ACTIVITY_NODE_WIDTH = 120;
const ACTIVITY_NODE_HEIGHT = 60;
const ACTIVITY_NODE_BORDER_RADIUS = 10;

const ACTIVITY_NODE_PREVIEW_WIDTH = 60;
const ACTIVITY_NODE_PREVIEW_HEIGHT = 40;

export function getRectangleParams({ x, y }: CoordinatePoint) {
  return {
    x,
    y,
    width: ACTIVITY_NODE_WIDTH,
    height: ACTIVITY_NODE_HEIGHT,
    borderRadius: ACTIVITY_NODE_BORDER_RADIUS
  };
}

export function getSelectionRectangleParams({ x, y }: CoordinatePoint) {
  return {
    x,
    y,
    width: ACTIVITY_NODE_WIDTH + SHAPE_SELECTION_MARGIN,
    height: ACTIVITY_NODE_HEIGHT + SHAPE_SELECTION_MARGIN,
    borderRadius: ACTIVITY_NODE_BORDER_RADIUS
  };
}

export function getPreviewRectangleParams({ x, y }: CoordinatePoint) {
  return {
    x: x,
    y: y,
    width: ACTIVITY_NODE_PREVIEW_WIDTH,
    height: ACTIVITY_NODE_PREVIEW_HEIGHT,
    borderRadius: ACTIVITY_NODE_BORDER_RADIUS
  };
}

export const getTextParams = (params: NodeParams) => ({
  text: params.label || '',
  x: params.x,
  y: params.y,
  maxWidth: SHAPE_LABEL_WIDTH,
  maxHeight: SHAPE_LABEL_HEIGHT,
});

export const getAnchorPoints = ({ x, y }: CoordinatePoint) => ([
  { x: x, y: y - ACTIVITY_NODE_HEIGHT/2 },
  { x: x + ACTIVITY_NODE_WIDTH/2, y: y },
  { x: x, y: y + ACTIVITY_NODE_HEIGHT/2 },
  { x: x - ACTIVITY_NODE_WIDTH/2, y: y },
]);


export const styles: ShapeStyle = {
  background: {
    color: ACTIVITY_BACKGROUND_COLOR,
  },
  border: {
    color: ACTIVITY_BORDER_COLOR,
    style: 'solid',
    width: SHAPE_BORDER_WIDTH,
  }
};
styles.hover = {
  background: styles.background,
  border: {
    ...styles.border!,
    color: ACTIVITY_BORDER_COLOR_HOVER,
  },
};
styles.active = {
  background: styles.background,
  border: {
    ...styles.border!,
    color: ACTIVITY_BORDER_COLOR_ACTIVE,
  },
};


export const previewStyles: ShapeStyle = {
  background: {
    color: SHAPE_PREVIEW_BACKGROUND_COLOR,
  },
  border: {
    color: SHAPE_PREVIEW_COLOR,
    style: 'solid',
    width: SHAPE_BORDER_WIDTH,
  }
};
previewStyles.hover = {
  border: {
    ...previewStyles.border!,
    color: ACTIVITY_BORDER_COLOR_HOVER
  }
};

export const ACTIVITY_LABEL_STYLE: TextStyle = {
  ...SHAPE_LABEL_STYLE,
  align: 'center',
  verticalAlign: 'middle',
};
