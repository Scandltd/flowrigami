import { SHAPE_LABEL_STYLE } from '@app/flow/DefaultTheme';
import { FONT_NAME, FONT_SIZE, LINE_HEIGHT } from '@app/flow/DefaultThemeConstants';
import Shape from '@app/flow/diagram/bpmn/Shape';
import CoordinatePoint from '@app/flow/geometry/CoordinatePoint';
import ACTION from '@app/flow/store/ActionTypes';
import Store from '@app/flow/store/Store';
import { wrapText } from '@app/flow/utils/CanvasTextUtils';
import { drawTextLine } from '@app/flow/utils/CanvasUtils';
import { moveCursorToTheEnd } from '@app/flow/utils/HtmlUtils';


export default class Text extends Shape {
  private ctx: CanvasRenderingContext2D;

  private x: number;
  private y: number;
  private height: number;
  private width: number;
  public text: string; // @TODO remove public access

  constructor(ctx: CanvasRenderingContext2D, coordinates: CoordinatePoint, width: number, height: number) {
    super();
    this.ctx = ctx;
    this.x = coordinates.x;
    this.y = coordinates.y;
    this.width = width;
    this.height = height;
    this.text = '';
  }

  public draw() {
    const textLines = wrapText(this.ctx, SHAPE_LABEL_STYLE, this.text, this.width, !this.isActive ? this.height : undefined);
    const textLinesLength = textLines.length > 3 ? 3 : textLines.length;

    const MARGIN_TOP_MAGIC = 2;
    const y = this.y - (textLinesLength - 1)*LINE_HEIGHT/2 + MARGIN_TOP_MAGIC;

    textLines.forEach((it, i) => {
      drawTextLine(this.ctx, SHAPE_LABEL_STYLE, it, this.x, y + i*LINE_HEIGHT);
    });
  }

  public includes(coordinates: CoordinatePoint) {
    return !!this.text &&
      (coordinates.x >= this.x - this.width/2) && (coordinates.x <= this.x + this.width/2) &&
      (coordinates.y >= this.y - this.height/2) && (coordinates.y <= this.y + this.height/2);
  }

  public move(dx: number, dy: number) {
    this.x += dx;
    this.y += dy;
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
        this.text = editableArea.innerText;
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
    const textEditor = document.createElement('div');
    textEditor.setAttribute('contenteditable', 'true');
    textEditor.appendChild(document.createTextNode(this.text));

    Object.assign(textEditor.style, {
      position: 'absolute',
      top: `${this.y - this.height/2}px`,
      left: `${this.x - this.width/2}px`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      border: '0px dotted #000000',
      padding: '0',
      width: `${this.width}px`,
      minHeight: `${this.height}px`,
      backgroundColor: 'transparent',

      cursor: 'text',
      fontFamily: FONT_NAME,
      fontSize: `${FONT_SIZE}px`,
      lineHeight: `${LINE_HEIGHT}px`,
      textAlign: 'center',
      wordBreak: 'break-all',
    });

    return textEditor;
  }
}
