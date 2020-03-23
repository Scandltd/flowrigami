import { SHAPE_LABEL_PADDING, TEXT_NODE_BORDER_COLOR_ACTIVE } from '@app/flow/DefaultThemeConstants';
import Shape from '@app/flow/graphics/Shape';
import TextParams from '@app/flow/graphics/TextParams';
import TextStyle from '@app/flow/graphics/TextStyle';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { wrapText } from '@app/flow/utils/CanvasTextUtils';
import { drawText, isPointInText, measureTextLine } from '@app/flow/utils/CanvasUtils';
import { moveCursorToTheEnd } from '@app/flow/utils/HtmlUtils';


export default class CanvasText implements Shape {
  private _isActive: boolean = false;
  public get isActive() { return this._isActive; }
  public set isActive(value: boolean) { this._isActive = value; }

  private _isHover: boolean = false;
  public get isHover() { return this._isHover; }
  public set isHover(value: boolean) { this._isHover = value; }

  protected canvas: HTMLCanvasElement;
  protected htmlLayer: HTMLElement;
  protected ctx: CanvasRenderingContext2D;

  private _text: string;
  public get text() { return this._text; }
  public set text(text: string) { this._text = text; }

  private placeholder?: string;

  private x: number;
  private y: number;
  private maxWidth?: number;
  private maxHeight?: number;
  private textStyle: TextStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: TextParams, textStyle: TextStyle) {
    this.canvas = canvas;
    this.htmlLayer = htmlLayer;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.placeholder = params.placeholder;
    this._text = params.text;
    this.x = params.x;
    this.y = params.y;
    this.maxWidth = params.maxWidth;
    this.maxHeight = params.maxHeight;
    this.textStyle = textStyle;
  }

  public draw() {
    const textParams = this.textParams;
    if (this.isActive) {
      textParams.maxHeight = undefined;
    }
    drawText(this.ctx, this.textStyle, textParams);
  }

  public includes(x: number, y: number) {
    const hasText = !!this.text;
    return hasText && isPointInText(this.ctx, this.textStyle, this.textParams, x, y);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
  }

  public get textParams(): TextParams {
    return {
      placeholder: this.placeholder,
      text: this.text,

      x: this.x,
      y: this.y,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
    };
  }


  // @TODO must be removed from here
  public renderHtml(parent: HTMLElement, store: Store, id: string, isEditing: boolean) {
    if (isEditing) {
      const textEditor = this.createTextEditor(parent);
      textEditor.focus();
      textEditor.onmousedown = (e) => {
        e.stopPropagation();
      };

      moveCursorToTheEnd(textEditor);

      const closeEditor = () => {
        store.dispatch(ACTION.SET_INDICATOR_EDIT, { id: id, isEditing: false });
        store.dispatch(ACTION.SET_NODE_EDIT, { id: id, isEditing: false });
      };

      const outsideClickHandler = (e: MouseEvent) => {
        const text = textEditor.innerText.trim();
        this._text = text;
        store.dispatch(ACTION.UPDATE_SHAPE_TEXT, { id: id, text: text });

        if (textEditor !== e.target) {
          closeEditor();
          document.removeEventListener('mousedown', outsideClickHandler);
        }
      };

      textEditor.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          closeEditor();
          document.removeEventListener('mousedown', outsideClickHandler);
        }
      });

      document.addEventListener('mousedown', outsideClickHandler);
    }
  }

  private createTextEditor(parent: HTMLElement) {
    const { fontName, fontSize, lineHeight, align, verticalAlign } = this.textStyle;

    const left = align === 'center' ? this.getLeftIfAlignCenter() : this.x;
    const top = this.y - 0.5*(verticalAlign === 'middle' ? (this.maxHeight || lineHeight) : 0);
    const justifyContent = verticalAlign === 'middle' ? 'center' : 'flex-start';

    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: justifyContent,
      padding: `${SHAPE_LABEL_PADDING}px`,
      ...(this.maxWidth ? { width: `${this.maxWidth}px` } : {}),
      minHeight: `${this.maxHeight ? this.maxHeight : (lineHeight + 2*SHAPE_LABEL_PADDING)}px`,
      border: 'none',
      outline: `${TEXT_NODE_BORDER_COLOR_ACTIVE} solid 2px`,
      outlineOffset: '-1px',
    });

    const displayFlexFixer = document.createElement('div');
    Object.assign(displayFlexFixer.style, {
      textAlign: align,
    });

    const textEditor = document.createElement('div');
    textEditor.setAttribute('contenteditable', 'true');
    textEditor.innerHTML = this._text;
    Object.assign(textEditor.style, {
      outline: 'none',
      cursor: 'text',
      fontFamily: fontName,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`,
      display: 'inline-block',
      verticalAlign: 'text-top', // fix for FF
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap',
    });

    container.appendChild(displayFlexFixer);
    displayFlexFixer.appendChild(textEditor);
    parent.appendChild(container);

    return textEditor;
  }

  private getLeftIfAlignCenter() {
    const textLines = wrapText(this.ctx, this.textStyle, this.text, this.maxWidth);
    return this.x - (this.maxWidth ? this.maxWidth : measureTextLine(this.ctx, this.textStyle, textLines[0]).width)/2;
  }
}
