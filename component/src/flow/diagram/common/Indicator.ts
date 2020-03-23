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
import CanvasText from '@app/flow/graphics/canvas/CanvasText';
import CanvasPin from '@app/flow/graphics/canvas/shapes/CanvasPin';
import Shape from '@app/flow/graphics/Shape';
import ShapeStyle from '@app/flow/graphics/ShapeStyle';
import TextStyle from '@app/flow/graphics/TextStyle';
import Store from '@app/flow/store/Store';
import { drawTextLine } from '@app/flow/utils/CanvasUtils';
import { shortenNumber } from '@app/flow/utils/NumberUtils';
import nanoid from 'nanoid';


type IndicatorColorScheme = 'success' | 'info' | 'warn' | 'error';

export function isIndicatorColorScheme(style: any): style is IndicatorColorScheme {
  return ['success', 'info', 'warn', 'error'].includes(style);
}

export interface IndicatorParams {
  id?: string;
  label?: string;
  x: number;
  y: number;
  radius: number;
}

export default class Indicator implements Shape {
  public readonly id: string;

  private _label: string;
  public get label() { return this._label; }
  public set label(label: string) {
    this._label = label;
    this.textEditor.text = this.label;
  }

  private x: number;
  private y: number;
  private radius: number;

  private value: number = 0;
  private colorScheme?: IndicatorColorScheme;

  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected _isEditing = false;
  public get isEditing() { return this._isEditing; }
  public set isEditing(isEditing: boolean) { this._isEditing = isEditing; }

  private pin: CanvasPin;
  private pinHover: CanvasPin;
  private textEditor: CanvasText;

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: IndicatorParams) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.id = params.id || nanoid();
    this._label = params.label || '';
    this.x = params.x;
    this.y = params.y;
    this.radius = params.radius;

    this.pin = new CanvasPin(canvas, htmlLayer, getPinStyle(this.colorScheme), params);
    this.pinHover = new CanvasPin(canvas, htmlLayer, getPinHoverStyle(), { ...params, radius: 1.25*params.radius });

    this.textEditor = new CanvasText(canvas, htmlLayer, {
      text: this.label,
      x: this.x + 0.5*this.radius,
      y: this.y + 1.5*this.radius,
      maxWidth: SHAPE_LABEL_WIDTH,
      maxHeight: SHAPE_LABEL_HEIGHT,
    }, SHAPE_LABEL_STYLE);
  }

  public getParams(): IndicatorParams {
    return {
      id: this.id,
      label: this._label,
      x: this.x,
      y: this.y,
      radius: this.radius,
    };
  };

  public draw() {
    this.pin.draw();
    if (this.isHover || this.isActive) {
      this.pinHover.draw();
    }
    this.drawLabel();

    this.textEditor.isActive = this.isActive;
    if (!this.isEditing) {
      this.textEditor.draw();
    }
  }

  private drawLabel() {
    const label = shortenNumber(this.value);
    drawTextLine(this.ctx, getPinLabelStyle(this.radius, this.colorScheme), label, this.x, this.y);
  }

  public includes(x: number, y: number) {
    return this.pin.includes(x, y) || this.textEditor.includes(x, y);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;

    this.pin.move(dx, dy);
    this.pinHover.move(dx, dy);
    this.textEditor.move(dx, dy);
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
    verticalAlign: 'middle',

    background: {
      color: color,
    },
  };
}
