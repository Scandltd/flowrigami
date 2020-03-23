import { SHAPE_LABEL_PADDING } from '@app/flow/DefaultThemeConstants';
import ShapeStyle, { BorderStyle } from '@app/flow/graphics/ShapeStyle';
import TextParams from '@app/flow/graphics/TextParams';
import TextStyle from '@app/flow/graphics/TextStyle';
import { wrapText } from '@app/flow/utils/CanvasTextUtils';


export function drawPath2D(ctx: CanvasRenderingContext2D, path2D: Path2D, style: ShapeStyle) {
  ctx.save();

  if (style.background) {
    ctx.fillStyle = style.background.color;
    ctx.fill(path2D);
  }

  if (style.border) {
    ctx.lineWidth = style.border.width;
    ctx.strokeStyle = style.border.color;
    ctx.setLineDash(getLineDash(style.border.style));
    ctx.stroke(path2D);
  }

  ctx.restore();
}

function getLineDash(borderStyle: BorderStyle) {
  let lineDash: number[];
  if (borderStyle === 'dotted') {
    lineDash = [2, 8];
  } else if (borderStyle === 'dashed') {
    lineDash = [10, 10];
  } else if (borderStyle === 'longDashed') {
    lineDash = [15, 3];
  } else if (borderStyle === 'solid') {
    lineDash = [];
  } else {
    lineDash = borderStyle;
  }
  return lineDash;
}

export function drawText(ctx: CanvasRenderingContext2D, style: TextStyle, params: TextParams) {
  const x = params.x + (style.align === 'center' ? 0 : SHAPE_LABEL_PADDING);
  const y = params.y + (style.verticalAlign === 'middle' ? style.fontSize/10 : (style.fontSize/5 + SHAPE_LABEL_PADDING));
  const maxWidth = params.maxWidth ? params.maxWidth - 2*SHAPE_LABEL_PADDING : params.maxWidth;
  const maxHeight = params.maxHeight ? params.maxHeight - 2*SHAPE_LABEL_PADDING : params.maxHeight;

  const textLines = wrapText(ctx, style, params.text || params.placeholder || '', maxWidth, maxHeight);
  const textLinesLength = textLines.length > 3 ? 3 : textLines.length;

  const verticalAlignmentCorrection = style.verticalAlign === 'middle' ? -style.lineHeight*(textLinesLength - 1)/2 : 0;

  textLines.forEach((it, i) => {
    drawTextLine(ctx, style, it, x, y + verticalAlignmentCorrection + i*style.lineHeight);
  });
}

export function drawTextLine(ctx: CanvasRenderingContext2D, style: TextStyle, text: string, x: number, y: number) {
  withTextStyles(ctx, style, () => {
    const background = style.background;
    if (background) {
      ctx.fillStyle = background.color;
      ctx.fillText(text, x, y);
    }

    const border = style.border;
    if (border) {
      ctx.lineWidth = border.width;
      ctx.strokeStyle = border.color;
      ctx.setLineDash(getLineDash(border.style));
      ctx.strokeText(text, x, y);
    }
  });
}

export function measureText(ctx: CanvasRenderingContext2D, style: TextStyle, params: TextParams) {
  const x = params.x;
  const y = params.y + (style.verticalAlign === 'middle' ? -style.lineHeight/2 : 0);
  const maxWidth = params.maxWidth ? params.maxWidth - 2*SHAPE_LABEL_PADDING : params.maxWidth;
  const maxHeight = params.maxHeight ? params.maxHeight - 2*SHAPE_LABEL_PADDING : params.maxHeight;

  const textLines = wrapText(ctx, style, params.text || params.placeholder || '', maxWidth, maxHeight);
  const textHeight = textLines.length*style.lineHeight;
  const widthList = textLines.map((it) => measureTextLine(ctx, style, it).width);
  if (maxWidth) {
    widthList.push(maxWidth);
  }

  const width = Math.max(...widthList);
  const height = maxHeight ? Math.max(maxHeight, textHeight) : textHeight;
  return {
    x, y, width, height
  }
}

export function measureTextLine(ctx: CanvasRenderingContext2D, style: TextStyle, text: string) {
  let measurement = ctx.measureText(text);
  withTextStyles(ctx, style, () => {
    measurement = ctx.measureText(text);
  });
  return measurement;
}

export function isPointInText(ctx: CanvasRenderingContext2D, style: TextStyle, params: TextParams, x: number, y: number) {
  let result = false;

  withTextStyles(ctx, style, () => {
    const metrics = ctx.measureText(params.text || params.placeholder || '');
    const width = Math.min(params.maxWidth || 0, metrics.width);
    const height = style.fontSize;

    const path2D = new Path2D();
    const topLeftX = calculateTextLeftTopX(ctx.textAlign, params.x, width);
    const topLeftY = calculateTextLeftTopY(ctx.textBaseline, params.y, height);
    path2D.rect(topLeftX, topLeftY, width, height);

    result = ctx.isPointInPath(path2D, x, y);
  });

  return result;
}

function withTextStyles(ctx: CanvasRenderingContext2D, style: TextStyle, callback: () => void) {
  ctx.save();

  ctx.font = `${style.fontSize}px ${style.fontName}`;
  ctx.textAlign = style.align;
  ctx.textBaseline = style.verticalAlign;

  callback();

  ctx.restore();
}

function calculateTextLeftTopX(textAlign: CanvasTextAlign, x: number, width: number) {
  if (textAlign === 'center') {
    return x - width/2;
  } else if (textAlign === 'end' || textAlign === 'right') {
    return x - width;
  } else {
    return x;
  }
}

function calculateTextLeftTopY(textBaseLine: CanvasTextBaseline, y: number, height: number) {
  if (textBaseLine === 'middle') {
    return y - height/2;
  } else if (textBaseLine === 'bottom' || textBaseLine === 'alphabetic') {
    return y - height;
  } else {
    return y;
  }
}
