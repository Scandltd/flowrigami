import ShapeStyle from '@app/flow/graphics/ShapeStyle';


const BORDER_WIDTH = 1;
export const BORDER_RADIUS = 10;
export const SELECTION_MARGIN = 10;

const COLOR = 'rgba(137, 137, 137, 1)';
const COLOR_HOVER = 'rgba(0, 0, 0, 1)';
const COLOR_ACTIVE = 'rgba(0, 0, 0, 1)';
const TEXT_COLOR = 'rgba(58, 58, 58, 1)';


export const styles = {
  border: {
    color: COLOR,
    style: 'solid',
    width: BORDER_WIDTH,
  }
} as ShapeStyle;

styles.hover = {
  border: {
    ...styles.border!,
    color: COLOR_HOVER,
  },
};
styles.active = {
  border: {
    ...styles.border!,
    color: COLOR_ACTIVE,
  },
};

export const selectionStyle = {
  border: {
    color: 'rgba(55, 56, 89, 1)',
    style: 'longDashed',
    width: 1,
  },
} as ShapeStyle;

export const previewStyles = {
  border: {
    color: 'rgba(137, 137, 137, 1)',
    style: 'solid',
    width: BORDER_WIDTH,
  }
} as ShapeStyle;

previewStyles.hover = {
  border: {
    ...previewStyles.border!,
    color: COLOR_HOVER
  }
};


const textStyle = {
  background: {
    color: TEXT_COLOR,
  },
} as ShapeStyle;

export const textStyles = {
  base: textStyle,
  hover: textStyle,
  active: textStyle,
  preview: textStyle,
};
