import { LINE_HEIGHT } from '@app/flow/DefaultThemeConstants';
import TextStyle from '@app/flow/graphics/TextStyle';
import { measureTextLine } from '@app/flow/utils/CanvasUtils';


export function wrapText(ctx: CanvasRenderingContext2D, style: TextStyle, text: string, maxWidth: number = Infinity, maxHeight: number = Infinity) {
  const result = [];
  const maxRows = Math.trunc(maxHeight/LINE_HEIGHT);

  const textLines = splitByNewLine(text);
  for (let i = 0; i < textLines.length; i++) {
    const textLine = textLines[i];
    const wrappedTextLines = wrapTextLine(ctx, style, textLine, maxWidth);
    for (let j = 0; j < wrappedTextLines.length && result.length < maxRows; j++) {
      result.push(wrappedTextLines[j]);
    }
  }

  return result;
}

function splitByNewLine(text: string) {
  return text.split(/\r\n|\r|\n/g);
}

function wrapTextLine(ctx: CanvasRenderingContext2D, style: TextStyle, text: string, maxWidth: number = Infinity) {
  const result = [];

  let line = '';
  for (let i = 0; i < text.length; i++) {
    const currentSymbol = text[i];
    const nextLine = line + currentSymbol;
    const nextLineMetrics = measureTextLine(ctx, style, nextLine);
    const nextLineWidth = nextLineMetrics.width;

    if (nextLineWidth > maxWidth) {
      result.push(line);
      line = currentSymbol;
    } else {
      line = nextLine;
    }
  }
  result.push(line);

  return result;
}

function wrapTextLineByWords(ctx: CanvasRenderingContext2D, style: TextStyle, text: string, maxWidth: number = Infinity) {
  const result = [];
  const words = text.split(' ');

  let line = '';
  for (let i = 0; i < words.length; i++) {
    const nextLine = line + words[i] + ' ';
    const nextLineMetrics = measureTextLine(ctx, style, nextLine);
    const nextLineWidth = nextLineMetrics.width;

    if (nextLineWidth > maxWidth && i > 0) {
      result.push(line);

      line = words[i] + ' ';
    } else {
      line = nextLine;
    }
  }
  result.push(line);

  return result;
}
