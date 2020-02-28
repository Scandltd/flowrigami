import { SHAPE_LABEL_STYLE } from '@app/flow/DefaultTheme';
import {
  FONT_NAME,
  INDICATOR_DEFAULT_BACKGROUND_COLOR,
  INDICATOR_DEFAULT_COLOR,
  INDICATOR_ERROR_BACKGROUND_COLOR,
  INDICATOR_INFO_BACKGROUND_COLOR,
  INDICATOR_SUCCESS_BACKGROUND_COLOR,
  INDICATOR_WARN_BACKGROUND_COLOR,
  LINE_HEIGHT,
  SHAPE_LABEL_HEIGHT,
  SHAPE_LABEL_WIDTH,
  SHAPE_SELECTION_BORDER_WIDTH
} from '@app/flow/DefaultThemeConstants';
import IndicatorExportObject from '@app/flow/exportimport/IndicatorExportObject';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import CanvasPin from '@app/flow/graphics/canvas/shapes/CanvasPin';
import CanvasText from '@app/flow/graphics/canvas/shapes/CanvasText';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextStyle from '@app/flow/graphics/TextStyle';
import Store from '@app/flow/store/Store';
import { drawTextLine } from '@app/flow/utils/CanvasUtils';
import { shortenNumber } from '@app/flow/utils/NumberUtils';


type IndicatorColorScheme = 'success' | 'info' | 'warn' | 'error';

export function isIndicatorColorScheme(style: any): style is IndicatorColorScheme {
  return ['success', 'info', 'warn', 'error', undefined].includes(style);
}

export type IndicatorParams = {
  x: number;
  y: number;
  radius: number;
};

export default class Indicator extends CanvasShape {
  public name = 'Indicator';

  protected _label: string = '';
  protected _isEditing = false;

  private value: number = 0;
  private colorScheme?: IndicatorColorScheme;
  private params: IndicatorParams;

  private pin: CanvasPin;
  private pinHover: CanvasPin;
  private textEditor: CanvasText;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: IndicatorParams) {
    super(canvas, htmlLayer);
    this.params = params;

    this.pin = new CanvasPin(canvas, htmlLayer, getPinStyle(this.colorScheme), params);
    this.pinHover = new CanvasPin(canvas, htmlLayer, getPinHoverStyle(), { ...params, radius: 1.25*params.radius });

    this.textEditor = new CanvasText(canvas, htmlLayer, {
      text: '',
      x: params.x + 0.5*this.params.radius,
      y: params.y + 1.5*this.params.radius,
      maxWidth: SHAPE_LABEL_WIDTH,
      maxHeight: SHAPE_LABEL_HEIGHT,
    }, SHAPE_LABEL_STYLE);
  }

  public export(): IndicatorExportObject {
    return {
      name: this.name,
      id: this.id,
      label: this.label,
      params: this.params,
    };
  };

  public import(exportObject: IndicatorExportObject) {
    this.id = exportObject.id;
    this.setLabel(exportObject.label);
  }

  public draw() {
    this.pin.draw();
    if (this.isHover) {
      this.pinHover.draw();
    }
    this.drawLabel();

    this.textEditor.isActive = this.isActive;
    if (!this.isEditing) {
      this.textEditor.draw();
    }
  }

  private drawLabel() {
    const { x, y, radius } = this.params;
    const label = shortenNumber(this.value);
    drawTextLine(this.ctx, getPinLabelStyle(radius, this.colorScheme), label, x, y);
  }

  public includes(x: number, y: number) {
    return this.pin.includes(x, y) || this.textEditor.includes(x, y);
  }

  public move(dx: number, dy: number) {
    this.params.x += dx;
    this.params.y += dy;

    this.pin.move(dx, dy);
    this.pinHover.move(dx, dy);
    this.textEditor.move(dx, dy);
  }

  public get isEditing() {
    return this._isEditing;
  }

  public setEditing(isEditing: boolean) {
    this._isEditing = isEditing;
  }

  public get label() {
    return this._label;
  }

  public setLabel(label: string = '') {
    this._label = label;
    this.textEditor.setText(label);
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: number, colorScheme: IndicatorColorScheme) {
    this.colorScheme = colorScheme;
    this.value = Math.trunc(value);

    this.pin.setStyle(getPinStyle(this.colorScheme));
  }

  public renderHtml(parent: HTMLElement, store: Store) {
    this.textEditor.renderHtml(parent, store, this.id, this.isEditing);
  }
}


const INDICATOR_COLOR_SCHEMES = {
  success: {
    color: INDICATOR_DEFAULT_COLOR,
    background: INDICATOR_SUCCESS_BACKGROUND_COLOR,
  },
  info: {
    color: INDICATOR_DEFAULT_COLOR,
    background: INDICATOR_INFO_BACKGROUND_COLOR,
  },
  warn: {
    color: INDICATOR_DEFAULT_COLOR,
    background: INDICATOR_WARN_BACKGROUND_COLOR,
  },
  error: {
    color: INDICATOR_DEFAULT_COLOR,
    background: INDICATOR_ERROR_BACKGROUND_COLOR,
  },
};

function getPinStyle(colorScheme?: IndicatorColorScheme): ShapeStyle {
  const background = colorScheme ? INDICATOR_COLOR_SCHEMES[colorScheme].background : INDICATOR_DEFAULT_BACKGROUND_COLOR;

  return {
    background: {
      color: background,
    },
  };
}

function getPinHoverStyle(): ShapeStyle {
  return {
    border: {
      color: INDICATOR_DEFAULT_BACKGROUND_COLOR,
      style: 'longDashed',
      width: SHAPE_SELECTION_BORDER_WIDTH,
    },
  };
}

function getPinLabelStyle(pinRadius: number, colorScheme?: IndicatorColorScheme): TextStyle {
  const color = colorScheme ? INDICATOR_COLOR_SCHEMES[colorScheme].color : INDICATOR_DEFAULT_COLOR;

  return {
    fontSize: 0.7*pinRadius,
    fontName: FONT_NAME,
    lineHeight: LINE_HEIGHT,
    align: 'center',
    verticalAlign: 'center',

    background: {
      color: color,
    },
  };
}
