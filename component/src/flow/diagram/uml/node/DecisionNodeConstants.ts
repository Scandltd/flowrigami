import {
  DECISION_BACKGROUND_COLOR,
  DECISION_BORDER_COLOR,
  DECISION_BORDER_COLOR_ACTIVE,
  DECISION_BORDER_COLOR_HOVER,
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


const DECISION_NODE_WIDTH = 60;
const DECISION_NODE_HEIGHT = 60;
const DECISION_NODE_BORDER_RADIUS = 7;


export const getRhombusParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  width: DECISION_NODE_WIDTH,
  height: DECISION_NODE_HEIGHT,
  borderRadius: DECISION_NODE_BORDER_RADIUS,
});

export const getSelectionRhombusParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  width: DECISION_NODE_WIDTH + SHAPE_SELECTION_MARGIN,
  height: DECISION_NODE_HEIGHT + SHAPE_SELECTION_MARGIN,
  borderRadius: DECISION_NODE_BORDER_RADIUS,
});

export const getPreviewRhombusParams = ({ x, y }: CoordinatePoint) => ({
  x: x,
  y: y,
  width: 40,
  height: 40,
  borderRadius: DECISION_NODE_BORDER_RADIUS,
});

export const getTextParams = (params: NodeParams) => {
  const [top, right, bottom, left] = getAnchorPoints({ x: params.x, y: params.y });
  return {
    text: params.label || '',
    x: 0.5*(bottom.x + right.x),
    y: bottom.y,
    maxWidth: SHAPE_LABEL_WIDTH,
    maxHeight: SHAPE_LABEL_HEIGHT,
  };
};

export const getAnchorPoints = ({ x, y }: CoordinatePoint) => ([
  { x, y: y - DECISION_NODE_HEIGHT/2 },
  { x: x + DECISION_NODE_WIDTH/2, y },
  { x, y: y + DECISION_NODE_HEIGHT/2 },
  { x: x - DECISION_NODE_WIDTH/2, y },
]);


export const styles: ShapeStyle = {
  background: {
    color: DECISION_BACKGROUND_COLOR,
  },
  border: {
    color: DECISION_BORDER_COLOR,
    style: 'solid',
    width: SHAPE_BORDER_WIDTH,
  }
};
styles.hover = {
  background: styles.background,
  border: {
    ...styles.border!,
    color: DECISION_BORDER_COLOR_HOVER,
  },
};
styles.active = {
  background: styles.background,
  border: {
    ...styles.border!,
    color: DECISION_BORDER_COLOR_ACTIVE,
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
    color: DECISION_BORDER_COLOR_HOVER
  }
};
