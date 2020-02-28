import {
  FONT_NAME,
  FONT_SIZE,
  LINE_HEIGHT,
  SHAPE_LABEL_COLOR,
  SHAPE_SELECTION_BORDER_WIDTH,
  SHAPE_SELECTION_COLOR
} from '@app/flow/DefaultThemeConstants';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextStyle from '@app/flow/graphics/TextStyle';


export const SHAPE_LABEL_STYLE: TextStyle = {
  fontSize: FONT_SIZE,
  fontName: FONT_NAME,
  lineHeight: LINE_HEIGHT,
  align: 'left',
  verticalAlign: 'top',

  background: {
    color: SHAPE_LABEL_COLOR,
  },
};


export const SHAPE_SELECTION_STYLE: ShapeStyle = {
  border: {
    color: SHAPE_SELECTION_COLOR,
    style: 'longDashed',
    width: SHAPE_SELECTION_BORDER_WIDTH,
  },
};
