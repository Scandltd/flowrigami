import { SHAPE_LABEL_PADDING, TEXT_NODE_BORDER_COLOR_ACTIVE } from '@app/flow/DefaultThemeConstants';
import CanvasShape from '@app/flow/graphics/canvas/CanvasShape';
import TextParams from '@app/flow/graphics/TextParams';
import TextStyle from '@app/flow/graphics/TextStyle';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { wrapText } from '@app/flow/utils/CanvasTextUtils';
import { drawText, isPointInText, measureTextLine } from '@app/flow/utils/CanvasUtils';
import { moveCursorToTheEnd } from '@app/flow/utils/HtmlUtils';


export default class CanvasText extends CanvasShape {
  public name = 'CanvasText';

  private placeholder?: string;
  private p_text: string;

  private x: number;
  private y: number;
  private maxWidth?: number;
  private maxHeight?: number;
  private textStyle: TextStyle;

  constructor(canvas: HTMLCanvasElement, htmlLayer: HTMLElement, params: TextParams, textStyle: TextStyle) {
    super(canvas, htmlLayer);
    this.placeholder = params.placeholder;
    this.p_text = params.text;
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

  public get text() {
    return this.p_text;
  }

  public setText(text: string = '') {
    this.p_text = text;
  }

  public renderHtml(parent: HTMLElement, store: Store, id: string, isEditing: boolean) {
    if (isEditing) {
      const editableArea = this.createTextEditor();
      editableArea.onmousedown = (e) => {
        e.stopPropagation();
      };

      parent.appendChild(editableArea);

      editableArea.focus();
      moveCursorToTheEnd(editableArea);

      const closeEditor = () => {
        store.dispatch(ACTION.SET_INDICATOR_EDIT, { id: id, isEditing: false });
        store.dispatch(ACTION.SET_NODE_EDIT, { id: id, isEditing: false });
      };

      const outsideClickHandler = (e: MouseEvent) => {
        this.setText(editableArea.innerText);
        store.dispatch(ACTION.UPDATE_SHAPE_TEXT, { id: id, text: editableArea.innerText });

        if (editableArea !== e.target) {
          closeEditor();
          document.removeEventListener('mousedown', outsideClickHandler);
        }
      };

      editableArea.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          closeEditor();
          document.removeEventListener('mousedown', outsideClickHandler);
        }
      });

      document.addEventListener('mousedown', outsideClickHandler);
    }
  }

  /**
   * TODO: update when drawing logic is finalized
   * Use textRows to determine absolute postion and styles for text area
   */
  private createTextEditor() {
    const { fontName, fontSize, lineHeight, align, verticalAlign } = this.textStyle;

    const textEditor = document.createElement('div');
    textEditor.setAttribute('contenteditable', 'true');
    textEditor.appendChild(document.createTextNode(this.text));

    const left = align === 'center' ? this.getLeftIfAlignCenter() : this.x;
    const top = this.y - 0.5*(verticalAlign === 'center' ? (this.maxHeight || lineHeight) : lineHeight);
    const justifyContent = verticalAlign === 'center' ? 'center' : 'flex-start';

    Object.assign(textEditor.style, {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: justifyContent,
      padding: `${SHAPE_LABEL_PADDING}px`,
      width: `${this.maxWidth}px`,
      minHeight: `${this.maxHeight}px`,
      border: 'none',
      outline: `${TEXT_NODE_BORDER_COLOR_ACTIVE} solid 2px`,
      outlineOffset:'-1px',

      cursor: 'text',
      fontFamily: fontName,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`,
      textAlign: align,
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap',
    });

    return textEditor;
  }

  private getLeftIfAlignCenter() {
    const textLines = wrapText(this.ctx, this.textStyle, this.text, this.maxWidth);
    return this.x - (this.maxWidth ? this.maxWidth : measureTextLine(this.ctx, this.textStyle, textLines[0]).width)/2;
  }
}
