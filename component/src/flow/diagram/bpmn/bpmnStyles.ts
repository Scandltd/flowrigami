import ShapeStyle from '@app/flow/graphics/ShapeStyle';


export const CIRCLE_RADIUS = 20;
export const PREVIEW_RADIUS = 18;


export const bpmnStyles = {
  base: {
    border: {
      width: 1,
      color: `rgba(137, 137, 137, 1)`,
      style: 'solid',
    }
  } as ShapeStyle,
  hover: {
    border: {
      width: 1,
      color: `rgba(0, 0, 0, 1)`,
      style: 'solid',
    }
  } as ShapeStyle,
  active: {
    border: {
      width: 1,
      color: `rgba(0, 0, 0, 1)`,
      style: 'solid',
    }
  } as ShapeStyle,
  preview: {
    border: {
      width: 1,
      color: `rgba(137, 137, 137, 1)`,
      style: 'solid',
    }
  } as ShapeStyle,
  previewHover: {
    border: {
      width: 1,
      color: `rgba(0, 0, 0, 1)`,
      style: 'solid',
    }
  } as ShapeStyle,
};

export const dotStyles = {
  base: {
    background: {
      color: 'rgba(137, 137, 137, 1)'
    }
  } as ShapeStyle,
  active: {
    background: {
      color: 'rgba(0, 0, 0, 1)'
    }
  } as ShapeStyle,
  hover: {
    background: {
      color: 'rgba(0, 0, 0, 1)'
    }
  } as ShapeStyle,
  preview: {
    background: {
      color: 'rgba(137, 137, 137, 1)'
    }
  } as ShapeStyle,
  previewHover: {
    background: {
      color: 'rgba(0, 0, 0, 1)'
    }
  } as ShapeStyle,
};
