import {
  END_NODE_BACKGROUND_COLOR,
  END_NODE_BORDER_COLOR,
  END_NODE_BORDER_COLOR_ACTIVE,
  END_NODE_BORDER_COLOR_HOVER,
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


const CIRCLE_RADIUS = 20;
const DOT_RADIUS = 12;
const PREVIEW_CIRCLE_RADIUS = 18;
const PREVIEW_DOT_RADIUS = 11;

export const getCircleParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  radius: CIRCLE_RADIUS
});

export const getCirclePreviewParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  radius: PREVIEW_CIRCLE_RADIUS
});

export const getCircleSelectionParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  radius: CIRCLE_RADIUS + SHAPE_SELECTION_MARGIN/2,
});

export const getDotParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  radius: DOT_RADIUS
});

export const getDotPreviewParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  radius: PREVIEW_DOT_RADIUS
});

export const getTextParams = (params: NodeParams) => ({
  text: params.label || '',
  x: params.x + 0.5*CIRCLE_RADIUS,
  y: params.y + 1.5*CIRCLE_RADIUS,
  maxWidth: SHAPE_LABEL_WIDTH,
  maxHeight: SHAPE_LABEL_HEIGHT,
});

export const getAnchorPoints = ({ x, y }: CoordinatePoint) => ([
  { x: x, y: y - CIRCLE_RADIUS },
  { x: x + CIRCLE_RADIUS, y: y },
  { x: x, y: y + CIRCLE_RADIUS },
  { x: x - CIRCLE_RADIUS, y: y },
]);


export const styles: ShapeStyle = {
  background: {
    color: END_NODE_BACKGROUND_COLOR,
  },
  border: {
    color: END_NODE_BORDER_COLOR,
    style: 'solid',
    width: SHAPE_BORDER_WIDTH,
  }
};
styles.hover = {
  ...styles,
  border: {
    ...styles.border!,
    color: END_NODE_BORDER_COLOR_HOVER,
  },
};
styles.active = {
  ...styles,
  border: {
    ...styles.border!,
    color: END_NODE_BORDER_COLOR_ACTIVE,
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
    color: END_NODE_BORDER_COLOR_HOVER
  }
};


export const dotStyle: ShapeStyle = {
  background: {
    color: END_NODE_BORDER_COLOR
  }
};

export const dotPreviewStyle: ShapeStyle = {
  background: {
    color: SHAPE_PREVIEW_COLOR
  }
};
dotPreviewStyle.hover = {
  background: {
    color: END_NODE_BORDER_COLOR
  }
};
