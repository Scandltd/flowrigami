import ShapeStyle from '@app/flow/graphics/ShapeStyle';


export type TextAlign = 'left' | 'center';
export type TextVerticalAlign = 'top' | 'center';

export default interface TextStyle extends ShapeStyle {
  fontName: string;
  fontSize: number;
  lineHeight: number;
  align: TextAlign;
  verticalAlign: TextVerticalAlign,
}
