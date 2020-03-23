import ShapeStyle from '@app/flow/graphics/ShapeStyle';


export const BORDER_RADIUS = 3;

const BACKGROUND_COLOR = 'rgba(137, 137, 137, 1)';
const BACKGROUND_COLOR_HOVER = 'rgba(83, 83, 83, 1)';
const BACKGROUND_COLOR_ACTIVE = 'rgba(83, 83, 83, 1)';

export const styles: ShapeStyle = {
  background: {
    color: BACKGROUND_COLOR,
  },
  hover: {
    background: {
      color: BACKGROUND_COLOR_HOVER,
    },
  },
  active: {
    background: {
      color: BACKGROUND_COLOR_ACTIVE,
    },
  },
};
