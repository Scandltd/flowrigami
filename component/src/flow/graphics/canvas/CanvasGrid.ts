import { GRID_COLOR, GRID_MAIN_LINE_COLOR, GRID_MAIN_LINE_STEP, GRID_MAIN_LINE_WIDTH, GRID_STEP, GRID_WIDTH } from '@app/flow/DefaultThemeConstants';


export default class CanvasGrid {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public draw(maxX: number, maxY: number) {
    this.ctx.save();
    for (let x = 0; x <= maxX; x += GRID_STEP) {
      this.drawLine({ x: x, y: 0 }, { x: x, y: maxY }, isMainLine(x));
    }
    for (let y = 0; y <= maxY; y += GRID_STEP) {
      this.drawLine({ x: 0, y: y }, { x: maxX, y: y }, isMainLine(y));
    }
    this.ctx.restore();
  }

  private drawLine(from: { x: number, y: number }, to: { x: number, y: number }, isMainLine: boolean) {
    this.ctx.strokeStyle = isMainLine ? GRID_MAIN_LINE_COLOR : GRID_COLOR;
    this.ctx.lineWidth = isMainLine ? GRID_MAIN_LINE_WIDTH : GRID_WIDTH;

    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }
}

function isMainLine(index: number) {
  return index === 0 || index%(GRID_STEP*GRID_MAIN_LINE_STEP) === 0;
}
