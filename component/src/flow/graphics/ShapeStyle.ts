export type BorderStyle = 'dotted' | 'dashed' | 'solid' | 'longDashed' | number[];

interface Path2DStyle {
  background?: {
    color: string;
  };
  border?: {
    width: number;
    color: string;
    style: BorderStyle;
  };
}

export default interface ShapeStyle extends Path2DStyle {
  hover?: Path2DStyle;
  active?: Path2DStyle;
}
